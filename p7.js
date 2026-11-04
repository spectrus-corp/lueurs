const w=1+Math.floor(got/12);if(w>wave){wave=w;banner('Vague '+w);seq([520,660,780,1040],.12,'triangle');noise(.4,800,.06);if(orbs.length<20)for(let i=0;i<6;i++)mkOrb();if(haz.length<14)mkHaz('c')}
const spd=(1+got*.015)*(freeze>0?.15:1);let near=99;
for(const h of haz){const u=h.userData,v=u.v;
if(u.t=='c'){const dx=P.position.x-h.position.x,dz=P.position.z-h.position.z,d=Math.hypot(dx,dz)||1,s=(3+wave*.4)*(freeze>0?.15:1);near=Math.min(near,d);h.position.x+=dx/d*s*dt;h.position.z+=dz/d*s*dt;h.rotation.y+=dt*3}
else{h.position.x+=v.x*dt*spd;h.position.z+=v.z*dt*spd;if(Math.abs(h.position.x)>A-1)v.x*=-1;if(Math.abs(h.position.z)>A-1)v.z*=-1;h.rotation.y+=dt*2;h.rotation.x+=dt}
if(Math.hypot(h.position.x-P.position.x,h.position.z-P.position.z)<1.6){
if(shield>0){burst(h.position,'r',16);gain(u.t=='c'?5:3);noise(.2,900,.12);beep(600,.1,'square');away(h)}
else if(inv<=0){lives--;inv=1.5;flash=.45;burst(P.position,'r',16);noise(.25,400,.15);beep(140,.25,'sawtooth');if(lives<=0){end();break}}}}
tk-=dt;if(run&&near<9&&tk<=0){tk=.22+near*.05;beep(1300,.02,'square')}
if(run){
if(lives==1){heart-=dt;if(heart<=0){heart=1;beep(90,.12,'sine');beep(70,.14,'sine',.18)}}
if(grn){const v=grn.userData.v;grn.userData.life-=dt;grn.position.x+=v.x*dt;grn.position.z+=v.z*dt;if(Math.abs(grn.position.x)>A-1)v.x*=-1;if(Math.abs(grn.position.z)>A-1)v.z*=-1;
grn.rotation.y+=dt*3;grn.position.y=1+Math.sin(t*4)*.3;grn.visible=grn.userData.life>3||Math.floor(t*8)%2==0;
if(Math.hypot(grn.position.x-P.position.x,grn.position.z-P.position.z)<1.9){lives=Math.min(lives+1,5);gain(10);burst(grn.position,'n',28);banner('+1 vie   +10');seq([523,659,784,1047,1319],.08,'triangle');noise(.2,5000,.05,.1);killGreen()}
else if(grn.userData.life<=0){seq([500,400,300],.1,'sine');killGreen()}}
else{greenT-=dt;if(greenT<=0)mkGreen()}
const dp=dashCd>0,sp0=shield>0,fp0=freeze>0,mp0=magnet>0;
inv-=dt;shield-=dt;freeze-=dt;magnet-=dt;dashCd-=dt;flash-=dt;
if(dp&&dashCd<=0)beep(1000,.05);
if(sp0&&shield<=0)seq([500,400,300],.08,'triangle');if(fp0&&freeze<=0)seq([350,450],.08,'sine');if(mp0&&magnet<=0)seq([480,380],.08,'triangle');
if(shield>0&&shield<2&&Math.floor(shield*4)!=Math.floor((shield+dt)*4))beep(800,.03,'square');
P.visible=inv<=0||Math.floor(t*10)%2==0;sh.visible=shield>0;hud()}}
else if(!run){P.rotation.y+=dt*.5;P.visible=true}
$('fl').style.opacity=Math.max(flash,0);
$('bn').style.opacity=paused?1:Math.min(1,Math.max(bt,0));bt-=dt;
for(let i=bits.length-1;i>=0;i--){const b=bits[i],u=b.userData;u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}u.vy-=15*dt;b.position.x+=u.vx*dt;b.position.y=Math.max(.1,b.position.y+u.vy*dt);b.position.z+=u.vz*dt;b.scale.setScalar(u.life/.6)}
for(let i=trl.length-1;i>=0;i--){const b=trl[i],u=b.userData;u.life-=dt;if(u.life<=0){S.remove(b);trl.splice(i,1);continue}b.position.y=Math.max(.1,b.position.y+u.up*dt);b.scale.setScalar(u.s0*u.life/u.L)}
cam.lerp(new THREE.Vector3(P.position.x,16,P.position.z+13),1-Math.exp(-4*dt));C.position.copy(cam);C.lookAt(P.position.x,0,P.position.z-2);
R.render(S,C)}
tick();
