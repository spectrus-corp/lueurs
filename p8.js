/* ---- Multijoueur : Collecte commune + Battle ---- */
(function(){
const BROKERS=[
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://broker.emqx.io:8084/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];
let client=null,roomCode=null,mpName='Joueur',myId='',brokerIdx=0,pollOk=false,amHost=false;
let RP=null,rpName='',rpTarget=null,lastPosSend=0,lastWorldSend=0,lastSeen=0,skipOrbUntil=0;
let mpMode='coop',mpPlaying=false,teamScore=0,myMpScore=0,peerMpScore=0,mpTimer=0,mpGoal=60,teamLives=5,peerAlive=true;
try{const n=localStorage.getItem('lueursName');if(n&&n.trim())mpName=n.trim().slice(0,12)}catch(e){}
myId='u'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);

function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
function topic(code){return 'lueurs/mp/v2/'+String(code).toUpperCase()}
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
  try{$('mpLeave').hidden=false}catch(e){}
}
function closeChatUI(){
  document.body.classList.remove('mp-on');
  try{$('chat').hidden=true;$('chat').classList.remove('open');$('chatBtn').hidden=true}catch(e){}
}
function killRemote(){
  if(RP){try{S.remove(RP)}catch(e){}RP=null}
  rpTarget=null;rpName='';try{$('chatPeer').textContent=''}catch(e){}
}
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
  roomCode=null;pollOk=false;amHost=false;mpPlaying=false;window.mpPlaying=false;
  killRemote();closeChatUI();
  try{$('mpCodeBox').hidden=true;$('mpLeave').hidden=true;$('mpPlay').hidden=true}catch(e){}
  setStatus('');
  try{$('mpHud').hidden=true}catch(e){}
}
function pub(obj){
  if(!client||!roomCode)return;
  try{client.publish(topic(roomCode),JSON.stringify(Object.assign({id:myId,ts:Date.now()},obj)),{qos:0})}catch(e){}
}
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
    if(mpPlaying){
      if(mpMode==='coop'&&d.q==='g'){
        teamScore+=(d.pts||1);
        updateMpHud();
        if(teamScore>=mpGoal)endMp('win','Objectif atteint ensemble !');
      }
      if(mpMode==='battle'&&typeof d.sc==='number'){peerMpScore=d.sc;updateMpHud()}
    }
  }catch(e){}
}
function updateMpHud(){
  const el=$('mpHud');if(!el)return;
  el.hidden=!mpPlaying;
  if(!mpPlaying)return;
  if(mpMode==='coop'){
    el.innerHTML='<b>Collecte</b> \u00b7 \u00c9quipe <span style="color:var(--g)">'+teamScore+'/'+mpGoal+'</span> \u00b7 Vies \u2665'+teamLives+(mpTimer>0?' \u00b7 '+Math.ceil(mpTimer)+'s':'');
  }else{
    const t=Math.max(0,Math.ceil(mpTimer));
    el.innerHTML='<b>Battle</b> \u00b7 Toi <span style="color:var(--g)">'+myMpScore+'</span> \u2014 Pote <span style="color:var(--c)">'+peerMpScore+'</span> \u00b7 '+t+'s';
  }
}
function setMode(m){
  mpMode=m==='battle'?'battle':'coop';
  try{
    $('mpModeCoop').classList.toggle('on',mpMode==='coop');
    $('mpModeBattle').classList.toggle('on',mpMode==='battle');
    $('mpModeDesc').textContent=mpMode==='coop'
      ?'Collecte commune : score d\u2019\u00e9quipe, vies partag\u00e9es, objectif \u00e0 atteindre ensemble.'
      :'Battle : scores s\u00e9par\u00e9s, 90 secondes, le plus de points gagne. Se toucher = knockback.';
  }catch(e){}
  if(amHost&&pollOk)pub({t:'mode',mode:mpMode});
}
function beginMpRun(){
  mpPlaying=true;window.mpPlaying=true;teamScore=0;myMpScore=0;peerMpScore=0;peerAlive=true;
  if(mpMode==='coop'){mpGoal=60;teamLives=5;mpTimer=0}
  else{mpGoal=0;mpTimer=90;teamLives=3}
  try{start(false)}catch(e){}
  if(mpMode==='coop'){lives=teamLives}
  updateMpHud();
  banner(mpMode==='coop'?'Collecte \u00b7 Objectif '+mpGoal:'Battle \u00b7 90 s');
  seq([440,554,660,880],.07,'triangle');
  chatAdd('sys',mpMode==='coop'?'Mode Collecte lanc\u00e9 \u2014 visez '+mpGoal+' pts ensemble !':'Mode Battle lanc\u00e9 \u2014 90 secondes !');
}
function endMp(result,msg){
  if(!mpPlaying)return;
  mpPlaying=false;window.mpPlaying=false;
  try{$('mpHud').hidden=true}catch(e){}
  run=false;shield=0;try{sh.visible=false}catch(e){}
  try{killGreen()}catch(e){}
  let title='Fin multijoueur', body=msg||'';
  if(mpMode==='coop'){
    title=result==='win'?'Victoire d\u2019\u00e9quipe !':'D\u00e9faite d\u2019\u00e9quipe';
    body=(msg||'')+' Score \u00e9quipe : '+teamScore+'/'+mpGoal+'.';
    if(result==='win'){wallet+=800;try{save()}catch(e){}}
  }else{
    const win=myMpScore>peerMpScore, draw=myMpScore===peerMpScore;
    title=draw?'\u00c9galit\u00e9 !':(win?'Tu gagnes !':'Tu perds\u2026');
    body='Toi '+myMpScore+' \u2014 Pote '+peerMpScore+'.';
    if(win){wallet+=600;try{save()}catch(e){}}
  }
  try{
    $('t').textContent=title;
    $('p').textContent=body+' Portefeuille : '+fmt(wallet)+' lueurs.';
    $('b').textContent='Menu';
    $('msg').hidden=false;$('go').hidden=true;
  }catch(e){}
  seq([392,330,262,196],.14,'sawtooth');
  pub({t:'over',result,msg:body,teamScore,myMpScore,peerMpScore,mode:mpMode});
}
function onMsg(raw){
  let d;try{d=JSON.parse(raw)}catch(e){return}
  if(!d||d.id===myId)return;
  if(d.t==='chat'&&d.msg)chatAdd('them',String(d.msg).slice(0,200),d.name||'Pote');
  if(d.t==='join'){
    chatAdd('sys',(d.name||'Un joueur')+' a rejoint');
    try{$('chatPeer').textContent='avec '+(d.name||'pote')}catch(e){}
    ensureRemote(d.name);pub({t:'here',name:mpName,mode:mpMode});
    if(amHost&&run)lastWorldSend=0;
    try{if(amHost)$('mpPlay').hidden=false}catch(e){}
  }
  if(d.t==='here'){
    try{$('chatPeer').textContent='avec '+(d.name||'pote')}catch(e){}
    chatAdd('sys',(d.name||'Pote')+' est en ligne');
    ensureRemote(d.name);
    if(d.mode)setMode(d.mode);
    try{if(amHost)$('mpPlay').hidden=false}catch(e){}
  }
  if(d.t==='mode'&&d.mode){setMode(d.mode);chatAdd('sys','Mode : '+(d.mode==='battle'?'Battle':'Collecte'))}
  if(d.t==='bye'){chatAdd('sys',(d.name||'Pote')+' a quitt\u00e9');try{$('chatPeer').textContent=''}catch(e){}killRemote();if(mpPlaying){peerAlive=false;chatAdd('sys','Ton pote est parti')}}
  if(d.t==='start'){
    if(d.mode)setMode(d.mode);
    try{$('mp').hidden=true;$('msg').hidden=true}catch(e){}
    beginMpRun();
  }
  if(d.t==='over'&&mpPlaying){
    mpPlaying=false;window.mpPlaying=false;try{$('mpHud').hidden=true}catch(e){}
    run=false;
    try{
      $('t').textContent='Fin multijoueur';
      $('p').textContent=(d.msg||'Partie termin\u00e9e')+' Portefeuille : '+fmt(wallet)+' lueurs.';
      $('b').textContent='Menu';$('msg').hidden=false;$('go').hidden=true;
    }catch(e){}
  }
  if(d.t==='pos'){
    ensureRemote(d.name);
    rpTarget={x:+d.x,z:+d.z,ry:+d.ry};lastSeen=performance.now();
    if(RP)RP.visible=true;
    if(mpPlaying&&mpMode==='battle'&&typeof d.sc==='number'){peerMpScore=d.sc;updateMpHud()}
    if(mpPlaying&&mpMode==='coop'&&typeof d.tl==='number'){teamLives=Math.min(teamLives,d.tl)}
  }
  if(d.t==='w')applyWorld(d);
  if(d.t==='take')applyTake(d);
  if(d.t==='bump'&&mpPlaying&&mpMode==='battle'){
    try{
      const dx=P.position.x-(+d.x||0),dz=P.position.z-(+d.z||0),l=Math.hypot(dx,dz)||1;
      vel.x+=dx/l*10;vel.z+=dz/l*10;
    }catch(e){}
  }
  if(d.t==='team'&&mpPlaying&&mpMode==='coop'){
    if(typeof d.score==='number')teamScore=Math.max(teamScore,d.score);
    if(typeof d.lives==='number')teamLives=d.lives;
    updateMpHud();
    if(teamScore>=mpGoal)endMp('win','Objectif atteint ensemble !');
    if(teamLives<=0)endMp('lose','Plus de vies d\u2019\u00e9quipe\u2026');
  }
}
function connect(code,asHost){
  killClient();
  roomCode=String(code).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  if(roomCode.length<4){setStatus('Code trop court',false);return}
  amHost=!!asHost;
  const url=BROKERS[brokerIdx%BROKERS.length];
  setStatus('Connexion\u2026');
  try{
    client=mqtt.connect(url,{clientId:'lueurs_'+myId,clean:true,reconnectPeriod:2500,connectTimeout:8000});
  }catch(e){setStatus('Broker indisponible',false);return}
  client.on('connect',()=>{
    pollOk=true;
    client.subscribe(topic(roomCode),{qos:0},err=>{
      if(err){setStatus('Abonnement \u00e9chou\u00e9',false);return}
      setStatus('Salon '+roomCode+(amHost?' (h\u00f4te)':' (invit\u00e9)'),true);
      try{
        $('mpCodeBox').hidden=false;$('mpCodeBox').textContent=roomCode;
        $('mpLeave').hidden=false;
        if(amHost)$('mpPlay').hidden=false;
      }catch(e){}
      openChatUI();
      pub({t:asHost?'here':'join',name:mpName,mode:mpMode});
      chatAdd('sys','Connect\u00e9 \u00b7 mode '+(mpMode==='battle'?'Battle':'Collecte'));
    });
  });
  client.on('message',(t,p)=>onMsg(p.toString()));
  client.on('error',()=>{});
  client.on('close',()=>{if(roomCode)setStatus('D\u00e9connect\u00e9 \u2014 reconnexion\u2026',false)});
}
function hostSession(){const c=genCode();setMode(mpMode);connect(c,true)}
function joinSession(){const c=($('mpIn').value||'').trim();if(!c){setStatus('Entre un code',false);return}connect(c,false)}
function leave(){try{pub({t:'bye',name:mpName})}catch(e){}setTimeout(()=>{killClient();setStatus('Session quitt\u00e9e')},150)}
function launchMp(){
  if(!amHost||!pollOk){setStatus('Seul l\u2019h\u00f4te lance la partie',false);return}
  pub({t:'start',mode:mpMode});
  try{$('mp').hidden=true;$('msg').hidden=true}catch(e){}
  beginMpRun();
}

