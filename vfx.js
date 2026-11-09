/* Lueurs VFX pack */
(function(){
  const VFX_COL={g:0xffd36b,s:0x6be3ff,f:0xc58bff,m:0xff7ad9,r:0xff4d6d,n:0x4dff8f,b:0xffa040,j:0xffe48a};
  window.floatTxt=function(txt,col){
    try{
      const el=document.createElement('div');el.className='fl2';el.textContent=txt;
      el.style.left=(50+(Math.random()-.5)*10)+'%';el.style.top=(42+(Math.random()-.5)*8)+'%';
      el.style.color=col||'#ffd36b';document.body.appendChild(el);
      setTimeout(function(){try{el.remove()}catch(e){}},900);
    }catch(e){}
  };
  window.pulseLight=function(pos,hex,int,range,life){
    try{
      const l=new THREE.PointLight(hex,int||2.2,range||12);
      l.position.copy(pos);l.position.y=(pos.y||1)+.4;
      l.userData={life:life||.35,kind:'light'};S.add(l);bits.push(l);
    }catch(e){}
  };
  window.ringBurst=function(pos,hex,scale0){
    try{
      const g=new THREE.RingGeometry(.2,.45,24);
      const m=new THREE.MeshBasicMaterial({color:hex,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false});
      const mesh=new THREE.Mesh(g,m);
      mesh.rotation.x=-Math.PI/2;mesh.position.set(pos.x,.15,pos.z);
      mesh.userData={life:.55,kind:'ring',s0:scale0||1};S.add(mesh);bits.push(mesh);
    }catch(e){}
  };
  window.burst=function(p,k,n){
    const hex=VFX_COL[k]||0xffd36b;n=n||12;
    for(let i=0;i<n;i++){
      const mat=(typeof pm!=='undefined'&&pm[k])?pm[k]:(pm&&pm.g);
      if(!mat)continue;
      const m=new THREE.Mesh(pg,mat);
      m.position.set(p.x,(p.y||1)+Math.random()*.3,p.z);
      const a=Math.random()*6.28,s=4+Math.random()*7;
      m.userData={vx:Math.cos(a)*s,vy:3+Math.random()*6,vz:Math.sin(a)*s,life:.55+Math.random()*.35,kind:'bit'};
      S.add(m);bits.push(m);
    }
    for(let i=0;i<Math.min(8,n);i++){
      const mat=(pm&&(pm[k]||pm.g));if(!mat)break;
      const m=new THREE.Mesh(pg,mat);
      m.position.set(p.x+(Math.random()-.5)*.4,(p.y||1),p.z+(Math.random()-.5)*.4);
      m.userData={vx:(Math.random()-.5)*2,vy:6+Math.random()*8,vz:(Math.random()-.5)*2,life:.4+Math.random()*.3,kind:'spark'};
      S.add(m);bits.push(m);
    }
    try{ringBurst(p,hex,1+(n>16?1:0));if(n>=16)ringBurst(p,hex,1.6);pulseLight(p,hex,1.6+n*.04,10+n*.2,.28+n*.01)}catch(e){}
  };
  let last=performance.now();
  function vfxTick(){
    requestAnimationFrame(vfxTick);
    const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;
    try{
      for(let i=bits.length-1;i>=0;i--){
        const b=bits[i],u=b.userData;if(!u)continue;
        if(u.kind==='ring'){
          u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}
          const t=1-u.life/.55,sc=(u.s0||1)*(1+t*3.2);b.scale.set(sc,sc,sc);
          if(b.material)b.material.opacity=Math.max(0,.85*(1-t));
        }else if(u.kind==='light'||b.isLight){
          u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}
          b.intensity=Math.max(0,(u.life/.35)*2.2);
        }
      }
      if(typeof run!=='undefined'&&run&&typeof fever==='number'&&fever>0&&Math.random()<.3){
        const a=Math.random()*6.28,rr=.6+Math.random()*1.2;
        const m=new THREE.Mesh(pg,pm.j||pm.g);
        m.position.set(P.position.x+Math.cos(a)*rr,.4+Math.random(),P.position.z+Math.sin(a)*rr);
        m.userData={vx:(Math.random()-.5)*2,vy:2+Math.random()*3,vz:(Math.random()-.5)*2,life:.5,kind:'spark'};
        S.add(m);bits.push(m);
      }
      if(typeof run!=='undefined'&&run&&typeof sprinting!=='undefined'&&sprinting&&vel&&vel.length()>2&&Math.random()<.35){
        const m=new THREE.Mesh(pg,pm.s||pm.g);
        m.position.set(P.position.x+(Math.random()-.5)*.5,.12,P.position.z+(Math.random()-.5)*.5);
        m.userData={vx:-vel.x*.15+(Math.random()-.5),vy:.5+Math.random(),vz:-vel.z*.15+(Math.random()-.5),life:.35,kind:'spark'};
        S.add(m);bits.push(m);
      }
    }catch(e){}
  }
  if(document.readyState==='complete')vfxTick();else addEventListener('load',vfxTick);
})();
