/* Mechanics: FP mode, secrets, game-changing upgrades */
(function(){
  window.fpMode=false;
  window._ghostUsed=false;
  window._secondWindUsed=false;
  window._cornerT=0;
  window._secretFound=JSON.parse(localStorage.getItem('lueursSecrets')||'{}');

  function markSecret(id){
    try{window._secretFound[id]=1;localStorage.setItem('lueursSecrets',JSON.stringify(window._secretFound))}catch(e){}
  }
  function hasSecret(id){return !!window._secretFound[id]}

  const _gain=typeof gain==='function'?gain:null;
  if(_gain){
    window.gain=gain=function(n){
      let m=n;
      try{if(hasU('u20'))m*=2}catch(e){}
      try{if(hasU('u23')&&Math.random()<0.25)m+=1}catch(e){}
      return _gain(m);
    };
  }

  window.toggleFP=function(){
    window.fpMode=!window.fpMode;
    try{banner(window.fpMode?'1re personne':'3e personne')}catch(e){}
    try{seq([440,660],.06,'triangle')}catch(e){}
    try{const b=$('fpBtn');if(b)b.textContent=window.fpMode?'3P':'1P'}catch(e){}
  };

  window.updateCamera=function(dt){
    try{
      if(window.fpMode&&run){
        const yaw=P.rotation.y;
        C.position.set(P.position.x,1.35,P.position.z);
        const lx=P.position.x+Math.sin(yaw)*8;
        const lz=P.position.z+Math.cos(yaw)*8;
        C.lookAt(lx,1.1,lz);
        try{if(bd)bd.visible=false}catch(e){}
        return true;
      }else{
        try{if(bd)bd.visible=true}catch(e){}
        return false;
      }
    }catch(e){return false}
  };

  window.faceVelocity=function(){
    try{if(vel.length()>.8)P.rotation.y=Math.atan2(vel.x,vel.z)}catch(e){}
  };

  window.extraMagnetR=function(){try{return hasU('u25')?6:0}catch(e){return 0}};
  window.enemySlow=function(){try{return (hasU('u22')&&sprinting)?0.55:1}catch(e){return 1}};
  window.tryGhostHit=function(){
    try{
      if(hasU('u21')&&!window._ghostUsed){
        window._ghostUsed=true;inv=2.8;banner('Fantome !');seq([300,500,700],.07,'sine');return true;
      }
    }catch(e){}
    return false;
  };
  window.trySecondWind=function(){
    try{
      if(hasU('u24')&&!window._secondWindUsed&&lives<=0){
        window._secondWindUsed=true;lives=1;inv=2;banner('Second souffle !');seq([523,659,784],.08,'triangle');return true;
      }
    }catch(e){}
    return false;
  };

  let taps=[],tapT=0;
  addEventListener('pointerdown',function(e){
    if(e.clientY>innerHeight*0.12)return;
    const now=performance.now();
    if(now-tapT>700)taps=[];
    taps.push(now);tapT=now;
    if(taps.length>=3){taps=[];if(run)toggleFP()}
  },{passive:true});

  let lpT=null,lpTarget=null;
  addEventListener('pointerdown',function(e){
    const t=e.target;
    if(t&&(t.id==='wl'||(t.closest&&t.closest('#wl')))){lpTarget='wl';lpT=performance.now()}
  },{passive:true});
  addEventListener('pointerup',function(){
    if(lpTarget==='wl'&&lpT&&performance.now()-lpT>900){
      if(!hasSecret('walletHold')){
        markSecret('walletHold');
        try{wallet+=7777;save();$('wl').textContent='◈ '+fmt(wallet);banner('Secret portefeuille +7777')}catch(e){}
        try{seq([660,880,1100],.07,'triangle')}catch(e){}
      }
    }
    lpT=null;lpTarget=null;
  });

  window.tickSecrets=function(dt){
    if(!run){window._cornerT=0;return}
    const ax=Math.abs(P.position.x),az=Math.abs(P.position.z);
    if(ax>A-3.5&&az>A-3.5){
      window._cornerT+=dt;
      if(window._cornerT>2.5){
        const id='corner'+Math.round(P.position.x)+'_'+Math.round(P.position.z);
        if(!hasSecret(id)){
          markSecret(id);
          try{wallet+=1500;gain(5);banner('Coin secret !');seq([523,784,1047],.07,'triangle');save()}catch(e){}
        }
        window._cornerT=0;
      }
    }else window._cornerT=0;
  };

  try{
    if(typeof CODES==='object'){
      Object.assign(CODES,{
        SECRET:{orbs:33333,once:1,label:'Secret +33 333'},
        LUMIERE:{orbs:9000,item:'k10',once:1,label:'+9 000 + Spectre'},
        FANTOME:{item:'k11',once:1,label:'Skin Fantome'},
        DOUBLE:{item:'u20',once:1,label:'Amelioration Double orbes'},
        FANTASM:{item:'u21',once:1,label:'Amelioration Fantome'},
        RALENTI:{item:'u22',once:1,label:'Amelioration Ralenti'},
        CASCADE:{item:'u23',once:1,label:'Amelioration Cascade'},
        SOUFFLE:{item:'u24',once:1,label:'Amelioration Second souffle'},
        RADAR:{item:'u25',once:1,label:'Amelioration Radar aimant'},
        PREMIERE:{orbs:5000,once:1,label:'+5 000 · triple-tap haut = 1P'},
        COIN:{orbs:2000,once:1,label:'+2 000 · coin de map 3s'},
        PORTAIL:{orbs:12000,once:1,label:'+12 000 portail'}
      });
    }
  }catch(e){}

  const _start=typeof start==='function'?start:null;
  if(_start){
    window.start=start=function(isRanked){
      window._ghostUsed=false;window._secondWindUsed=false;window._cornerT=0;
      return _start(isRanked);
    };
  }

  function ensureFpBtn(){
    if($('fpBtn'))return;
    const b=document.createElement('button');
    b.id='fpBtn';b.type='button';b.textContent='1P';
    b.style.cssText='position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:18px;z-index:8;font-size:14px;padding:8px 14px;opacity:.9;pointer-events:auto';
    b.onclick=function(e){e.stopPropagation();toggleFP()};
    document.body.appendChild(b);
  }
  ensureFpBtn();setTimeout(ensureFpBtn,500);
})();
