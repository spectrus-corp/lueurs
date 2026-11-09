/* Lueurs VFX pack — bursts, enemy death, lights, sparks, orb to wallet */
(function(){
  const VFX_COL={g:0xffd36b,s:0x6be3ff,f:0xc58bff,m:0xff7ad9,r:0xff4d6d,n:0x4dff8f,b:0xffa040,j:0xffe48a};

  window.floatTxt=function(txt,col){
    try{
      const el=document.createElement('div');el.className='fl2';el.textContent=txt;
      el.style.left=(50+(Math.random()-.5)*12)+'%';
      el.style.top=(40+(Math.random()-.5)*10)+'%';
      el.style.color=col||'#ffd36b';
      document.body.appendChild(el);
      setTimeout(function(){try{el.remove()}catch(e){}},950);
    }catch(e){}
  };

  window.pulseLight=function(pos,hex,int,range,life){
    try{
      const l=new THREE.PointLight(hex,int||2.2,range||12);
      l.position.copy(pos);l.position.y=(pos.y||1)+.4;
      l.userData={life:life||.35,kind:'light'};
      S.add(l);bits.push(l);
    }catch(e){}
  };

  window.ringBurst=function(pos,hex,scale0){
    try{
      const g=new THREE.RingGeometry(.15,.4,28);
      const m=new THREE.MeshBasicMaterial({color:hex,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false});
      const mesh=new THREE.Mesh(g,m);
      mesh.rotation.x=-Math.PI/2;
      mesh.position.set(pos.x,.12,pos.z);
      mesh.userData={life:.55,kind:'ring',s0:scale0||1};
      S.add(mesh);bits.push(mesh);
    }catch(e){}
  };

  function addBit(pos,hex,vx,vy,vz,life,kind,scale){
    try{
      const mat=new THREE.MeshBasicMaterial({color:hex,transparent:true,opacity:1});
      const m=new THREE.Mesh(pg||new THREE.SphereGeometry(.12,6,6),mat);
      m.position.set(pos.x,pos.y||1,pos.z);
      if(scale)m.scale.setScalar(scale);
      m.userData={vx:vx,vy:vy,vz:vz,life:life,kind:kind||'bit',hex:hex};
      S.add(m);bits.push(m);
    }catch(e){}
  }

  window.burst=function(p,k,n){
    const hex=VFX_COL[k]||0xffd36b;n=n||12;
    for(let i=0;i<n;i++){
      const a=Math.random()*6.28,s=4+Math.random()*7;
      addBit(p,hex,Math.cos(a)*s,3+Math.random()*6,Math.sin(a)*s,.5+Math.random()*.35,'bit');
    }
    for(let i=0;i<Math.min(10,n);i++){
      addBit(
        {x:p.x+(Math.random()-.5)*.5,y:(p.y||1),z:p.z+(Math.random()-.5)*.5},
        hex,(Math.random()-.5)*2,6+Math.random()*9,(Math.random()-.5)*2,.35+Math.random()*.3,'spark',.7
      );
    }
    try{
      ringBurst(p,hex,1+(n>14?1:0));
      if(n>=16)ringBurst(p,hex,1.7);
      pulseLight(p,hex,1.5+n*.05,10+n*.25,.3+n*.012);
    }catch(e){}
  };

  window.enemyDeath=function(pos,ty){
    try{
      const base=pos.clone?pos.clone():{x:pos.x,y:pos.y||1,z:pos.z};
      const isCrystal=ty==='c';
      const col=isCrystal?0xff7a1a:0xff2a55;
      const col2=isCrystal?0xffe48a:0xff6b8a;
      for(let i=0;i<10;i++){
        const a=Math.random()*6.28,r=.15+Math.random()*.5;
        addBit(
          {x:base.x+Math.cos(a)*r,y:base.y||1,z:base.z+Math.sin(a)*r},
          col2,(Math.random()-.5)*.4,8+Math.random()*14,(Math.random()-.5)*.4,
          .55+Math.random()*.35,'ray',.55+Math.random()*.4
        );
      }
      for(let i=0;i<22;i++){
        const a=Math.random()*6.28,s=5+Math.random()*10;
        addBit(base,col,Math.cos(a)*s,2+Math.random()*5,Math.sin(a)*s,.45+Math.random()*.35,'bit',.9);
      }
      ringBurst(base,col,1.2);
      setTimeout(function(){try{ringBurst(base,col2,1.9)}catch(e){}},70);
      setTimeout(function(){try{ringBurst(base,0xffffff,2.4)}catch(e){}},140);
      pulseLight(base,col,4.5,18,.45);
      pulseLight(base,col2,2.5,12,.35);
      try{floatTxt(isCrystal?'💥':'✦',isCrystal?'#ffa040':'#ff6b8a')}catch(e){}
      try{shake&&shake(.55)}catch(e){}
      try{buzz&&buzz(40)}catch(e){}
    }catch(e){
      try{burst(pos,'r',18)}catch(x){}
    }
  };

  window.playerHitFx=function(pos){
    try{
      const p=pos||P.position;
      burst(p,'r',18);
      ringBurst(p,0xff2a55,1.5);
      pulseLight(p,0xff2a55,3.2,14,.4);
      for(let i=0;i<8;i++){
        const a=Math.random()*6.28;
        addBit(p,0xff4d6d,Math.cos(a)*6,4+Math.random()*4,Math.sin(a)*6,.4,'spark');
      }
    }catch(e){}
  };

  window.specialPickupFx=function(pos,kind){
    try{
      const map={s:0x6be3ff,f:0xc58bff,m:0xff7ad9,b:0x4dff8f,j:0xffe48a};
      const hex=map[kind]||0xffd36b;
      ringBurst(pos,hex,1.4);
      pulseLight(pos,hex,3,14,.4);
      for(let i=0;i<12;i++){
        const a=i/12*Math.PI*2;
        addBit(pos,hex,Math.cos(a)*5,3+Math.random()*4,Math.sin(a)*5,.5,'spark');
      }
    }catch(e){}
  };

  window.orbToWallet=function(worldPos,amount){
    try{
      amount=Math.max(1,Math.floor(amount||1));
      try{
        const el=document.createElement('div');
        el.className='fl2 pts';
        el.textContent='+'+amount;
        let sx=50,sy=42;
        try{
          if(worldPos&&typeof C!=='undefined'&&C){
            const v=new THREE.Vector3(worldPos.x,(worldPos.y||1)+.5,worldPos.z);
            v.project(C);
            sx=(v.x*.5+.5)*100;
            sy=(-v.y*.5+.5)*100;
            sx=Math.max(8,Math.min(92,sx));
            sy=Math.max(12,Math.min(78,sy));
          }
        }catch(e){}
        el.style.left=sx+'%';
        el.style.top=sy+'%';
        el.style.color=amount>=5?'#fff':'#ffd36b';
        if(amount>=3)el.style.fontSize=(22+Math.min(amount,8)*2)+'px';
        document.body.appendChild(el);
        setTimeout(function(){try{el.remove()}catch(e){}},950);
      }catch(e){}

      let x=innerWidth*.5,y=innerHeight*.45;
      try{
        if(worldPos&&typeof C!=='undefined'&&C){
          const v=new THREE.Vector3(worldPos.x,(worldPos.y||1)+.3,worldPos.z);
          v.project(C);
          x=(v.x*.5+.5)*innerWidth;
          y=(-v.y*.5+.5)*innerHeight;
        }
      }catch(e){}
      const fly=document.createElement('div');
      fly.className='orbFly';
      fly.style.left=x+'px';
      fly.style.top=y+'px';
      document.body.appendChild(fly);
      const wl=document.getElementById('wl')||document.getElementById('s');
      let tx=24,ty=28;
      if(wl){
        const r=wl.getBoundingClientRect();
        tx=r.left+r.width*.5;
        ty=r.top+r.height*.5;
      }
      void fly.offsetWidth;
      fly.style.transform='translate('+(tx-x)+'px,'+(ty-y)+'px) scale(.25)';
      fly.style.opacity='0.15';
      setTimeout(function(){
        try{fly.remove()}catch(e){}
        try{
          if(wl){
            wl.classList.remove('pulse');
            void wl.offsetWidth;
            wl.classList.add('pulse');
            setTimeout(function(){try{wl.classList.remove('pulse')}catch(e){}},400);
          }
        }catch(e){}
      },620);
    }catch(e){}
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
          const t=1-u.life/.55,sc=(u.s0||1)*(1+t*3.4);
          b.scale.set(sc,sc,sc);
          if(b.material)b.material.opacity=Math.max(0,.9*(1-t));
          continue;
        }
        if(u.kind==='light'||b.isLight){
          u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}
          b.intensity=Math.max(0,(u.life/.4)*3.5);
          continue;
        }
        if(u.kind==='ray'){
          u.life-=dt;if(u.life<=0){S.remove(b);bits.splice(i,1);continue}
          b.position.x+=u.vx*dt;b.position.y+=u.vy*dt;b.position.z+=u.vz*dt;
          u.vy*=0.98;
          const o=Math.max(0,u.life/.6);
          b.scale.setScalar(.4+o*1.2);
          if(b.material)b.material.opacity=o;
          continue;
        }
      }
      if(typeof run!=='undefined'&&run&&typeof fever==='number'&&fever>0&&Math.random()<.32){
        const a=Math.random()*6.28,rr=.5+Math.random()*1.3;
        addBit(
          {x:P.position.x+Math.cos(a)*rr,y:.5+Math.random(),z:P.position.z+Math.sin(a)*rr},
          0xffd36b,(Math.random()-.5)*2,2+Math.random()*3,(Math.random()-.5)*2,.45,'spark',.6
        );
      }
      if(typeof run!=='undefined'&&run&&typeof sprinting!=='undefined'&&sprinting&&vel&&vel.length()>2&&Math.random()<.4){
        addBit(
          {x:P.position.x+(Math.random()-.5)*.4,y:.15,z:P.position.z+(Math.random()-.5)*.4},
          0x6be3ff,-vel.x*.12+(Math.random()-.5),0.4+Math.random(),-vel.z*.12+(Math.random()-.5),.3,'spark',.5
        );
      }
      if(typeof run!=='undefined'&&run&&typeof freeze==='number'&&freeze>0&&Math.random()<.2){
        const a=Math.random()*6.28,rr=1+Math.random()*2;
        addBit(
          {x:P.position.x+Math.cos(a)*rr,y:1+Math.random(),z:P.position.z+Math.sin(a)*rr},
          0xc58bff,(Math.random()-.5)*.5,1+Math.random()*2,(Math.random()-.5)*.5,.5,'spark',.45
        );
      }
    }catch(e){}
  }
  if(document.readyState==='complete')vfxTick();else addEventListener('load',vfxTick);
})();
