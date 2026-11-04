function equip(id){const it=find(id);if(!it||it.t=='u')return;eq[it.t]=id;if(it.t=='k')setSkin(id);else if(it.t=='t')curTrail=it;else if(it.t=='a')setAcc(id);save();renderShop()}
function buy(id){const it=CAT.find(i=>i.id==id);if(!it||it.secret||owned.includes(id))return;const pr=priceOf(it);if(wallet<pr)return;wallet-=pr;owned.push(id);if(it.t=='u'){save();renderShop();seq([660,880,1100],.07,'triangle')}else{equip(id);seq([660,880,1100,1320],.07,'triangle')}noise(.12,5000,.04,.05)}
function tmr(){if($('shop').hidden)return;const rem=6e5-(Date.now()%6e5),m=Math.floor(rem/6e4),s=Math.floor(rem/1e3)%60;$('st').textContent='Actualisation dans '+m+':'+String(s).padStart(2,'0');if(shownSlot!=Math.floor(Date.now()/6e5)){renderShop();seq([800,1000,1200],.07,'sine')}}
setInterval(tmr,1000);
$('bs').onclick=()=>{$('msg').hidden=true;$('shop').hidden=false;renderShop();tmr();seq([500,700],.06)};
function closeShop(){$('shop').hidden=true;if(!run)$('msg').hidden=false;seq([700,500],.06)}
$('shop').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.id=='sx')closeShop();else if(b.dataset.tab){shopTab=b.dataset.tab;renderShop()}else if(b.dataset.b)buy(b.dataset.b);else if(b.dataset.e){equip(b.dataset.e);beep(740,.08,'triangle');noise(.08,3000,.04)}};
/* ---- Bouton son ---- */
function snd(){$('mb').textContent=muted?'🔇':'🔊'}
$('mb').onclick=()=>{muted=!muted;try{localStorage.setItem('lueursM',muted?'1':'0')}catch(e){}snd();beep(660,.08)};
snd();
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b.id!='mb'&&!b.disabled)beep(520,.04,'square')});
/* ---- Jeu ---- */
function kind(m,k){m.material=om[k];m.userData.k=k;m.scale.setScalar(k=='g'?1:1.4)}
const rk=()=>{const r=Math.random();return r<.06?'s':r<.12?'f':r<.18?'m':'g'};
function mkOrb(){const m=new THREE.Mesh(og,om.g);m.position.set(rnd(),1,rnd());kind(m,'g');S.add(m);orbs.push(m)}
function away(m,d=14){do{m.position.set(rnd(),1,rnd())}while(m.position.distanceTo(P.position)<d)}
function mkHaz(ty='d'){const c=ty=='c',m=new THREE.Mesh(c?tg:hg,c?tm:hm);away(m);const a=Math.random()*6.28,s=3+Math.random()*2.5;m.userData={t:ty,v:new THREE.Vector3(Math.cos(a)*s,0,Math.sin(a)*s)};S.add(m);haz.push(m);if(run)beep(c?200:260,.15,'sawtooth',0)}
function mkGreen(){const m=new THREE.Mesh(ng,nm),l=new THREE.PointLight(0x4dff8f,1.4,10);l.position.y=1;m.add(l);away(m,10);const a=Math.random()*6.28;m.userData={life:14,v:new THREE.Vector3(Math.cos(a)*4.5,0,Math.sin(a)*4.5)};S.add(m);grn=m;banner('Un PNJ vert est apparu !');seq([659,784,988,1319],.08,'triangle')}
function killGreen(){if(grn)S.remove(grn);grn=null;greenT=(lives>=3?22:12)+Math.random()*8}
function burst(p,k,n=12){for(let i=0;i<n;i++){const m=new THREE.Mesh(pg,pm[k]);m.position.copy(p);const a=Math.random()*6.28,s=3+Math.random()*5;m.userData={vx:Math.cos(a)*s,vy:2+Math.random()*4,vz:Math.sin(a)*s,life:.6};S.add(m);bits.push(m)}}
let score=0,got=0,lives=3,run=false,paused=false,inv=0,best=0,combo=1,lastT=-9,shield=0,freeze=0,magnet=0,dashCd=0,flash=0,bt=0,wave=1,greenT=14,worldBest=0,heart=0,tk=0;const vel=new THREE.Vector3();
try{best=+localStorage.getItem('lueurs')||0}catch(e){}
function gain(n){score+=n;wallet+=n}
setSkin(eq.k);curTrail=find(eq.t);
function banner(s){$('bn').textContent=s;bt=1.8}
