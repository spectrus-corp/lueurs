/* ---- Claude merge: quetes, XP, UPG, VFX, jackpot, meteores ---- */
const COST_UP=[4000,8000,15000,26000,45000];
const UPG=[['sh','Bouclier+','Bouclier +1 s / niveau',5,1],['mg','Aimant+','Aimant +1,5 s / niveau',5,1],['fr','Gel+','Gel +1 s / niveau',5,1],['sp','Vitesse+','+4 % vitesse / niveau',5,1],['rd','Rayon+','+8 % rayon collecte / niveau',5,1],['lk','Chance+','Plus de lueurs speciales',5,1.2],['gn','Gains+','+10 % lueurs / niveau',5,2],['hp','Coeur de reserve','+1 vie au depart',2,5],['st','Depart blinde','Bouclier 3 s au depart / niv.',3,2.5]];
let up={},xp=0;
try{up=JSON.parse(localStorage.getItem('lueursU')||'{}');xp=+localStorage.getItem('lueursX')||0}catch(e){}
const U=k=>up[k]||0;
const lvl=()=>Math.floor(Math.sqrt(xp/150))+1;
const gm=()=>1+.1*U('gn')+.01*(lvl()-1);
function saveUp(){try{localStorage.setItem('lueursU',JSON.stringify(up));localStorage.setItem('lueursX',xp)}catch(e){}}

const QT=[['Attrape 30 lueurs','got',30,600],['Atteins la vague 3','wave',3,500],['Fais un combo x5','cmb',1,400],['Detruis 5 cristaux','dst',5,700],['Survis 90 secondes','time',90,600],['Touche le PNJ vert','grn',1,500],['Marque 150 points','score',150,800],['Sprint 15 s','spr',15,500],['Attrape 3 lueurs speciales','spc',3,500],['Frole 5 cristaux','nm',5,600]];
function rngSeed(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const day=Math.floor(Date.now()/864e5);
let Q={d:-1,i:[],p:[0,0,0],c:[0,0,0]},msg0='';
try{Q=JSON.parse(localStorage.getItem('lueursQ')||'null')||Q}catch(e){}
if(Q.d!=day){
  const r=rngSeed(day*131+7),pool=QT.map((_,i)=>i),pick=[];
  for(let n=0;n<3;n++)pick.push(pool.splice(Math.floor(r()*pool.length),1)[0]);
  Q={d:day,i:pick,p:[0,0,0],c:[0,0,0]};
}
try{
  const ld=+localStorage.getItem('lueursD')||0;
  if(ld!=day){
    const sk=ld==day-1?(+localStorage.getItem('lueursS')||0)+1:1;
    localStorage.setItem('lueursS',sk);localStorage.setItem('lueursD',day);
    const b=200+Math.min(sk,8)*100;wallet+=b;
    msg0='Bonus quotidien : +'+b+' lueurs (serie de '+sk+' jour'+(sk>1?'s':'')+').';
    try{localStorage.setItem('lueursQ',JSON.stringify(Q))}catch(e){}
    try{save()}catch(e){}
  }
}catch(e){}

let st={got:0,wave:1,cmb:0,dst:0,time:0,grn:0,score:0,spr:0,spc:0,nm:0};
function renderQ(){
  try{
    $('qs').innerHTML=Q.i.map((qi,n)=>{const q=QT[qi];return '<li><span>'+(Q.c[n]?'\u2713 ':'')+q[0]+'</span><b>'+(Q.c[n]?'+'+q[3]:Math.min(Q.p[n],q[2])+'/'+q[2])+'</b></li>'}).join('');
    $('lv').textContent='Niveau '+lvl()+' \u00b7 XP '+xp;
  }catch(e){}
}
function qProg(key,val){
  Q.i.forEach((qi,n)=>{
    const q=QT[qi];if(Q.c[n]||q[1]!==key)return;
    Q.p[n]=Math.max(Q.p[n],val);
    if(Q.p[n]>=q[2]){Q.c[n]=1;wallet+=q[3];xp+=q[3];try{floaty('+'+q[3]+' quete',P.position,'#7dffb0')}catch(e){}saveUp();try{save()}catch(e){}}
  });
  try{localStorage.setItem('lueursQ',JSON.stringify(Q))}catch(e){}
  renderQ();
}
renderQ();
if(msg0){try{const p=$('p');if(p)p.textContent=msg0+' '+(p.textContent||'')}catch(e){}}

let rings=[],mts=[],jp=null,jt=18,shk=0;
function ring(p,c,sz=8,life=.6){
  try{
    const m=new THREE.Mesh(RG,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));
    m.rotation.x=-Math.PI/2;m.position.set(p.x,.15,p.z);S.add(m);rings.push({m,life,L:life,sz});
  }catch(e){}
}
function floaty(txt,p,col){
  p=p||P.position;col=col||'#ffd36b';
  try{
    const v=new THREE.Vector3(p.x,1.5,p.z).project(C);
    const d=document.createElement('div');d.className='fl2';d.textContent=txt;
    d.style.cssText='left:'+((v.x+1)/2*innerWidth)+'px;top:'+((1-v.y)/2*innerHeight)+'px;color:'+col;
    document.body.appendChild(d);setTimeout(()=>d.remove(),900);
  }catch(e){}
}
function themeWave(){try{const c=new THREE.Color().setHSL((.72+wave*.04)%1,.5,.09);S.background=c;S.fog.color=c.clone()}catch(e){}}
function bomb(){
  ring(P.position,0xffa040,26,.7);ring(P.position,0xffffff,14,.5);shk=.7;noise(.5,500,.15);beep(110,.4,'sawtooth');
  for(const h of haz){if(Math.hypot(h.position.x-P.position.x,h.position.z-P.position.z)<13){burst(h.position,'r',14);gain(3);st.dst++;qProg('dst',st.dst);away(h)}}
}
function mkJp(){
  try{
    if(jp)return;
    const m=new THREE.Mesh(new THREE.SphereGeometry(.55,12,10),om.j);
    const l=new THREE.PointLight(0xffe48a,2,12);m.add(l);m.scale.setScalar(2.2);
    m.position.set(rnd(),1.3,rnd());m.userData.life=9;S.add(m);jp=m;banner('Jackpot !');seq([784,988,1175,1568],.07,'triangle');
  }catch(e){}
}
function killJp(){if(jp){S.remove(jp);jp=null}jt=16+Math.random()*12}
function mkMt(){
  try{
    const x=cl(P.position.x+(Math.random()-.5)*12),z=cl(P.position.z+(Math.random()-.5)*12);
    const m=new THREE.Mesh(new THREE.CircleGeometry(1,20),new THREE.MeshBasicMaterial({color:0xff3a4a,transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false}));
    m.rotation.x=-Math.PI/2;m.position.set(x,.12,z);m.scale.setScalar(3.4);S.add(m);mts.push({m,x,z,t:1.4});beep(900,.08,'square');
  }catch(e){}
}

