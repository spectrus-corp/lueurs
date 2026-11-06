/* Lueurs haptic — vibrate ONLY on explicit game events (orbs etc.), never block UI */
(function(){
  'use strict';
  var ua=navigator.userAgent||'';
  var isIOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var grantUntil=0, lastPulse=0, flip=false;
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
      /* ALWAYS none — must never steal menu clicks */
      lab.style.cssText='position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;margin:0;padding:0;opacity:0;pointer-events:none!important;z-index:-1;';
      inp.style.cssText='width:1px;height:1px;margin:0;opacity:0;pointer-events:none!important;';
      (document.body||document.documentElement).appendChild(lab);
      ready=true;
    }catch(e){}
  }

  function flipSwitch(){
    if(!inp||!lab)return;
    flip=!flip;
    try{
      inp.checked=!inp.checked;
      lab.click();
    }catch(e){}
  }

  function arm(){
    grantUntil=performance.now()+1400;
    mk();
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
      o.frequency.value=48;
      var t0=ctx.currentTime;
      var dur=Math.min(0.06,Math.max(0.018,(ms||30)/1200));
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.exponentialRampToValueAtTime(0.18,t0+0.006);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
      o.connect(g);g.connect(ctx.destination);
      o.start(t0);o.stop(t0+dur+0.015);
    }catch(e){}
  }

  /* ONLY called from game events (shake/buzz), never from touchmove */
  function haptic(ms){
    ms=ms|0;
    if(ms<8)ms=12;
    var now=performance.now();
    if(now-lastPulse<40)return;
    lastPulse=now;
    androidVibrate(ms);
    mk();
    if(isIOS){
      if(now<grantUntil){
        flipSwitch();
        if(ms>40)setTimeout(flipSwitch,28);
        if(ms>70)setTimeout(flipSwitch,56);
      }
    }
    audioThump(ms);
  }

  /* Track gesture grant only — never touch pointer-events or overlay position */
  var opts={capture:true,passive:true};
  function onGesture(){arm()}
  addEventListener('touchstart',onGesture,opts);
  addEventListener('touchend',onGesture,opts);
  addEventListener('pointerdown',onGesture,opts);

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

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',mk);
  }else{mk();}
})();
