(function(){
const bgm=new Audio(window.BGM_URI||'');bgm.loop=true;bgm.volume=.5;
let muted=false;try{muted=localStorage.getItem('lueursMuted')==='1'}catch(e){}
const btn=document.createElement('button');
btn.id='mute';btn.type='button';btn.setAttribute('aria-label','Muet');
btn.textContent=muted?'🔇':'🔊';
Object.assign(btn.style,{position:'fixed',top:'calc(12px + env(safe-area-inset-top,0px))',right:'18px',zIndex:'20',width:'44px',height:'44px',borderRadius:'50%',border:'1px solid #ffffff44',background:'#14102acc',color:'#ffd36b',fontSize:'20px',cursor:'pointer',display:'none',alignItems:'center',justifyContent:'center',pointerEvents:'auto',boxShadow:'0 2px 12px #0008'});
document.body.appendChild(btn);
function showMute(v){btn.style.display=v?'flex':'none'}
function startBgm(){if(muted||!window.BGM_URI)return;bgm.src=window.BGM_URI;bgm.currentTime=0;bgm.play().catch(function(){})}
function stopBgm(){bgm.pause();bgm.currentTime=0}
btn.onclick=function(e){e.stopPropagation();muted=!muted;try{localStorage.setItem('lueursMuted',muted?'1':'0')}catch(e){}btn.textContent=muted?'🔇':'🔊';if(muted)bgm.pause();else if(window.__lueursRun)bgm.play().catch(function(){})};
const msg=document.getElementById('msg');
let wasHidden=false;
setInterval(function(){
  const playing=msg&&msg.hidden;
  window.__lueursRun=playing;
  if(playing&&!wasHidden){showMute(true);startBgm()}
  if(!playing&&wasHidden){showMute(false);stopBgm()}
  wasHidden=playing;
},200);
async function loadW(){
  try{
    const r=await fetch('/api/wallet',{cache:'no-store'});
    if(!r.ok)return;
    const d=await r.json();
    if(typeof d.wallet==='number'){
      try{
        const local=+localStorage.getItem('lueursW')||0;
        if(d.wallet>local)localStorage.setItem('lueursW',d.wallet);
        if(Array.isArray(d.owned)&&d.owned.length)localStorage.setItem('lueursO',JSON.stringify(d.owned));
        if(d.eq)localStorage.setItem('lueursE',JSON.stringify(d.eq));
      }catch(e){}
    }
  }catch(e){}
}
async function saveW(){
  try{
    const wallet=+localStorage.getItem('lueursW')||0;
    const owned=JSON.parse(localStorage.getItem('lueursO')||'[]');
    const eq=JSON.parse(localStorage.getItem('lueursE')||'{}');
    await fetch('/api/wallet',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet,owned,eq})});
  }catch(e){}
}
loadW();
setInterval(saveW,15000);
addEventListener('pagehide',saveW);
})();
