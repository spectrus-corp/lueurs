/* ---- Mode classé / rangs ---- */
const RANKS=[
{id:0,n:'Débutant',need:0,c:'#cd7f32',g:1},
{id:1,n:'Novice',need:40,c:'#b0b0b0',g:1},
{id:2,n:'Apprenti',need:100,c:'#6ec6ff',g:2},
{id:3,n:'Intermédiaire',need:180,c:'#5ad67d',g:2},
{id:4,n:'Confirmé',need:280,c:'#a78bfa',g:3},
{id:5,n:'Expert',need:400,c:'#f59e0b',g:3},
{id:6,n:'Élite',need:550,c:'#f43f5e',g:4},
{id:7,n:'Maître',need:720,c:'#22d3ee',g:4},
{id:8,n:'Champion',need:920,c:'#eab308',g:5},
{id:9,n:'Légende',need:1150,c:'#f97316',g:5},
{id:10,n:'Mythique',need:1450,c:'#d946ef',g:6},
{id:11,n:'Immortel',need:1800,c:'#fff7ed',g:6}
];
let ranked=false,rankPts=0;
try{rankPts=+localStorage.getItem('lueursRank')||0}catch(e){}
function rankOf(p){let r=RANKS[0];for(const x of RANKS){if(p>=x.need)r=x}return r}
function saveRank(){try{localStorage.setItem('lueursRank',rankPts)}catch(e){}}
function rankShield(rk){
  const c=rk.c||'#cd7f32',g=rk.g||1,id=rk.id;
  let stars='';
  for(let i=0;i<Math.min(g,6);i++){
    const a=(i/Math.max(g,1))*Math.PI*2-Math.PI/2,x=32+Math.cos(a)*11,y=28+Math.sin(a)*11;
    stars+='<circle cx="'+x+'" cy="'+y+'" r="2.2" fill="#fff" opacity=".9"/>';
  }
  const rim = id>=8 ? '<path d="M32 4 L36 14 L48 14 L38 22 L42 34 L32 26 L22 34 L26 22 L16 14 L28 14 Z" fill="none" stroke="#fff" stroke-width="1.2" opacity=".5"/>' : '';
  const gem = id>=5 ? '<circle cx="32" cy="30" r="6" fill="#fff" opacity=".35"/>' : '';
  const wings = id>=9 ? '<path d="M8 36 Q18 20 28 32" fill="none" stroke="'+c+'" stroke-width="3"/><path d="M56 36 Q46 20 36 32" fill="none" stroke="'+c+'" stroke-width="3"/>' : '';
  const crown = id>=10 ? '<path d="M22 12 L26 6 L32 12 L38 6 L42 12" fill="none" stroke="#ffd36b" stroke-width="2"/>' : '';
  return '<svg class="rs" viewBox="0 0 64 64" width="72" height="72" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="sg'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".35"/><stop offset="45%" stop-color="'+c+'"/><stop offset="100%" stop-color="#000" stop-opacity=".35"/></linearGradient>'+
    '<filter id="gl'+id+'"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
    wings+crown+rim+
    '<path filter="url(#gl'+id+')" d="M32 6 C42 6 50 12 50 22 C50 36 40 46 32 56 C24 46 14 36 14 22 C14 12 22 6 32 6 Z" fill="url(#sg'+id+')" stroke="'+c+'" stroke-width="2"/>'+
    '<path d="M32 12 C40 12 45 16 45 23 C45 33 38 41 32 48 C26 41 19 33 19 23 C19 16 24 12 32 12 Z" fill="'+c+'" opacity=".55"/>'+
    gem+stars+
    '<text x="32" y="34" text-anchor="middle" font-size="11" font-family="Georgia,serif" fill="#fff" opacity=".95">'+(id+1)+'</text></svg>';
}
function renderRankBadge(){
  const rk=rankOf(rankPts), next=RANKS[Math.min(rk.id+1,RANKS.length-1)];
  const el=$('rankSvg'); if(el) el.innerHTML=rankShield(rk);
  try{$('rankName').textContent=rk.n;$('rankPts').textContent=rankPts+(rk.id<RANKS.length-1?' / '+next.need+' pts':' pts · MAX')}catch(e){}
}
function rankDiff(){
  if(!ranked)return {haz0:3,orb0:10,lives:3,spd:1,chase:1,greenT:14,waveSpd:1};
  const r=rankOf(rankPts).id;
  return {
    haz0:3+Math.floor(r/2)+Math.floor(r/6),
    orb0:Math.max(7,10-Math.floor(r/4)),
    lives:Math.max(2,3-Math.floor(r/5)),
    spd:1+r*0.08,
    chase:1+r*0.1,
    greenT:14+r*1.2,
    waveSpd:1+r*0.06
  };
}
renderRankBadge();

