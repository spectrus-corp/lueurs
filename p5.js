/* ---- Mode classé / rangs ---- */
const RANKS=[
{id:0,n:'Débutant',need:0,c:'#a67c52',g:1},
{id:1,n:'Novice',need:30,c:'#b0b0b0',g:1},
{id:2,n:'Apprenti',need:70,c:'#7eb8da',g:1},
{id:3,n:'Aspirant',need:120,c:'#6ec6ff',g:2},
{id:4,n:'Intermédiaire',need:180,c:'#5ad67d',g:2},
{id:5,n:'Aventurier',need:250,c:'#34d399',g:2},
{id:6,n:'Confirmé',need:330,c:'#a78bfa',g:3},
{id:7,n:'Vétéran',need:420,c:'#8b5cf6',g:3},
{id:8,n:'Expert',need:520,c:'#f59e0b',g:3},
{id:9,n:'Stratège',need:630,c:'#fb923c',g:4},
{id:10,n:'Élite',need:750,c:'#f43f5e',g:4},
{id:11,n:'As',need:880,c:'#fb7185',g:4},
{id:12,n:'Maître',need:1020,c:'#22d3ee',g:5},
{id:13,n:'Grand Maître',need:1180,c:'#06b6d4',g:5},
{id:14,n:'Champion',need:1360,c:'#eab308',g:5},
{id:15,n:'Héros',need:1560,c:'#facc15',g:6},
{id:16,n:'Légende',need:1780,c:'#f97316',g:6},
{id:17,n:'Mythique',need:2020,c:'#d946ef',g:6},
{id:18,n:'Éternel',need:2300,c:'#c026d3',g:7},
{id:19,n:'Divin',need:2600,c:'#e879f9',g:7},
{id:20,n:'Céleste',need:2950,c:'#a5b4fc',g:7},
{id:21,n:'Titan',need:3350,c:'#818cf8',g:8},
{id:22,n:'Immortel',need:3800,c:'#fff7ed',g:8},
{id:23,n:'Souverain',need:4300,c:'#fde68a',g:8},
{id:24,n:'Absolu',need:5000,c:'#ffffff',g:9}
];
let ranked=false,rankPts=0;
try{rankPts=+localStorage.getItem('lueursRank')||0}catch(e){}
function rankOf(pts){let r=RANKS[0];for(const x of RANKS){if(pts>=x.need)r=x}return r}
function saveRank(){try{localStorage.setItem('lueursRank',rankPts)}catch(e){}}
function rankShieldSVG(rk){
  const c=rk.c||'#a67c52',g=rk.g||1;
  let deco='';
  if(g>=2)deco+='<path d="M50 18 L54 28 L50 26 L46 28 Z" fill="'+c+'" opacity=".9"/>';
  if(g>=3)deco+='<circle cx="50" cy="42" r="10" fill="none" stroke="'+c+'" stroke-width="2" opacity=".7"/>';
  if(g>=4)deco+='<path d="M35 30 Q50 22 65 30" fill="none" stroke="#ffd36b" stroke-width="2"/>';
  if(g>=5)deco+='<circle cx="50" cy="48" r="3" fill="#ffd36b"/>';
  if(g>=6)deco+='<path d="M40 55 L50 70 L60 55" fill="none" stroke="'+c+'" stroke-width="2"/>';
  if(g>=7)deco+='<path d="M30 25 L50 12 L70 25" fill="none" stroke="#fff" stroke-width="1.5" opacity=".8"/>';
  if(g>=8)deco+='<circle cx="50" cy="42" r="16" fill="none" stroke="#ffd36b" stroke-width="1.5" opacity=".5"/>';
  if(g>=9)deco+='<path d="M50 8 L53 16 L50 14 L47 16 Z" fill="#fff"/><path d="M25 40 L30 42 L25 44" fill="#ffd36b"/><path d="M75 40 L70 42 L75 44" fill="#ffd36b"/>';
  return '<svg viewBox="0 0 100 90" class="rs"><defs><linearGradient id="sg'+rk.id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+c+'" stop-opacity=".95"/><stop offset="100%" stop-color="'+c+'" stop-opacity=".35"/></linearGradient></defs><path d="M50 6 L82 18 L82 48 Q82 72 50 86 Q18 72 18 48 L18 18 Z" fill="url(#sg'+rk.id+')" stroke="'+c+'" stroke-width="2.5"/><path d="M50 14 L74 22 L74 46 Q74 64 50 76 Q26 64 26 46 L26 22 Z" fill="#14102a88" stroke="'+c+'" stroke-width="1" opacity=".5"/>'+deco+'</svg>';
}
function renderRankBadge(){
  const rk=rankOf(rankPts), next=RANKS[Math.min(rk.id+1,RANKS.length-1)];
  try{$('rankSvg').innerHTML=rankShieldSVG(rk)}catch(e){}
  try{$('rankName').textContent=rk.n;$('rankPts').textContent=rankPts+(rk.id<RANKS.length-1?' / '+next.need+' pts':' pts · MAX')}catch(e){}
}
function rankDiff(){
  if(!ranked)return {haz0:3,orb0:10,lives:3,spd:1,chase:1,greenT:14,waveSpd:1};
  const r=rankOf(rankPts).id;
  return {
    haz0:3+Math.floor(r/3)+Math.floor(r/8),
    orb0:Math.max(7,10-Math.floor(r/5)),
    lives:Math.max(2,3-Math.floor(r/7)),
    spd:1+r*0.04,
    chase:1+r*0.05,
    greenT:14+r*0.9,
    waveSpd:1+r*0.03
  };
}
renderRankBadge();