window.mpOnTake=function(ox,oz,q,nx,nz,nk){
  if(!pollOk||!roomCode)return;
  skipOrbUntil=performance.now()+400;
  let pts=0;
  if(mpPlaying&&q==='g'){
    if(mpMode==='coop'){pts=1+(combo>1?combo-1:0);teamScore+=pts;pub({t:'team',score:teamScore,lives:teamLives});updateMpHud();if(teamScore>=mpGoal)endMp('win','Objectif atteint ensemble !')}
    if(mpMode==='battle'){myMpScore=score;pts=1}
  }
  pub({t:'take',ox:+(+ox).toFixed(2),oz:+(+oz).toFixed(2),nx:+(+nx).toFixed(2),nz:+(+nz).toFixed(2),nk,q,pts,sc:score,name:mpName});
  if(amHost)lastWorldSend=0;
};
window.mpOnDeath=function(){
  if(!mpPlaying)return;
  if(mpMode==='battle'){myMpScore=score;endMp(myMpScore>=peerMpScore?'win':'lose','Tu es tomb\u00e9\u2026 score final '+myMpScore)}
  else{teamLives=0;endMp('lose','Un joueur est \u00e0 court de vies\u2026')}
};
window.mpOnHit=function(){
  if(!mpPlaying)return false;
  if(mpMode==='coop'){
    teamLives=Math.max(0,teamLives-1);lives=teamLives;
    pub({t:'team',score:teamScore,lives:teamLives});
    updateMpHud();
    if(teamLives<=0){endMp('lose','Plus de vies d\u2019\u00e9quipe\u2026');return true}
    return false;
  }
  lives--;
  if(lives<=0){myMpScore=score;endMp(myMpScore>=peerMpScore?'win':'lose','Tu es tomb\u00e9\u2026 '+myMpScore+' pts');return true}
  return false;
};
window.mpTick=function(dt){
  if(!pollOk||!roomCode)return;
  const now=performance.now();
  if(run&&now-lastPosSend>80){
    lastPosSend=now;
    if(mpPlaying&&mpMode==='battle')myMpScore=score;
    pub({t:'pos',x:+P.position.x.toFixed(2),z:+P.position.z.toFixed(2),ry:+P.rotation.y.toFixed(3),name:mpName,sc:mpPlaying&&mpMode==='battle'?myMpScore:score,lv:lives,tl:teamLives});
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
    if(mpPlaying&&mpMode==='battle'&&run&&RP.visible){
      const d=Math.hypot(P.position.x-RP.position.x,P.position.z-RP.position.z);
      if(d<1.4){
        const dx=P.position.x-RP.position.x,dz=P.position.z-RP.position.z,l=Math.hypot(dx,dz)||1;
        vel.x+=dx/l*14;vel.z+=dz/l*14;
        pub({t:'bump',x:P.position.x,z:P.position.z});
      }
    }
  }
  if(mpPlaying&&run){
    if(mpMode==='battle'){
      mpTimer-=dt;updateMpHud();
      if(mpTimer<=0){
        myMpScore=score;
        endMp(myMpScore>=peerMpScore?'win':'lose',myMpScore>peerMpScore?'Tu m\u00e8nes !':myMpScore===peerMpScore?'Match nul':'Le pote m\u00e8ne\u2026');
      }
    }else updateMpHud();
  }
};

