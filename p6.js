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
const w=1+Math.floor(got/12);if(w>wave){wave=w;banner('Vague '+w);seq([520,660,780,1040],.12,'triangle');noise(.4,800,.06);if(orbs.length<20)for(let i=0;i<6;i++)mkOrb();if(haz.length<14)mkHaz('c')}
const spd=(1+got*.015)*(freeze>0?.15:1);let near=99;
for(const h of haz){const u=h.userData,v=u.v;
if(u.t=='c'){const dx=P.position.x-h.position.x,dz=P.position.z-h.position.z,d=Math.hypot(dx,dz)||1,s=(3+wave*.4)*(freeze>0?.15:1);near=Math.min(near,d);h.position.x+=dx/d*s*dt;h.position.z+=dz/d*s*dt;h.rotation.x+=dt*2;h.rotation.z+=dt*3}
else{h.position.x+=v.x*spd*dt;h.position.z+=v.z*spd*dt;if(Math.abs(h.position.x)>A-1)v.x*=-1;if(Math.abs(h.position.z)>A-1)v.z*=-1;h.rotation.x+=dt*1.5;h.rotation.y+=dt*2}
const d=h.position.distanceTo(P.position);near=Math.min(near,d);
if(d<1.5){if(shield>0){burst(h.position,'s',10);S.remove(h);haz.splice(haz.indexOf(h),1);shield=0;sh.visible=false;beep(900,.1);noise(.2,4000,.06);continue}
if(inv<=0){lives--;inv=1.4;flash=.35;vel.multiplyScalar(-.5);burst(P.position,'s',16);noise(.5,200,.12);beep(120,.25,'sawtooth');if(lives<=0)end()}}}
if(near<8){const f=.04*(1-near/8);C.position.x+= (Math.random()-.5)*f;C.position.y+=(Math.random()-.5)*f}
if(grn){const u=grn.userData;u.life-=dt;grn.position.x+=u.v.x*dt;grn.position.z+=u.v.z*dt;if(Math.abs(grn.position.x)>A-1)u.v.x*=-1;if(Math.abs(grn.position.z)>A-1)u.v.z*=-1;grn.rotation.y+=dt*2;if(u.life<=0)killGreen();else if(grn.position.distanceTo(P.position)<1.8){lives=Math.min(lives+1,5);gain(10);burst(grn.position,'g',20);killGreen();banner('+1 vie !');seq([523,659,784],.1,'triangle')}}else{greenT-=dt;if(greenT<=0)mkGreen()}
if(shield>0){shield-=dt;sh.visible=true;sh.material.opacity=.2+.1*Math.sin(t*8)}else sh.visible=false;
if(freeze>0)freeze-=dt;if(magnet>0)magnet-=dt;if(inv>0)inv-=dt;if(dashCd>0)dashCd-=dt;if(flash>0)flash-=dt;if(bt>0){bt-=dt;$('bn').style.opacity=String(Math.min(1,bt))}
hud()}
else if(!run){P.rotation.y+=dt*.5}
for(let i=bits.length-1;i>=0;i--){const b=bits[i],u=b.userData;u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}b.position.x+=u.vx*dt;b.position.y+=u.vy*dt;b.position.z+=u.vz*dt;u.vy-=12*dt;b.scale.setScalar(u.life/.6)}
for(let i=trl.length-1;i>=0;i--){const b=trl[i],u=b.userData;u.life-=dt;if(u.life<=0){S.remove(b);trl.splice(i,1);continue}b.position.y=Math.max(.1,b.position.y+u.up*dt);b.scale.setScalar(u.s0*u.life/u.L)}
cam.lerp(new THREE.Vector3(P.position.x,16,P.position.z+13),1-Math.exp(-4*dt));C.position.copy(cam);C.lookAt(P.position.x,0,P.position.z-2);
R.render(S,C)}
tick();
