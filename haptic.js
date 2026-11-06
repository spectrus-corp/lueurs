/* Aggressive iOS Safari haptic engine for Lueurs — switch + drag + grant */
(function(){
  'use strict';
  var ua=navigator.userAgent||'';
  var isIOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var isAndroid=/Android/i.test(ua);
  var grantUntil=0, lastPulse=0, pending=0, touching=false, tx=0, ty=0, flip=false;
  var lab=null, inp=null, ready=false;

  function mk(){
    if(ready)return;
    try{
      lab=document.createElement('label');
      inp=document.createElement('input');
      inp.type='checkbox';
      try{inp.switch=true;}catch(e){}
      inp.setAttribute('switch','');
      lab.appendChild(inp);
      lab.setAttribute('aria-hidden','true');
      lab.style.cssText='position:fixed;left:-200px;top:-200px;width:88px;height:56px;margin:0;padding:0;opacity:0.02;z-index:2147483647;-webkit-tap-highlight-color:transparent;touch-action:none;pointer-events:none;transform-origin:center center;';
      inp.style.cssText='width:88px;height:56px;margin:0;opacity:0.02;pointer-events:auto;';
      (document.body||document.documentElement).appendChild(lab);
      ready=true;
    }catch(e){}
  }

  function place(x,y){
    if(!lab)return;
    lab.style.left=(x-44)+'px';
    lab.style.top=(y-28)+'px';
  }

  function flipSwitch(){
    if(!inp||!lab)return;
    flip=!flip;
    try{
      lab.style.direction=flip?'rtl':'ltr';
      lab.style.transform=flip?'scaleX(-1) rotate(0.01deg)':'scaleX(1)';
      inp.checked=!inp.checked;
      lab.click();
    }catch(e){}
  }

  function arm(e){
    grantUntil=performance.now()+1300;
    touching=true;
    if(e){
      var t=(e.touches&&e.touches[0])||(e.changedTouches&&e.changedTouches[0])||e;
      if(t&&t.clientX!=null){tx=t.clientX;ty=t.clientY;place(tx,ty);}
    }
    mk();
    if(lab)lab.style.pointerEvents='auto';
    flipSwitch();
    if(pending>0){pending=0;flipSwitch();}
  }

  function onMove(e){
    var t=(e.touches&&e.touches[0])||e;
    if(t&&t.clientX!=null){tx=t.clientX;ty=t.clientY;}
    touching=true;
    mk();
    place(tx,ty);
    if(lab)lab.style.pointerEvents='auto';
    if(pending>0 || performance.now()<grantUntil){
      var now=performance.now();
      if(now-lastPulse>32){
        lastPulse=now;
        if(pending>0)pending--;
        flipSwitch();
      }
    }
  }

  function onEnd(){
    touching=false;
    if(lab)lab.style.pointerEvents='none';
  }

  function androidVibrate(ms){
    try{
      if(typeof navigator.vibrate==='function')navigator.vibrate(ms|0);
    }catch(e){}
  }

  function audioThump(ms){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      if(!window.__hCtx)window.__hCtx=new AC();
      var ctx=window.__hCtx;
      if(ctx.state==='suspended')ctx.resume();
      var o=ctx.createOscillator();
      var g=ctx.createGain();
      o.type='sine';
      o.frequency.value=45;
      var t0=ctx.currentTime;
      var dur=Math.min(0.08, Math.max(0.02,(ms||30)/1000));
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.exponentialRampToValueAtTime(0.22,t0+0.008);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
      o.connect(g);g.connect(ctx.destination);
      o.start(t0);o.stop(t0+dur+0.02);
    }catch(e){}
  }

  function haptic(ms){
    ms=ms|0;
    if(ms<8)ms=12;
    androidVibrate(ms);
    mk();
    pending=Math.min(8, pending+Math.max(1, Math.floor(ms/25)));
    if(touching){
      place(tx,ty);
      flipSwitch();
      pending=Math.max(0,pending-1);
    } else if(performance.now()<grantUntil){
      flipSwitch();
      pending=Math.max(0,pending-1);
    }
    audioThump(ms);
  }

  var opts={capture:true,passive:true};
  addEventListener('touchstart',arm,opts);
  addEventListener('touchmove',onMove,opts);
  addEventListener('touchend',onEnd,opts);
  addEventListener('touchcancel',onEnd,opts);
  addEventListener('pointerdown',arm,opts);
  addEventListener('pointermove',onMove,opts);
  addEventListener('pointerup',onEnd,opts);
  addEventListener('pointercancel',onEnd,opts);

  if(isIOS){
    try{
      navigator.vibrate=function(pattern){
        var ms=12;
        if(typeof pattern==='number')ms=pattern;
        else if(pattern&&pattern.length)ms=pattern[0]||12;
        haptic(ms);
        return true;
      };
    }catch(e){}
  }

  window.__haptic=haptic;
  window.__hapticArm=arm;
  window.__hapticIsIOS=isIOS;
  window.__hapticIsAndroid=isAndroid;

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',mk);
  }else{mk();}
})();
