/* Mechanics: controllable FP + secrets + upgrades */
(function(){
  window.fpMode=false;
  window.fpYaw=0;
  window.fpPitch=0;
  window._ghostUsed=false;
  window._secondWindUsed=false;
  window._cornerT=0;
  try{window._secretFound=JSON.parse(localStorage.getItem('lueursSecrets')||'{}')}catch(e){window._secretFound={}}

  function markSecret(id){try{window._secretFound[id]=1;localStorage.setItem('lueursSecrets',JSON.stringify(window._secretFound))}catch(e){}}
  function hasSecret(id){return !!window._secretFound[id]}

  var _gain=typeof gain==='function'?gain:null;
  if(_gain){
    window.gain=gain=function(n){
      var m=n;
      try{if(hasU('u20'))m*=2}catch(e){}
      try{if(hasU('u23')&&Math.random()<0.25)m+=1}catch(e){}
      return _gain(m);
    };
  }

  window.toggleFP=function(){
    window.fpMode=!window.fpMode;
    if(window.fpMode){
      try{window.fpYaw=P.rotation.y||0}catch(e){window.fpYaw=0}
      window.fpPitch=0;
      window._lookPtr=null;
    }
    try{banner(window.fpMode?'1re personne':'3e personne')}catch(e){}
    try{seq([440,660],.06,'triangle')}catch(e){}
    try{var b=$('fpBtn');if(b)b.textContent=window.fpMode?'3P':'1P'}catch(e){}
  };

  window.extraMagnetR=function(){try{return hasU('u25')?6:0}catch(e){return 0}};
  window.enemySlow=function(){try{return (hasU('u22')&&sprinting)?0.55:1}catch(e){return 1}};
  window.tryGhostHit=function(){
    try{if(hasU('u21')&&!window._ghostUsed){window._ghostUsed=true;inv=2.8;banner('Fantome !');seq([300,500,700],.07,'sine');return true}}catch(e){}
    return false;
  };
  window.trySecondWind=function(){
    try{if(hasU('u24')&&!window._secondWindUsed){window._secondWindUsed=true;lives=1;inv=2;banner('Second souffle !');seq([523,659,784],.08,'triangle');return true}}catch(e){}
    return false;
  };

  window.fpRemapInput=function(x,z){
    if(!window.fpMode)return {x:x,z:z};
    var fwd=-z, str=x;
    var yaw=window.fpYaw||0;
    var s=Math.sin(yaw), c=Math.cos(yaw);
    return {x:s*fwd+c*str, z:c*fwd-s*str};
  };

  window._lookPtr=null;
  window._lookLast=null;
  addEventListener('pointerdown',function(e){
    try{
      if(!window.fpMode||typeof run==='undefined'||!run)return;
      if(e.target&&e.target.closest&&e.target.closest('button,input,textarea,#chat,#shop,#mp,#msg,#fpBtn'))return;
      if(e.clientX>=innerWidth*0.5){
        window._lookPtr=e.pointerId;
        window._lookLast=[e.clientX,e.clientY];
      }
    }catch(err){}
  },true);
  addEventListener('pointermove',function(e){
    try{
      if(e.pointerId!==window._lookPtr||!window._lookLast)return;
      var dx=e.clientX-window._lookLast[0];
      var dy=e.clientY-window._lookLast[1];
      window.fpYaw-=dx*0.0055;
      window.fpPitch=Math.max(-0.4,Math.min(0.3,window.fpPitch-dy*0.004));
      window._lookLast=[e.clientX,e.clientY];
      try{P.rotation.y=window.fpYaw}catch(err){}
    }catch(err){}
  },true);
  function endLook(e){
    if(e.pointerId===window._lookPtr){window._lookPtr=null;window._lookLast=null}
  }
  addEventListener('pointerup',endLook,true);
  addEventListener('pointercancel',endLook,true);

  addEventListener('mousemove',function(e){
    try{
      if(!window.fpMode||!run)return;
      if(e.buttons===2||document.pointerLockElement){
        window.fpYaw-=e.movementX*0.0035;
        window.fpPitch=Math.max(-0.4,Math.min(0.3,window.fpPitch-e.movementY*0.003));
        P.rotation.y=window.fpYaw;
      }
    }catch(err){}
  });
  addEventListener('contextmenu',function(e){if(window.fpMode&&run)e.preventDefault()});

  addEventListener('keydown',function(e){
    try{
      if(!window.fpMode||!run)return;
      if(e.code==='KeyQ'){window.fpYaw+=0.12;P.rotation.y=window.fpYaw}
      if(e.code==='KeyE'){window.fpYaw-=0.12;P.rotation.y=window.fpYaw}
    }catch(err){}
  });

  var taps=[],tapT=0;
  addEventListener('pointerdown',function(e){
    if(e.clientY>innerHeight*0.12)return;
    var now=performance.now();
    if(now-tapT>700)taps=[];
    taps.push(now);tapT=now;
    if(taps.length>=3){taps=[];if(typeof run!=='undefined'&&run)toggleFP()}
  },{passive:true});

  var lpT=null,lpTarget=null;
  addEventListener('pointerdown',function(e){
    var t=e.target;
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
    if(typeof run==='undefined'||!run){window._cornerT=0;return}
    var ax=Math.abs(P.position.x),az=Math.abs(P.position.z);
    if(ax>A-3.5&&az>A-3.5){
      window._cornerT+=dt;
      if(window._cornerT>2.5){
        var id='corner'+Math.round(P.position.x)+'_'+Math.round(P.position.z);
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
        DOUBLE:{item:'u20',once:1,label:'Double orbes'},
        FANTASM:{item:'u21',once:1,label:'Fantome'},
        RALENTI:{item:'u22',once:1,label:'Ralenti'},
        CASCADE:{item:'u23',once:1,label:'Cascade'},
        SOUFFLE:{item:'u24',once:1,label:'Second souffle'},
        RADAR:{item:'u25',once:1,label:'Radar'},
        PREMIERE:{orbs:5000,once:1,label:'+5 000'},
        COIN:{orbs:2000,once:1,label:'+2 000'},
        PORTAIL:{orbs:12000,once:1,label:'+12 000'}
      });
    }
  }catch(e){}

  function wrapStart(){
    if(typeof start!=='function'||start.__mech)return;
    var s=start;
    function ns(r){
      window._ghostUsed=false;window._secondWindUsed=false;window._cornerT=0;
      if(window.fpMode){window.fpYaw=0;window.fpPitch=0}
      return s(r);
    }
    ns.__mech=true;start=ns;window.start=ns;
  }
  wrapStart();setTimeout(wrapStart,100);setTimeout(wrapStart,500);

  function ensureFpBtn(){
    if(document.getElementById('fpBtn'))return;
    var b=document.createElement('button');
    b.id='fpBtn';b.type='button';b.textContent='1P';
    b.style.cssText='position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:18px;z-index:8;font-size:14px;padding:8px 14px;opacity:.9;pointer-events:auto';
    b.onclick=function(e){e.stopPropagation();toggleFP()};
    document.body.appendChild(b);
  }
  ensureFpBtn();setTimeout(ensureFpBtn,500);

  function hookRender(){
    try{
      if(!R||R.__fpHooked)return;
      var _r=R.render.bind(R);
      R.render=function(s,c){
        try{
          if(window.fpMode&&typeof run!=='undefined'&&run){
            var yaw=window.fpYaw||0;
            var pitch=window.fpPitch||0;
            var ex=P.position.x, ey=1.25, ez=P.position.z;
            C.position.set(ex,ey,ez);
            var dist=6;
            C.lookAt(
              ex+Math.sin(yaw)*Math.cos(pitch)*dist,
              ey+Math.sin(pitch)*dist,
              ez+Math.cos(yaw)*Math.cos(pitch)*dist
            );
            if(typeof bd!=='undefined'&&bd)bd.visible=false;
            if(typeof accM!=='undefined'&&accM)accM.visible=false;
          }else{
            if(typeof bd!=='undefined'&&bd)bd.visible=true;
            if(typeof accM!=='undefined'&&accM)accM.visible=true;
          }
        }catch(e){}
        return _r(s,c);
      };
      R.__fpHooked=true;
    }catch(e){}
  }
  hookRender();setTimeout(hookRender,200);setTimeout(hookRender,1000);

  /* movement remapped in p6 via fpRemapInput */

  setInterval(function(){
    try{
      if(typeof run==='undefined'||!run)return;
      var extra=typeof extraMagnetR==='function'?extraMagnetR():0;
      if(extra<=0)return;
      var Rmax=upMagnetR()+extra;
      for(var i=0;i<orbs.length;i++){
        var o=orbs[i],dx=P.position.x-o.position.x,dz=P.position.z-o.position.z,d=Math.hypot(dx,dz);
        if(d<Rmax&&d>.08){var pull=18*(0.5+0.5*(1-d/Rmax));o.position.x+=dx/d*pull*0.05;o.position.z+=dz/d*pull*0.05}
      }
    }catch(e){}
  },50);
  setInterval(function(){try{if(typeof run!=='undefined'&&run)tickSecrets(0.05)}catch(e){}},50);
  var prevLives=3;
  setInterval(function(){
    try{
      if(typeof lives==='number'&&typeof run!=='undefined'&&run){
        if(lives<=0&&prevLives>0){if(trySecondWind()){try{hud()}catch(e){}}}
        prevLives=lives;
      }
    }catch(e){}
  },100);
})();
