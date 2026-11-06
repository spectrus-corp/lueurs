function pause(v){if(!run)return;paused=v;beep(v?300:500,.08,'triangle');if(v)$('bn').textContent='Pause';else bt=0}
const KD={ArrowUp:'U',KeyW:'U',ArrowDown:'D',KeyS:'D',ArrowLeft:'L',KeyA:'L',ArrowRight:'R',KeyD:'R'};
const typing=e=>{const t=e&&e.target;return !!(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable))};
const K={};addEventListener('keydown',e=>{if(typing(e))return;K[e.code]=1;if(KD[e.code]&&!e.repeat)dirIn(KD[e.code]);if(e.code=='Escape'&&!$('shop').hidden){closeShop();return}if(e.code=='Space'&&run){e.preventDefault()}if((e.code=='KeyP'||e.code=='Escape')&&run)pause(!paused)});addEventListener('keyup',e=>K[e.code]=0);addEventListener('blur',()=>pause(true));
addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
let stamina=1,sprintHeld=false,sprinting=false,shk=0;
function shake(a){shk=Math.max(shk,a)}
function isSprintKey(){return !!(K.ShiftLeft||K.ShiftRight||K.Space)}
let movePtr=null,sprintPtr=null,moveOrigin=null,Tv=[0,0];
const lim=v=>Math.max(-1,Math.min(1,v));
const touchUI=e=>!!(e.target.closest&&e.target.closest('button,input,textarea,select,#chat,#shop,#mp,#msg,#codeBox,#syncBox'));
addEventListener('pointerdown',e=>{
  if(paused&&run)pause(false);
  if(!run||touchUI(e))return;
  const right=e.clientX>=innerWidth*0.5;
  if(right){
    if(sprintPtr==null){sprintPtr=e.pointerId;sprintHeld=true}
  }else if(movePtr==null){
    movePtr=e.pointerId;moveOrigin=[e.clientX,e.clientY];Tv=[0,0];
  }
});
addEventListener('pointermove',e=>{
  if(e.pointerId===movePtr&&moveOrigin){
    Tv=[lim((e.clientX-moveOrigin[0])/60),lim((e.clientY-moveOrigin[1])/60)];
  }
});
function endTouch(e){
  if(e.pointerId===movePtr){movePtr=null;moveOrigin=null;Tv=[0,0]}
  if(e.pointerId===sprintPtr){sprintPtr=null;sprintHeld=false}
}
addEventListener('pointerup',endTouch);
addEventListener('pointercancel',endTouch);
for(let i=0;i<8;i++)mkOrb();for(let i=0;i<3;i++)mkHaz();board();$('wl').textContent='◈ '+fmt(wallet);
const clk=new THREE.Clock();const cam=new THREE.Vector3(0,16,13);
function tick(){requestAnimationFrame(tick);const dt=Math.min(clk.getDelta(),.05),t=clk.elapsedTime;
for(const o of orbs){o.rotation.y+=dt*2;o.position.y=1+Math.sin(t*3+o.id)*.25}
if(accM){accM.children.forEach(ch=>{if(ch.userData.spin){ch.position.x=Math.cos(t*2)*.9;ch.position.z=Math.sin(t*2)*.9}if(ch.userData.orbit){ch.position.x=Math.cos(t*1.6)*1.15;ch.position.z=Math.sin(t*1.6)*1.15;ch.rotation.y+=dt*2}});}
if(curSkin.rb&&bd){const h=(t*.4)%1;bd.material.color.setHSL(h,.8,.65);bd.material.emissive.setHSL(h,.9,.4)}
if(run&&!paused){
let x=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0)+Tv[0],z=(K.ArrowDown||K.KeyS?1:0)-(K.ArrowUp||K.KeyW?1:0)+Tv[1];
const l=Math.hypot(x,z);if(l>1){x/=l;z/=l}
const moving=Math.hypot(x,z)>0.05;
const wantSprint=(sprintHeld||isSprintKey())&&moving&&stamina>0.02;
sprinting=!!wantSprint;
const sp=sprinting?upSprintMul():1;
const k=Math.min(1,5*dt);vel.x+=(x*14*upSpeed()*sp-vel.x)*k;vel.z+=(z*14*upSpeed()*sp-vel.z)*k;
if(sprinting){stamina=Math.max(0,stamina-upSprintDrain()*dt);if(stamina<=0){sprinting=false}}
else{const rate=moving?0.18:0.32;stamina=Math.min(upStaminaMax(),stamina+rate*dt)}
P.position.x=cl(P.position.x+vel.x*dt);P.position.z=cl(P.position.z+vel.z*dt);
if(vel.length()>.8)P.rotation.y=Math.atan2(vel.x,vel.z);
if(curTrail.c.length&&vel.length()>1.5&&trl.length<180){tE-=dt;while(tE<=0){tE+=.035;mkTrail(curTrail)}}
if(t-lastT>upComboWin()){if(combo>=3)seq([440,370,300],.07,'triangle');combo=1}
for(const o of orbs){const dx=P.position.x-o.position.x,dz=P.position.z-o.position.z,d=Math.hypot(dx,dz);
if(magnet>0&&d<upMagnetR()&&d>.08){const pull=(typeof upMagnetSp==='function'?upMagnetSp():34)*(0.5+0.65*(1-Math.min(1,d/upMagnetR())));o.position.x+=dx/d*pull*dt;o.position.z+=dz/d*pull*dt}
if(d<1.6){const q=o.userData.k,ox=o.position.x,oz=o.position.z;burst(o.position,q);
if(q=='g'){combo=t-lastT<upComboWin()?Math.min(combo+1,5):1;lastT=t;gain(combo+(hasU('u7')&&got%8==7?1:0)+(hasU('u11')&&got%10==9?2:0));got++;beep(480+combo*90,.08);noise(.05,3500,.04);shake(.07+combo*.025+(combo>=5?.08:0));if(combo==5)beep(1500,.1,'sine',.06);if(got%(ranked?4:5)==0&&haz.length<(ranked?16:14))mkHaz('d')}
else if(q=='s'){shield=6*upShieldMul();gain(2);banner('Bouclier !');seq([300,450,600],.08,'triangle');shake(.38)}
else if(q=='f'){freeze=5*upFreezeMul();gain(2);banner('Gel !');seq([900,700,500,350],.07,'sine');noise(.3,6000,.05);shake(.38)}
else{magnet=7;gain(2);banner('Aimant !');seq([380,480,380,480],.07,'triangle');shake(.38)}
const nk=rk();kind(o,nk);o.position.set(rnd(),1,rnd());
try{window.mpOnTake&&window.mpOnTake(ox,oz,q,o.position.x,o.position.z,nk)}catch(e){}}}
const w=1+Math.floor(got/12);if(w>wave){wave=w;banner('Vague '+w);seq([520,660,780,1040],.12,'triangle');noise(.4,800,.06);if(orbs.length<20)for(let i=0;i<6;i++)mkOrb();if(haz.length<(ranked?16:14)){mkHaz('c');if(ranked&&rankOf(rankPts).id>=4)mkHaz('d')}}
const _D=typeof rankDiff==='function'?rankDiff():{spd:1,chase:1,waveSpd:1};const spd=(1+got*.01)*_D.spd*(freeze>0?.15:1);let near=99;
for(const h of haz){const u=h.userData,v=u.v;
if(u.t=='c'){const dx=P.position.x-h.position.x,dz=P.position.z-h.position.z,d=Math.hypot(dx,dz)||1,s=(2.7+wave*.32)*(_D.chase||1)*(freeze>0?.15:1);near=Math.min(near,d);h.position.x+=dx/d*s*dt;h.position.z+=dz/d*s*dt;h.rotation.y+=dt*3}
else{h.position.x+=v.x*dt*spd;h.position.z+=v.z*dt*spd;if(Math.abs(h.position.x)>A-1)v.x*=-1;if(Math.abs(h.position.z)>A-1)v.z*=-1;h.rotation.y+=dt*2;h.rotation.x+=dt}
if(Math.hypot(h.position.x-P.position.x,h.position.z-P.position.z)<1.6){
if(shield>0){burst(h.position,'r',16);gain(u.t=='c'?5:3);noise(.2,900,.12);beep(600,.1,'square');away(h)}
else if(inv<=0){inv=1.5;flash=.45;burst(P.position,'r',16);noise(.25,400,.15);beep(140,.25,'sawtooth');
if(window.mpPlaying&&typeof window.mpOnHit==='function'){
  if(window.mpOnHit()){break}
}else{
  lives--;
  if(lives<=0){end();break}
}}}}
if(run&&lives<=0){end()}
tk-=dt;if(run&&near<9&&tk<=0){tk=.22+near*.05;beep(1300,.02,'square')}
if(run){
if(lives==1){heart-=dt;if(heart<=0){heart=1;beep(90,.12,'sine');beep(70,.14,'sine',.18)}}
if(grn){const v=grn.userData.v;grn.userData.life-=dt;grn.position.x+=v.x*dt;grn.position.z+=v.z*dt;if(Math.abs(grn.position.x)>A-1)v.x*=-1;if(Math.abs(grn.position.z)>A-1)v.z*=-1;
grn.rotation.y+=dt*3;grn.position.y=1+Math.sin(t*4)*.3;grn.visible=grn.userData.life>3||Math.floor(t*8)%2==0;
if(Math.hypot(grn.position.x-P.position.x,grn.position.z-P.position.z)<1.9){lives=Math.min(lives+1,5);gain(10);burst(grn.position,'n',28);banner('+1 vie   +10');seq([523,659,784,1047,1319],.08,'triangle');noise(.2,5000,.05,.1);shake(.45);killGreen()}
else if(grn.userData.life<=0){seq([500,400,300],.1,'sine');killGreen()}}
else{greenT-=dt;if(greenT<=0)mkGreen()}
const sp0=shield>0,fp0=freeze>0,mp0=magnet>0;
inv-=dt;shield-=dt;freeze-=dt;magnet-=dt;flash-=dt;
if(sp0&&shield<=0)seq([500,400,300],.08,'triangle');if(fp0&&freeze<=0)seq([350,450],.08,'sine');if(mp0&&magnet<=0)seq([480,380],.08,'triangle');
if(shield>0&&shield<2&&Math.floor(shield*4)!=Math.floor((shield+dt)*4))beep(800,.03,'square');
P.visible=inv<=0||Math.floor(t*10)%2==0;sh.visible=shield>0;hud()}}
else if(!run){P.rotation.y+=dt*.5;P.visible=true;stamina=upStaminaMax();sprinting=false;sprintHeld=false;movePtr=sprintPtr=null;moveOrigin=null;Tv=[0,0]}
$('fl').style.opacity=Math.max(flash,0);
$('bn').style.opacity=paused?1:Math.min(1,Math.max(bt,0));bt-=dt;
for(let i=bits.length-1;i>=0;i--){const b=bits[i],u=b.userData;u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}u.vy-=15*dt;b.position.x+=u.vx*dt;b.position.y=Math.max(.1,b.position.y+u.vy*dt);b.position.z+=u.vz*dt;b.scale.setScalar(u.life/.6)}
for(let i=trl.length-1;i>=0;i--){const b=trl[i],u=b.userData;u.life-=dt;if(u.life<=0){S.remove(b);trl.splice(i,1);continue}b.position.y=Math.max(.1,b.position.y+u.up*dt);const k=u.life/u.L;if(u.style==='streak'){b.scale.x=u.s0*.45*k;b.scale.y=u.s0*.45*k;b.scale.z=u.s0*(1.2+k)}else b.scale.setScalar(u.s0*k)}
cam.lerp(new THREE.Vector3(P.position.x,16,P.position.z+13),1-Math.exp(-4*dt));C.position.copy(cam);if(shk>.01){C.position.x+=(Math.random()-.5)*shk;C.position.y+=(Math.random()-.5)*shk;shk*=.86}C.lookAt(P.position.x,0,P.position.z-2);
if(window.updateFluidTrail)try{window.updateFluidTrail(dt)}catch(e){}
if(window.mpTick)try{window.mpTick(dt)}catch(e){}
R.render(S,C)}
tick();