function buyUp(id){
  const u=UPG.find(x=>x[0]==id);if(!u)return;const l=U(id);if(l>=u[3])return;
  const c=Math.round(COST_UP[l]*u[4]);if(wallet<c)return;wallet-=c;up[id]=l+1;saveUp();try{save()}catch(e){}renderUpg();seq([523,659,784],.07,'triangle');
}
function renderUpg(){
  try{
    $('su').innerHTML=UPG.map(([id,n,d,mx,m])=>{
      const l=U(id),c=l<mx?Math.round(COST_UP[l]*m):0;
      return `<div class='cd' style='--rc:${['#8af','#6be3ff','#a78bfa','#f59e0b','#f43f5e'][Math.min(4,l)]}'><b>${n}</b><span class='rr'>Niv. ${l}/${mx}</span><span class='tag'>${d}</span>`+
        (l>=mx?`<em>Max</em>`:`<button type='button' data-up='${id}' ${wallet<c?'disabled':''}>${fmt(c)} \u25C8</button>`)+`</div>`;
    }).join('');
    $('su').querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>buyUp(b.getAttribute('data-up')));
  }catch(e){}
}
try{const _rs=window.renderShop;window.renderShop=function(){if(_rs)_rs.apply(this,arguments);renderUpg()}}catch(e){}
renderUpg();

let peek=false,peekId=null;
function startPeek(id){
  const it=typeof find==='function'?find(id):null;if(!it)return;
  peek=true;peekId=id;
  try{
    if(it.t==='k')setSkin(id);else if(it.t==='t'){curTrail=it}else if(it.t==='a')setAcc(id);
    $('pk').hidden=false;$('pn').textContent='Apercu : '+it.n;
    const own=owned.includes(id);
    $('pb').textContent=own?'Equiper':'Acheter';
    $('pb').onclick=()=>{if(own){try{equip(id)}catch(e){}endPeek()}else{try{buy(id)}catch(e){}endPeek()}};
  }catch(e){}
}
function endPeek(){
  peek=false;peekId=null;
  try{$('pk').hidden=true;setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}
}
try{$('px').onclick=endPeek}catch(e){}

