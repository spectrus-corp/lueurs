/* ---- Multijoueur + chat (PeerJS) ---- */
(function(){
const PEER_OPTS={debug:0,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:global.stun.twilio.com:3478'}]}};
let peer=null,conn=null,roomCode=null,isHost=false,mpName='Joueur';
try{const n=localStorage.getItem('lueursName');if(n&&n.trim())mpName=n.trim().slice(0,12)}catch(e){}

function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
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
  $('chatBtn').hidden=false}
function closeChatUI(){
  document.body.classList.remove('mp-on');
  $('chat').hidden=true;$('chat').classList.remove('open');
  $('chatBtn').hidden=true}
function killPeer(){
  try{if(conn)conn.close()}catch(e){}
  try{if(peer)peer.destroy()}catch(e){}
  conn=null;peer=null;roomCode=null;isHost=false;
  closeChatUI();
  $('mpCodeBox').hidden=true;$('mpLeave').hidden=true;
  setStatus('')}
function wireConn(c){
  conn=c;
  c.on('open',()=>{
    setStatus('Connect\u00e9 avec ton pote !',true);
    chatAdd('sys','Connect\u00e9 \u2014 vous pouvez chatter');
    openChatUI();
    try{c.send({t:'hello',name:mpName})}catch(e){}
    $('mpLeave').hidden=false;
  });
  c.on('data',d=>{
    if(!d||typeof d!=='object')return;
    if(d.t==='chat'&&d.msg)chatAdd('them',String(d.msg).slice(0,200),d.name||'Pote');
    if(d.t==='hello'){$('chatPeer').textContent='avec '+(d.name||'pote');chatAdd('sys',(d.name||'Un joueur')+' a rejoint')}
  });
  c.on('close',()=>{chatAdd('sys','Connexion ferm\u00e9e');setStatus('D\u00e9connect\u00e9',false);conn=null});
  c.on('error',()=>{setStatus('Erreur de lien',false)});
}
function hostSession(){
  killPeer();
  const code=genCode();
  roomCode=code;isHost=true;
  setStatus('Cr\u00e9ation de la session\u2026');
  $('mpCodeBox').hidden=false;$('mpCodeBox').textContent=code;
  peer=new Peer(code,PEER_OPTS);
  peer.on('open',id=>{
    roomCode=id;setStatus('Donne ce code \u00e0 ton pote',true);
    $('mpCodeBox').textContent=id;$('mpLeave').hidden=false;
    openChatUI();chatAdd('sys','Session '+id+' \u2014 en attente\u2026');
  });
  peer.on('connection',c=>{wireConn(c)});
  peer.on('error',err=>{
    const m=String(err&&err.type||err||'');
    if(m.includes('taken')||m.includes('unavailable')){setStatus('Code pris, nouvel essai\u2026');setTimeout(hostSession,300)}
    else setStatus('Erreur : '+m,false);
  });
}
function joinSession(){
  const code=($('mpIn').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  $('mpIn').value=code;
  if(code.length<4){setStatus('Code trop court',false);return}
  killPeer();
  roomCode=code;isHost=false;
  setStatus('Connexion\u2026');
  peer=new Peer(PEER_OPTS);
  peer.on('open',()=>{
    const c=peer.connect(code,{reliable:true});
    wireConn(c);
  });
  peer.on('error',err=>setStatus('Impossible de rejoindre ('+((err&&err.type)||'err')+')',false));
}
function sendChat(msg){
  msg=String(msg||'').trim().slice(0,200);
  if(!msg)return;
  chatAdd('me',msg,mpName);
  if(conn&&conn.open)try{conn.send({t:'chat',msg,name:mpName})}catch(e){}
  else chatAdd('sys','Pas encore connect\u00e9 \u00e0 ton pote');
}

$('bm').onclick=()=>{$('msg').hidden=true;$('mp').hidden=false;setStatus(roomCode?('Session '+roomCode):'')};
$('mpBack').onclick=()=>{$('mp').hidden=true;if(!run)$('msg').hidden=false};
$('mpNew').onclick=()=>hostSession();
$('mpJoin').onclick=()=>joinSession();
$('mpIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();joinSession()}});
$('mpLeave').onclick=()=>{killPeer();setStatus('Session quitt\u00e9e');$('mpLeave').hidden=true};
$('chatForm').onsubmit=e=>{e.preventDefault();const v=$('chatIn').value;$('chatIn').value='';sendChat(v)};
$('chatBtn').onclick=()=>{$('chat').classList.toggle('open')};
$('chatX').onclick=()=>{
  if(matchMedia('(max-width:800px)').matches)$('chat').classList.remove('open');
};
})();