function hud(){$('s').textContent=score;$('cb').textContent=combo>1?'×'+combo:'';$('wl').textContent='◈ '+fmt(wallet);$('l').textContent='♥'.repeat(Math.max(lives,0));$('fx').innerHTML=(ranked?'Classé · ':'')+'Vague '+wave+(shield>0?'<br>Bouclier '+Math.ceil(shield)+' s':'')+(freeze>0?'<br>Gel '+Math.ceil(freeze)+' s':'')+(magnet>0?'<br>Aimant '+Math.ceil(magnet)+' s':'');$('db').style.transform='scaleX('+Math.max(0,Math.min(1,stamina/upStaminaMax()))+')'}
async function board(){const ul=$('bl');try{const r=await fetch('/api/score',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();worldBest=d.length?d[0].score:0;ul.innerHTML=d.length?d.slice(0,5).map((e,i)=>'<li><span>'+(i+1)+'. '+esc(e.name)+'</span><b>'+e.score+'</b></li>').join(''):`<li class='e'>Aucun record pour l’instant. Soyez le premier.</li>`}catch(e){ul.innerHTML=`<li class='e'>Classement indisponible pour le moment.</li>`}}
function start(isRanked){
ranked=!!isRanked;
const D=rankDiff();
[...orbs,...haz].forEach(m=>S.remove(m));orbs.length=haz.length=0;killGreen();
greenT=D.greenT;P.position.set(0,0,0);vel.set(0,0,0);score=got=0;wave=1;lives=D.lives;inv=0;combo=1;
shield=freeze=magnet=0;stamina=upStaminaMax();sprinting=false;sprintHeld=false;
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
$('p').textContent=score+' points, vague '+wave+'. Votre meilleur : '+best+'.'+(nb?' Nouveau record personnel !':'')+' Portefeuille : '+fmt(wallet)+' lueurs.'+rankMsg;
$('b').textContent='Rejouer';$('msg').hidden=false;ranked=false;
seq([392,330,262,196],.16,'sawtooth');noise(.5,300,.1);if(nb)seq([523,659,784,1047,1319],.1,'triangle',.9);
$('go').hidden=score<1;$('sb').disabled=false;try{$('nm').value=localStorage.getItem('lueursName')||''}catch(e){}board()}
$('b').onclick=()=>start(false);
try{$('br').onclick=()=>start(true)}catch(e){}
$('sb').onclick=async()=>{const name=$('nm').value.trim();if(name.length<2){$('nm').focus();return}try{localStorage.setItem('lueursName',name)}catch(e){}$('sb').disabled=true;
try{const r=await fetch('/api/score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,score})});if(!r.ok)throw 0;$('go').hidden=true;$('p').textContent='Score envoyé au classement mondial.';seq([523,659,784,1047],.1,'triangle');board()}catch(e){$('sb').disabled=false;$('p').textContent='Envoi impossible, réessayez.';beep(150,.25,'sawtooth')}};

/* ---- Roue du jour ---- */
const SPIN=[
{label:'300 ◈',type:'orbs',n:300,w:22,col:'#3a2f6e'},
{label:'800 ◈',type:'orbs',n:800,w:18,col:'#2a4a6e'},
{label:'1 500 ◈',type:'orbs',n:1500,w:14,col:'#2a6e4a'},
{label:'3 000 ◈',type:'orbs',n:3000,w:8,col:'#6e5a2a'},
{label:'8 000 ◈',type:'orbs',n:8000,w:3,col:'#6e3a2a'},
{label:'+15 pts rang',type:'rank',n:15,w:12,col:'#5a2a6e'},
{label:'+40 pts rang',type:'rank',n:40,w:5,col:'#6e2a5a'},
{label:'Néon',type:'item',id:'t5',w:6,col:'#4a2a6e'},
{label:'Halo',type:'item',id:'a1',w:6,col:'#2a5a6e'},
{label:'Braise',type:'item',id:'k1',w:6,col:'#6e4a2a'}
];
function spinDayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function spunToday(){try{return localStorage.getItem('lueursSpin')===spinDayKey()}catch(e){return false}}
function markSpun(){try{localStorage.setItem('lueursSpin',spinDayKey())}catch(e){}}
function updateSpinBtn(){const b=$('bsp');if(!b)return;if(spunToday()){b.disabled=true;b.textContent='🎡 Déjà tourné'}else{b.disabled=false;b.textContent='🎡 Roue du jour'}}
function pickSpin(){
  const tot=SPIN.reduce((s,x)=>s+x.w,0);let r=Math.random()*tot;
  for(let i=0;i<SPIN.length;i++){r-=SPIN[i].w;if(r<=0)return i}
  return SPIN.length-1;
}
function drawWheel(){
  const c=$('spinWheel');if(!c)return;const ctx=c.getContext('2d'),N=SPIN.length,R=150,seg=Math.PI*2/N;
  ctx.clearRect(0,0,300,300);ctx.save();ctx.translate(150,150);
  for(let i=0;i<N;i++){
    const a0=i*seg-Math.PI/2,a1=a0+seg;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,a0,a1);ctx.closePath();
    ctx.fillStyle=SPIN[i].col;ctx.fill();
    ctx.strokeStyle='#ffffff33';ctx.lineWidth=2;ctx.stroke();
    ctx.save();ctx.rotate(a0+seg/2);ctx.fillStyle='#fff';ctx.font='bold 11px Georgia,serif';ctx.textAlign='right';ctx.fillText(SPIN[i].label,R-12,4);ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.fillStyle='#14102a';ctx.fill();
  ctx.strokeStyle='#ffd36b';ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle='#ffd36b';ctx.font='16px Georgia';ctx.textAlign='center';ctx.fillText('✦',0,6);
  ctx.restore();
}
let spinning=false;
function grantSpin(idx){
  const r=SPIN[idx];let msg=r.label;
  if(r.type==='orbs'){wallet+=r.n;msg='+'+fmt(r.n)+' lueurs'}
  else if(r.type==='rank'){rankPts+=r.n;saveRank();renderRankBadge();msg='+'+r.n+' pts de rang'}
  else if(r.type==='item'){
    if(!owned.includes(r.id)){owned.push(r.id);const it=find(r.id);if(it&&it.t!=='u'){try{equip(r.id)}catch(e){}}msg=(it?it.n:r.id)+' obtenu !'}
    else{wallet+=1200;msg='Déjà possédé → +1 200 lueurs'}
  }
  save();try{$('wl').textContent='◈ '+fmt(wallet);$('sw').textContent='◈ '+fmt(wallet)+' lueurs'}catch(e){}
  return msg;
}
function openSpin(){
  if(spunToday()){try{banner('Reviens demain !')}catch(e){}return}
  const ov=$('spinOverlay');if(!ov)return;
  ov.hidden=false;$('spinResult').textContent='Touche la roue pour lancer';$('spinHint').textContent='1 tour gratuit par jour';
  const w=$('spinWheel');w.style.transition='none';w.style.transform='rotate(0deg)';
  drawWheel();spinning=false;
  w.onclick=()=>{if(spinning||spunToday())return;doSpin()};
}
function doSpin(){
  if(spinning||spunToday())return;spinning=true;
  const idx=pickSpin(),N=SPIN.length,seg=360/N;
  const target=360*6+(360-idx*seg-seg/2);
  const w=$('spinWheel');
  w.style.transition='none';w.style.transform='rotate(0deg)';
  void w.offsetWidth;
  w.style.transition='transform 4.2s cubic-bezier(.12,.75,.08,1)';
  w.style.transform='rotate('+target+'deg)';
  $('spinResult').textContent='…';
  setTimeout(()=>{
    const msg=grantSpin(idx);markSpun();updateSpinBtn();
    $('spinResult').textContent=msg;
    $('spinHint').textContent='Reviens demain pour un nouveau tour';
    seq([523,659,784,1047],.08,'triangle');noise(.12,4000,.05);spinning=false;
  },4300);
}
function closeSpin(){$('spinOverlay').hidden=true}
try{
  $('bsp').onclick=e=>{e.preventDefault();openSpin()};
  $('spinClose').onclick=closeSpin;
  $('helpToggle').onclick=()=>{$('helpBox').classList.toggle('open')};
  updateSpinBtn();
}catch(e){}

/* ---- Secret : ↑ ↑ ↓ ↓ ← → ← → (clavier ou glissements du doigt sur l’écran d’accueil) ---- */
const SQ='UUDDLRLR';let sq='',sqT=0,sw0=null;
function dirIn(d){if(run||!$('shop').hidden)return;const n=performance.now();if(n-sqT>2500)sq='';sqT=n;sq=(sq+d).slice(-8);if(sq==SQ){sq='';secret()}}
function secret(){const first=!owned.includes('k11');if(first){owned.push('k11','t11');eq.k='k11';eq.t='t11';setSkin('k11');curTrail=find('t11');save();$('p').textContent='✦ Secret découvert ! Le skin Fantôme et la traînée Comète sont à vous, déjà équipés.'}else $('p').textContent='✦ Vous avez déjà trouvé le secret.';
burst(P.position,'g',30);burst(P.position,'s',20);seq([523,659,784,1047,1319,1568],.09,'triangle');noise(.5,6000,.05,.2)}
addEventListener('pointerdown',e=>{if(!run&&$('shop').hidden&&!e.target.closest('button,input'))sw0=[e.clientX,e.clientY]});
addEventListener('pointerup',e=>{if(!sw0)return;const dx=e.clientX-sw0[0],dy=e.clientY-sw0[1];sw0=null;if(Math.max(Math.abs(dx),Math.abs(dy))<40)return;dirIn(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))});