window.claudeFx={
  onGain(n){xp+=Math.max(1,Math.floor(n));saveUp();st.score=score;qProg('score',score)},
  onGot(){st.got++;qProg('got',st.got);if(st.got%22===0)mkJp()},
  onCombo(c){if(c>=5){st.cmb=1;qProg('cmb',1)}},
  onSpecial(){st.spc++;qProg('spc',st.spc)},
  onWave(w){st.wave=w;qProg('wave',w);themeWave();if(w>=2&&Math.random()<.35)mkMt()},
  onDestroy(){st.dst++;qProg('dst',st.dst)},
  onGreen(){st.grn=1;qProg('grn',1)},
  onNearMiss(){st.nm++;qProg('nm',st.nm);gain(2);floaty('Frole +2',P.position,'#ff9ad9');beep(1100,.04)},
  onSprint(dt){st.spr+=dt;qProg('spr',Math.floor(st.spr))},
  onBomb(){bomb()},
  tick(dt,t){
    st.time+=dt;if(run)qProg('time',Math.floor(st.time));
    if(typeof sprinting!=='undefined'&&sprinting)this.onSprint(dt);
    for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.life-=dt;if(r.life<=0){S.remove(r.m);try{r.m.material.dispose()}catch(e){}rings.splice(i,1);continue}const q=1-r.life/r.L;r.m.scale.setScalar(.5+q*r.sz);r.m.material.opacity=.8*(1-q)}
    for(let i=mts.length-1;i>=0;i--){
      const mt=mts[i];mt.t-=dt;mt.m.material.opacity=.15+.35*(1-mt.t/1.4)*(Math.floor(t*10)%2?1:.6);
      if(mt.t<=0){
        burst({x:mt.x,y:1,z:mt.z},'r',24);ring({x:mt.x,y:.15,z:mt.z},0xff3a4a,9,.5);noise(.35,350,.14);beep(90,.3,'sawtooth');shk=.5;
        const px=mt.x,pz=mt.z;S.remove(mt.m);mts.splice(i,1);
        if(run&&shield<=0&&inv<=0&&Math.hypot(px-P.position.x,pz-P.position.z)<3.4){
          if(!(window.mpPlaying&&window.mpOnHit&&window.mpOnHit())){lives--;if(lives<=0)end()}
        }
      }
    }
    if(jp){
      jp.rotation.y+=dt*3;jp.position.y=1.3+Math.sin(t*5)*.3;jp.userData.life-=dt;
      jp.visible=jp.userData.life>2.5||Math.floor(t*8)%2==0;
      if(Math.hypot(jp.position.x-P.position.x,jp.position.z-P.position.z)<2.6){
        gain(15);st.spc++;qProg('spc',st.spc);burst(jp.position,'j',40);ring(jp.position,0xffe48a,14,.7);floaty('+15 Jackpot',jp.position,'#ffe48a');seq([784,988,1175],.07,'triangle');killJp();
      }else if(jp.userData.life<=0)killJp();
    }else{jt-=dt;if(jt<=0&&run)mkJp()}
    if(shk>0.01){C.position.x+=(Math.random()-.5)*shk;C.position.y+=(Math.random()-.5)*shk;shk*=.88}
  },
  reset(){st={got:0,wave:1,cmb:0,dst:0,time:0,grn:0,score:0,spr:0,spc:0,nm:0};killJp();mts.forEach(m=>S.remove(m.m));mts.length=0;rings.forEach(r=>S.remove(r.m));rings.length=0;shk=0;
    if(U('st')>0){shield=3*U('st')}
  },
  extraLives(){return U('hp')},
  shieldBonus(){return U('sh')},
  magnetBonus(){return U('mg')*1.5},
  freezeBonus(){return U('fr')},
  speedMul(){return 1+0.04*U('sp')},
  collectMul(){return 1+0.08*U('rd')},
  luckBonus(){return 0.012*U('lk')},
  gainMul(){return gm()},
  ring,floaty,bomb
};
window.startPeek=startPeek;
window.endPeek=endPeek;

try{
  const _gain=gain;
  gain=function(n){
    const m=typeof window.claudeFx.gainMul==='function'?window.claudeFx.gainMul():1;
    _gain(Math.max(1,Math.floor(n*m)));
    try{window.claudeFx.onGain(n)}catch(e){}
  };
}catch(e){}

setInterval(()=>{
  try{
    document.querySelectorAll('[data-p]').forEach(b=>{
      if(b._peek)return;b._peek=1;
      b.onclick=e=>{e.preventDefault();startPeek(b.getAttribute('data-p'))};
    });
  }catch(e){}
},800);