$('bm').onclick=()=>{$('msg').hidden=true;$('mp').hidden=false;setStatus(roomCode?('Salon '+roomCode):'');setMode(mpMode)};
$('mpBack').onclick=()=>{$('mp').hidden=true;if(!run)$('msg').hidden=false};
$('mpNew').onclick=()=>{brokerIdx=0;hostSession()};
$('mpJoin').onclick=()=>{brokerIdx=0;joinSession()};
$('mpIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();brokerIdx=0;joinSession()}});
$('mpLeave').onclick=()=>leave();
try{$('mpPlay').onclick=()=>launchMp()}catch(e){}
try{$('mpModeCoop').onclick=()=>{if(amHost||!pollOk)setMode('coop')}}catch(e){}
try{$('mpModeBattle').onclick=()=>{if(amHost||!pollOk)setMode('battle')}}catch(e){}
$('chatForm').onsubmit=e=>{e.preventDefault();const v=$('chatIn').value;$('chatIn').value='';if(!v||!v.trim())return;chatAdd('me',v.trim(),mpName);pub({t:'chat',msg:v.trim(),name:mpName})};
$('chatBtn').onclick=()=>{$('chat').classList.toggle('open')};
$('chatX').onclick=()=>{if(matchMedia('(max-width:800px)').matches)$('chat').classList.remove('open')};
['chatIn','mpIn','cdIn','nm'].forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener('keydown',e=>{e.stopPropagation()});
  el.addEventListener('keyup',e=>{e.stopPropagation()});
});
addEventListener('pagehide',()=>{try{pub({t:'bye',name:mpName})}catch(e){}});
})();
