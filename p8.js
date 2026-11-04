/* ---- Multijoueur + chat (MQTT) + map partag\u00e9e ---- */
(function(){
const BROKERS=[
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://broker.emqx.io:8084/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];
let client=null,roomCode=null,mpName='Joueur',myId='',brokerIdx=0,pollOk=false,amHost=false;
let RP=null,rpName='',rpTarget=null,lastPosSend=0,lastWorldSend=0,lastSeen=0,skipOrbUntil=0;
try{const n=localStorage.getItem('lueursName');if(n&&n.trim())mpName=n.trim().slice(0,12)}catch(e){}
myId='u'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);

function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
function topic(code){return 'lueurs/mp/v1/'+String(code).toUpperCase()}
function setStatus(t,ok){const el=$('mpStatus');if(!el)return;el.textContent=t||'';el.style.color=ok===false?'var(--r)':ok===true?'var(--g)':'var(--c)'}
function chatAdd(kind,text,name){
  const log=$('chatLog');if(!log)return;
  const d=document.createElement('div');
  if(kind==='sys'){d.className='sys';d.textContent=text}
  else{d.className=kind==='me'?'me':'them';if(name){const n=document.createElement('span');n.className='nm';n.textContent=name;d.appendChild(n)}
    d.appendChild(document.createTextNode(text))}
  log.appendChild(d);log.scrollTop=log.scrollHeight}
function openChatUI(){
  document.body.classList.add('mp-on');
  $('chat').hidden=false;$('chat').classList.add('open');
  $('chatCode').textContent=roomCode||'\u2014';
  $('chatBtn').hidden=false;
  $('mpLeave').hidden=false}
function closeChatUI(){
  document.body.classList.remove('mp-on');
  $('chat').hidden=true;$('chat').classList.remove('open');
  $('chatBtn').hidden=true}
function killRemote(){
  if(RP){try{S.remove(RP)}catch(e){}RP=null}
  rpTarget=null;rpName='';try{$('chatPeer').textContent=''}catch(e){}}
function ensureRemote(name){
  if(!RP){
    RP=new THREE.Group();
    const body=new THREE.Mesh(
      new THREE.ConeGeometry(.55,1.15,10),
      new THREE.MeshStandardMaterial({color:0x6be3ff,emissive:0x1a6a9a,emissiveIntensity:1.1,roughness:.45,metalness:.2})
    );
    body.rotation.x=Math.PI;body.position.y=.55;RP.add(body);
    const glow=new THREE.PointLight(0x6be3ff,.9,11);glow.position.y=1.6;RP.add(glow);
    const ring=new THREE.Mesh(
      new THREE.RingGeometry(.5,.7,24),
      new THREE.MeshBasicMaterial({color:0x6be3ff,transparent:true,opacity:.35,side:THREE.DoubleSide})
    );
    ring.rotation.x=-Math.PI/2;ring.position.y=.05;RP.add(ring);
    S.add(RP);
  }
  if(name)rpName=name;
}
function killClient(){
  try{if(client){client.end(true);client=null}}catch(e){}
  roomCode=null;pollOk=false;amHost=false;
  killRemote();closeChatUI();
  try{$('mpCodeBox').hidden=true;$('mpLeave').hidden=true}catch(e){}
  setStatus('')}
function pub(obj){
  if(!client||!roomCode)return;
  try{client.publish(topic(roomCode),JSON.stringify(Object.assign({id:myId,ts:Date.now()},obj)),{qos:0})}catch(e){}}
function applyWorld(d){
  if(!d||amHost)return;
  const now=performance.now();
  try{
    if(Array.isArray(d.o)){
      while(orbs.length<d.o.length)mkOrb();
      while(orbs.length>d.o.length){const o=orbs.pop();S.remove(o)}
      d.o.forEach((s,i)=>{
        const o=orbs[i];if(!o)return;
        if(now<skipOrbUntil)return;
        o.position.x=s.x;o.position.z=s.z;o.position.y=1;
        if(s.k&&o.userData.k!==s.k)kind(o,s.k);
      });
    }
    if(Array.isArray(d.h)){
      while(haz.length<d.h.length)mkHaz((d.h[haz.length]&&d.h[haz.length].ty==='c')?'c':'d');
      while(haz.length>d.h.length){const h=haz.pop();S.remove(h)}
      d.h.forEach((s,i)=>{
        const h=haz[i];if(!h)return;
        h.position.x=s.x;h.position.z=s.z;
        if(typeof s.vx==='number'){h.userData.v.x=s.vx;h.userData.v.z=s.vz}
      });
    }
    if(typeof d.wave==='number')wave=d.wave;
  }catch(e){}
}
function applyTake(d){
  if(!d)return;
  try{
    let best=null,bd=9;
    for(const o of orbs){
      const dd=Math.hypot(o.position.x-d.ox,o.position.z-d.oz);
      if(dd<bd){bd=dd;best=o}
    }
    if(best&&bd<3.5){
      if(typeof d.nx==='number'){best.position.set(d.nx,1,d.nz);if(d.nk)kind(best,d.nk)}
      else{kind(best,rk());best.position.set(rnd(),1,rnd())}
    }
  }catch(e){}
}
function onMsg(raw){
  let d;try{d=JSON.parse(raw)}catch(e){return}
  if(!d||d.id===myId)return;
  if(d.t==='chat'&&d.msg)chatAdd('them',String(d.msg).slice(0,200),d.name||'Pote');
  if(d.t==='join'){chatAdd('sys',(d.name||'Un joueur')+' a rejoint');$('chatPeer').textContent='avec '+(d.name||'pote');ensureRemote(d.name);pub({t:'here',name:mpName});if(amHost&&run)lastWorldSend=0}
  if(d.t==='here'){$('chatPeer').textContent='avec '+(d.name||'pote');chatAdd('sys',(d.name||'Pote')+' est en ligne');ensureRemote(d.name)}
  if(d.t==='bye'){chatAdd('sys',(d.name||'Pote')+' a quitt\u00e9');$('chatPeer').textContent='';killRemote()}
  if(d.t==='pos'){
    ensureRemote(d.name);
    rpTarget={x:+d.x,z:+d.z,ry:+d.ry||0};
    lastSeen=performance.now();
    if(RP)RP.visible=true;
  }
  if(d.t==='w')applyWorld(d);
  if(d.t==='take')applyTake(d);
}
function connectBroker(code,asHost){
  if(typeof mqtt==='undefined'){setStatus('Lib MQTT manquante \u2014 recharge la page',false);return}
  killClient();
  roomCode=code.toUpperCase();amHost=!!asHost;
  setStatus('Connexion au salon\u2026');
  $('mpCodeBox').hidden=false;$('mpCodeBox').textContent=roomCode;
  const url=BROKERS[brokerIdx%BROKERS.length];
  let settled=false;
  try{client=mqtt.connect(url,{clientId:'lueurs_'+myId,clean:true,reconnectPeriod:2000,connectTimeout:8000})}
  catch(e){setStatus('\u00c9chec connexion broker',false);return}
  const failTimer=setTimeout(()=>{
    if(settled)return;
    settled=true;
    try{client.end(true)}catch(e){}
    client=null;brokerIdx++;
    if(brokerIdx<BROKERS.length){setStatus('Broker lent, essai suivant\u2026');connectBroker(code,asHost)}
    else setStatus('Impossible de rejoindre le r\u00e9seau (r\u00e9essaie)',false);
  },9000);
  client.on('connect',()=>{
    if(settled&&pollOk)return;
    settled=true;pollOk=true;clearTimeout(failTimer);
    client.subscribe(topic(roomCode),{qos:0},err=>{
      if(err){setStatus('Abonnement \u00e9chou\u00e9',false);return}
      setStatus(asHost?'Donne ce code \u00e0 ton pote \u2014 m\u00eame map':'Dans le salon (m\u00eame map) !',true);
      openChatUI();
      chatAdd('sys','Salon '+roomCode+(asHost?' \u2014 en attente\u2026':'')+' \u00b7 map partag\u00e9e');
      pub({t:'join',name:mpName});
    });
  });
  client.on('message',(t,payload)=>{onMsg(payload.toString())});
  client.on('error',()=>{});
  client.on('close',()=>{if(pollOk&&roomCode)setStatus('Reconnect\u2026',false)});
}
function hostSession(){connectBroker(genCode(),true)}
function joinSession(){
  const code=($('mpIn').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  $('mpIn').value=code;
  if(code.length<4){setStatus('Code trop court',false);return}
  connectBroker(code,false);
}
function sendChat(msg){
  msg=String(msg||'').trim().slice(0,200);
  if(!msg)return;
  chatAdd('me',msg,mpName);
  if(!client||!pollOk){chatAdd('sys','Pas encore connect\u00e9');return}
  pub({t:'chat',msg,name:mpName});
}
function leave(){
  pub({t:'bye',name:mpName});
  setTimeout(()=>{killClient();setStatus('Session quitt\u00e9e')},150);
}

window.mpOnTake=function(ox,oz,q,nx,nz,nk){
  if(!pollOk||!roomCode)return;
  skipOrbUntil=performance.now()+400;
  pub({t:'take',ox:+(+ox).toFixed(2),oz:+(+oz).toFixed(2),nx:+(+nx).toFixed(2),nz:+(+nz).toFixed(2),nk,q,name:mpName});
  if(amHost)lastWorldSend=0;
};
window.mpTick=function(dt){
  if(!pollOk||!roomCode)return;
  const now=performance.now();
  if(run&&now-lastPosSend>80){
    lastPosSend=now;
    pub({t:'pos',x:+P.position.x.toFixed(2),z:+P.position.z.toFixed(2),ry:+P.rotation.y.toFixed(3),name:mpName,sc:score,lv:lives});
  }
  if(amHost&&run&&now-lastWorldSend>180){
    lastWorldSend=now;
    pub({t:'w',wave,got,
      o:orbs.map(o=>({x:+o.position.x.toFixed(2),z:+o.position.z.toFixed(2),k:o.userData.k})),
      h:haz.map(h=>({x:+h.position.x.toFixed(2),z:+h.position.z.toFixed(2),ty:h.userData.t,vx:+(h.userData.v.x||0).toFixed(2),vz:+(h.userData.v.z||0).toFixed(2)}))
    });
  }
  if(RP&&rpTarget){
    RP.position.x+=(rpTarget.x-RP.position.x)*Math.min(1,10*dt);
    RP.position.z+=(rpTarget.z-RP.position.z)*Math.min(1,10*dt);
    RP.position.y=0;
    const dy=rpTarget.ry-RP.rotation.y;
    RP.rotation.y+=Math.atan2(Math.sin(dy),Math.cos(dy))*Math.min(1,10*dt);
    if(now-lastSeen>4000)RP.visible=false;
  }
};

$('bm').onclick=()=>{$('msg').hidden=true;$('mp').hidden=false;setStatus(roomCode?('Salon '+roomCode):'')};
$('mpBack').onclick=()=>{$('mp').hidden=true;if(!run)$('msg').hidden=false};
$('mpNew').onclick=()=>{brokerIdx=0;hostSession()};
$('mpJoin').onclick=()=>{brokerIdx=0;joinSession()};
$('mpIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();brokerIdx=0;joinSession()}});
$('mpLeave').onclick=()=>leave();
$('chatForm').onsubmit=e=>{e.preventDefault();const v=$('chatIn').value;$('chatIn').value='';sendChat(v)};
$('chatBtn').onclick=()=>{$('chat').classList.toggle('open')};
$('chatX').onclick=()=>{if(matchMedia('(max-width:800px)').matches)$('chat').classList.remove('open')};
['chatIn','mpIn','cdIn','nm'].forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener('keydown',e=>{e.stopPropagation()});
  el.addEventListener('keyup',e=>{e.stopPropagation()});
});
addEventListener('pagehide',()=>{try{pub({t:'bye',name:mpName})}catch(e){}});
})();
