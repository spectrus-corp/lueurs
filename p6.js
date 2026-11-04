function pause(v){if(!run)return;paused=v;beep(v?300:500,.08,'triangle');if(v)$('bn').textContent='Pause';else bt=0}
const KD={ArrowUp:'U',KeyW:'U',ArrowDown:'D',KeyS:'D',ArrowLeft:'L',KeyA:'L',ArrowRight:'R',KeyD:'R'};
const K={};addEventListener('keydown',e=>{K[e.code]=1;if(KD[e.code]&&!e.repeat&&e.target.tagName!='INPUT')dirIn(KD[e.code]);if(e.code=='Escape'&&!$('shop').hidden){closeShop();return}if(e.code=='Space'&&run){e.preventDefault();dash()}if((e.code=='KeyP'||e.code=='Escape')&&run)pause(!paused)});addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>pause(true));
addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
function dash(){if(!run||paused||dashCd>0)return;const d=vel.length()>1?vel.clone().normalize():new THREE.Vector3(Math.sin(P.rotation.y),0,Math.cos(P.rotation.y));vel.addScaledVector(d,32);dashCd=upDashCd();inv=Math.max(inv,.35);burst(P.position,'g',8);noise(.22,2500,.1);beep(700,.1)}
$('dbtn').addEventListener('pointerdown',dash);
let T=null,Tv=[0,0];const lim=v=>Math.max(-1,Math.min(1,v));
addEventListener('pointerdown',e=>{if(paused)pause(false);if(e.target.tagName!='BUTTON'&&run)T=[e.clientX,e.clientY]});
addEventListener('pointermove',e=>{if(T)Tv=[lim((e.clientX-T[0])/60),lim((e.clientY-T[1])/60)]});
addEventListener('pointerup',()=>{T=null;Tv=[0,0]});
for(let i=0;i<8;i++)mkOrb();for(let i=0;i<3;i++)mkHaz();board();$('wl').textContent='◈ '+fmt(wallet);
const clk=new THREE.Clock();const cam=new THREE.Vector3(0,16,13);
function tick(){requestAnimationFrame(tick);const dt=Math.min(clk.getDelta(),.05),t=clk.elapsedTime;
for(const o of orbs){o.rotation.y+=dt*2;o.position.y=1+Math.sin(t*3+o.id)*.25}
if(accM){accM.children.forEach(ch=>{if(ch.userData.spin){ch.position.x=Math.cos(t*2)*.9;ch.position.z=Math.sin(t*2)*.9}if(ch.userData.orbit){ch.position.x=Math.cos(t*1.6)*1.15;ch.position.z=Math.sin(t*1.6)*1.15;ch.rotation.y+=dt*2}});}
if(curSkin.rb&&bd){const h=(t*.4)%1;bd.material.color.setHSL(h,.8,.65);bd.material.emissive.setHSL(h,.9,.4)}
if(run&&!paused){
let x=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0)+Tv[0],z=(K.ArrowDown||K.KeyS?1:0)-(K.ArrowUp||K.KeyW?1:0)+Tv[1];
const l=Math.hypot(x,z);if(l>1){x/=l;z/=l}
const k=Math.min(1,5*dt);vel.x+=(x*14*upSpeed()-vel.x)*k;vel.z+=(z*14*upSpeed()-vel.z)*k;
P.position.x=cl(P.position.x+vel.x*dt);P.position.z=cl(P.position.z+vel.z*dt);
if(vel.length()>.8)P.rotation.y=Math.atan2(vel.x,vel.z);
if(curTrail.c.length&&vel.length()>1.5&&trl.length<180){tE-=dt;while(tE<=0){tE+=.035;mkTrail(curTrail)}}
if(t-lastT>upComboWin()){if(combo>=3)seq([440,370,300],.07,'triangle');combo=1}
for(const o of orbs){const dx=P.position.x-o.position.x,dz=P.position.z-o.position.z,d=Math.hypot(dx,dz);
if(magnet>0&&d<upMagnetR()&&d>.1){o.position.x+=dx/d*16*dt;o.position.z+=dz/d*16*dt}
if(d<1.6){const q=o.userData.k;burst(o.position,q);
if(q=='g'){combo=t-lastT<upComboWin()?Math.min(combo+1,5):1;lastT=t;gain(combo+(hasU('u7')&&got%8==7?1:0));got++;beep(480+combo*90,.08);noise(.05,3500,.04);if(combo==5)beep(1500,.1,'sine',.06);if(got%5==0&&haz.length<14)mkHaz('d')}
else if(q=='s'){shield=6*upShieldMul();gain(2);banner('Bouclier !');seq([300,450,600],.08,'triangle')}
else if(q=='f'){freeze=5*upFreezeMul();gain(2);banner('Gel !');seq([900,700,500,350],.07,'sine');noise(.3,6000,.05)}
else{magnet=7;gain(2);banner('Aimant !');seq([380,480,380,480],.07,'triangle')}
kind(o,rk());o.position.set(rnd(),1,rnd())}}
