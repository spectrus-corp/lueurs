/* ---- Multijoueur + chat (MQTT public broker) ---- */
(function(){
const BROKERS=[
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://broker.emqx.io:8084/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];
let client=null,roomCode=null,mpName='Joueur',myId='',brokerIdx=0,pollOk=false;
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
function killClient(){
  try{if(client){client.end(true);client=null}}catch(e){}
  roomCode=null;pollOk=false;
  closeChatUI();
  try{$('mpCodeBox').hidden=true;$('mpLeave').hidden=true}catch(e){}
  setStatus('')}
function pub(obj){
  if(!client||!roomCode)return;
  try{client.publish(topic(roomCode),JSON.stringify(Object.assign({id:myId,ts:Date.now()},obj)),{qos:0})}catch(e){}}
function onMsg(raw){
  let d;try{d=JSON.parse(raw)}catch(e){return}
  if(!d||d.id===myId)return;
  if(d.t==='chat'&&d.msg)chatAdd('them',String(d.msg).slice(0,200),d.name||'Pote');
  if(d.t==='join'){chatAdd('sys',(d.name||'Un joueur')+' a rejoint');$('chatPeer').textContent='avec '+(d.name||'pote');pub({t:'here',name:mpName})}
  if(d.t==='here'){$('chatPeer').textContent='avec '+(d.name||'pote');chatAdd('sys',(d.name||'Pote')+' est en ligne')}
  if(d.t==='bye'){chatAdd('sys',(d.name||'Pote')+' a quitt\u00e9');$('chatPeer').textContent=''}
}
function connectBroker(code,asHost){
  if(typeof mqtt==='undefined'){setStatus('Lib MQTT manquante \u2014 recharge la page',false);return}
  killClient();
  roomCode=code.toUpperCase();
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
      setStatus(asHost?'Donne ce code \u00e0 ton pote':'Dans le salon !',true);
      openChatUI();
      chatAdd('sys','Salon '+roomCode+(asHost?' \u2014 en attente\u2026':''));
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

$('bm').onclick=()=>{$('msg').hidden=true;$('mp').hidden=false;setStatus(roomCode?('Salon '+roomCode):'')};
$('mpBack').onclick=()=>{$('mp').hidden=true;if(!run)$('msg').hidden=false};
$('mpNew').onclick=()=>{brokerIdx=0;hostSession()};
$('mpJoin').onclick=()=>{brokerIdx=0;joinSession()};
$('mpIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();brokerIdx=0;joinSession()}});
$('mpLeave').onclick=()=>leave();
$('chatForm').onsubmit=e=>{e.preventDefault();const v=$('chatIn').value;$('chatIn').value='';sendChat(v)};
$('chatBtn').onclick=()=>{$('chat').classList.toggle('open')};
$('chatX').onclick=()=>{if(matchMedia('(max-width:800px)').matches)$('chat').classList.remove('open')};
addEventListener('pagehide',()=>{try{pub({t:'bye',name:mpName})}catch(e){}});
})();