function hud(){try{$('s').textContent=score;$('cb').textContent=combo>1?'×'+combo:'';$('wl').textContent='◈ '+fmt(wallet);$('l').textContent='♥'.repeat(Math.max(lives,0));$('fx').innerHTML=(ranked?'Classé · ':'')+'Vague '+wave+(typeof fever==='number'&&fever>0?'<br><span style="color:#ffd36b">Fièvre '+Math.ceil(fever)+' s</span>':'')+(shield>0?'<br>Bouclier '+Math.ceil(shield)+' s':'')+(freeze>0?'<br>Gel '+Math.ceil(freeze)+' s':'')+(magnet>0?'<br>Aimant '+Math.ceil(magnet)+' s':'');$('db').style.transform='scaleX('+Math.max(0,Math.min(1,stamina/upStaminaMax()))+')'}catch(e){}}
async function board(){const ul=$('bl');if(!ul)return;try{const r=await fetch('/api/score',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();worldBest=d.length?d[0].score:0;ul.innerHTML=d.length?d.slice(0,5).map((e,i)=>'<li><span>'+(i+1)+'. '+esc(e.name)+'</span><b>'+e.score+'</b></li>').join(''):"<li class='e'>Aucun record pour l'instant.</li>"}catch(e){ul.innerHTML="<li class='e'>Classement indisponible.</li>"}}
function start(isRanked){
ranked=!!isRanked;
const D=rankDiff();
[...orbs,...haz].forEach(m=>S.remove(m));orbs.length=haz.length=0;killGreen();
greenT=D.greenT;P.position.set(0,0,0);vel.set(0,0,0);score=got=0;wave=1;lives=D.lives;inv=0;combo=1;
shield=freeze=magnet=0;try{fever=0;feverStreak=0}catch(e){}stamina=upStaminaMax();sprinting=false;sprintHeld=false;
movePtr=sprintPtr=null;moveOrigin=null;Tv=[0,0];paused=false;
for(let i=0;i<D.orb0;i++)mkOrb();for(let i=0;i<D.haz0;i++)mkHaz(i%4===0?'c':'d');
run=true;$('msg').hidden=true;hud();
if(ranked){banner(rankOf(rankPts).n+' · Classé');seq([440,554,660,880],.07,'triangle')}
else seq([330,440,554,660],.07,'triangle')
}
function end(){run=false;shield=0;sh.visible=false;killGreen();const nb=score>best&&score>0;if(score>best){best=score;try{localStorage.setItem('lueurs',best)}catch(e){}}save();
let rankMsg='';
if(ranked){
  const before=rankOf(rankPts);
  const gain=Math.max(0,Math.floor(score/10)+wave*3-before.id*2);
  rankPts+=gain;saveRank();
  const after=rankOf(rankPts);
  rankMsg=' · Classé +'+gain+' pts ('+after.n+')';
  if(after.id>before.id)rankMsg+=' — Promotion !';
  renderRankBadge();
}
$('t').textContent=ranked?'Fin classée':'Fin de partie';
$('p').textContent=(nb?'Nouveau record ! ':'')+score+' pts · Vague '+wave+' · Combo max en jeu'+rankMsg;
try{if($('go'))$('go').hidden=false;if($('nm')){$('nm').value=localStorage.getItem('lueursN')||'';$('nm').focus()}}catch(e){}
$('msg').hidden=false;board();seq([400,350,300,250],.12,'sawtooth');noise(.3,200,.2)}
window.start=start;
try{var _b=$('b');if(_b)_b.onclick=function(){start(false)}}catch(e){}
try{var _br=$('br');if(_br)_br.onclick=function(){start(true)}}catch(e){}
try{var _sb=$('sb');if(_sb)_sb.onclick=async function(){var name=($('nm')&&$('nm').value.trim())||'Anonyme';localStorage.setItem('lueursN',name);_sb.disabled=true;try{var r=await fetch('/api/score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,score})});if(!r.ok)throw 0;if($('go'))$('go').hidden=true;$('p').textContent='Score envoyé au classement mondial.';seq([523,659,784,1047],.1,'triangle');board()}catch(e){_sb.disabled=false;$('p').textContent='Envoi impossible, réessayez.';beep(150,.25,'sawtooth')}}}catch(e){}

const SPIN_REWARDS=[
  {t:'orbs',n:80,label:'80 orbs',c:'#6be3ff'},
  {t:'orbs',n:150,label:'150 orbs',c:'#7dffb0'},
  {t:'orbs',n:300,label:'300 orbs',c:'#ffd36b'},
  {t:'orbs',n:500,label:'500 orbs',c:'#c58bff'},
  {t:'rank',n:15,label:'+15 pts rang',c:'#f59e0b'},
  {t:'rank',n:40,label:'+40 pts rang',c:'#f43f5e'},
  {t:'orbs',n:1000,label:'1000 orbs',c:'#ff6b8a'},
  {t:'orbs',n:50,label:'50 orbs',c:'#a67c52'}
];
function spinDay(){return new Date().toISOString().slice(0,10)}
function canSpin(){try{return localStorage.getItem('lueursSpin')!==spinDay()}catch(e){return true}}
function markSpun(){try{localStorage.setItem('lueursSpin',spinDay())}catch(e){}}
function drawWheel(rot){
  const cv=$('spinWheel');if(!cv)return;const ctx=cv.getContext('2d'),R=150,n=SPIN_REWARDS.length;
  ctx.clearRect(0,0,300,300);ctx.save();ctx.translate(150,150);ctx.rotate(rot||0);
  for(let i=0;i<n;i++){
    const a0=i/n*Math.PI*2,a1=(i+1)/n*Math.PI*2;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,a0,a1);ctx.closePath();
    ctx.fillStyle=SPIN_REWARDS[i].c;ctx.globalAlpha=.85;ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle='#14102a';ctx.lineWidth=2;ctx.stroke();
    ctx.save();ctx.rotate((a0+a1)/2);ctx.fillStyle='#14102a';ctx.font='bold 11px Georgia';ctx.textAlign='center';
    ctx.fillText(SPIN_REWARDS[i].label,R*0.62,4);ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fillStyle='#14102a';ctx.fill();ctx.strokeStyle='#ffd36b';ctx.lineWidth=3;ctx.stroke();
  ctx.restore();
}
let spinning=false;
function openSpin(){
  if(!$('spinOverlay'))return;
  $('spinOverlay').hidden=false;if($('spinResult'))$('spinResult').textContent='';if($('spinHint'))$('spinHint').textContent=canSpin()?'1 tour gratuit par jour':'Déjà utiliséé aujourd\'hui';
  drawWheel(0);if($('spinWheel'))$('spinWheel').style.transform='rotate(0deg)';
  if(canSpin())setTimeout(function(){doSpin()},400);
}
function doSpin(){
  if(spinning||!canSpin())return;spinning=true;
  const n=SPIN_REWARDS.length,idx=Math.floor(Math.random()*n),seg=360/n;
  const target=360*6+(360-idx*seg-seg/2);const el=$('spinWheel');
  if(!el){spinning=false;return}
  el.style.transition='transform 4.2s cubic-bezier(.12,.75,.08,1)';el.style.transform='rotate('+target+'deg)';
  setTimeout(function(){
    const r=SPIN_REWARDS[idx];let msg='';
    if(r.t==='orbs'){wallet+=r.n;save();msg='+'+r.n+' orbs'}
    else if(r.t==='rank'){rankPts+=r.n;saveRank();renderRankBadge();msg='+'+r.n+' pts de rang'}
    markSpun();if($('spinResult'))$('spinResult').textContent=msg;if($('spinHint'))$('spinHint').textContent='Reviens demain';
    try{$('wl').textContent='◈ '+fmt(wallet)}catch(e){}
    seq([523,659,784,1047],.08,'triangle');noise(.1,4000,.05);spinning=false;
  },4300);
}
try{var _bsp=$('bsp');if(_bsp)_bsp.onclick=function(){openSpin()}}catch(e){}
try{var _sc=$('spinClose');if(_sc)_sc.onclick=function(){$('spinOverlay').hidden=true}}catch(e){}
try{var _ht=$('helpToggle');if(_ht)_ht.onclick=function(){$('helpBox').classList.toggle('open')}}catch(e){}
