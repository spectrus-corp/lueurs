(function(){
const URLS=[
'https://cdn.pixabay.com/download/audio/2026/06/01/audio-21-05-45-979-0.mp3?filename=phonk-brazilian-phonk-phonk-music-545509.mp3',
'https://cdn.pixabay.com/audio/2026/06/01/21-05-45-979.mp3',
'https://cdn.pixabay.com/download/audio/2026/06/16/audio-545509-0.mp3'
];
const bgm=new Audio();bgm.loop=true;bgm.volume=.5;
let muted=false,i=0;
try{muted=localStorage.getItem('lueursMuted')==='1'}catch(e){}
const btn=document.createElement('button');
btn.id='mute';btn.type='button';btn.setAttribute('aria-label','Muet');
btn.textContent=muted?'🔇':'🔊';
Object.assign(btn.style,{position:'fixed',top:'calc(12px + env(safe-area-inset-top,0px))',right:'18px',zIndex:'20',width:'44px',height:'44px',borderRadius:'50%',border:'1px solid #ffffff44',background:'#14102acc',color:'#ffd36b',fontSize:'20px',cursor:'pointer',display:'none',alignItems:'center',justifyContent:'center',pointerEvents:'auto',boxShadow:'0 2px 12px #0008'});
document.body.appendChild(btn);
function load(){if(i>=URLS.length)return;bgm.src=URLS[i++];bgm.load()}
bgm.onerror=function(){load()};
load();
function show(v){btn.style.display=v?'flex':'none'}
function start(){if(muted)return;bgm.play().catch(function(){load();setTimeout(function(){if(!muted)bgm.play().catch(function(){})},200)})}
function stop(){bgm.pause();try{bgm.currentTime=0}catch(e){}}
btn.onclick=function(e){e.stopPropagation();muted=!muted;try{localStorage.setItem('lueursMuted',muted?'1':'0')}catch(e){}btn.textContent=muted?'🔇':'🔊';if(muted)bgm.pause();else if(window.__lueursRun)start()};
var msg=document.getElementById('msg'),was=false;
setInterval(function(){
  var p=msg&&msg.hidden;window.__lueursRun=p;
  if(p&&!was){show(true);start()}
  if(!p&&was){show(false);stop()}
  was=p;
},200);
async function loadW(){try{var r=await fetch('/api/wallet',{cache:'no-store'});if(!r.ok)return;var d=await r.json();if(typeof d.wallet==='number'){try{var local=+localStorage.getItem('lueursW')||0;if(d.wallet>local)localStorage.setItem('lueursW',d.wallet);if(Array.isArray(d.owned)&&d.owned.length)localStorage.setItem('lueursO',JSON.stringify(d.owned));if(d.eq)localStorage.setItem('lueursE',JSON.stringify(d.eq))}catch(e){}}}catch(e){}}
async function saveW(){try{var wallet=+localStorage.getItem('lueursW')||0,owned=JSON.parse(localStorage.getItem('lueursO')||'[]'),eq=JSON.parse(localStorage.getItem('lueursE')||'{}');await fetch('/api/wallet',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet,owned,eq})})}catch(e){}}
loadW();setInterval(saveW,15000);addEventListener('pagehide',saveW);
})();
