/* Mechanics: FP, secrets, upgrades */
(function(){
  window.fpMode=false;
  window._ghostUsed=false;
  window._secondWindUsed=false;
  window._cornerT=0;
  try{window._secretFound=JSON.parse(localStorage.getItem('lueursSecrets')||'{}')}catch(e){window._secretFound={}}
  function markSecret(id){try{window._secretFound[id]=1;localStorage.setItem('lueursSecrets',JSON.stringify(window._secretFound))}catch(e){}}
  function hasSecret(id){return !!window._secretFound[id]}
  var _gain=typeof gain==='function'?gain:null;
  if(_gain){window.gain=gain=function(n){var m=n;try{if(hasU('u20'))m*=2}catch(e){}try{if(hasU('u23')&&Math.random()<0.25)m+=1}catch(e){}return _gain(m)}};
  window.toggleFP=function(){window.fpMode=!window.fpMode;try{banner(window.fpMode?'1re personne':'3e personne')}catch(e){}try{seq([440,660],.06,'triangle')}catch(e){}try{var b=$('fpBtn');if(b)b.textContent=window.fpMode?'3P':'1P'}catch(e){}};
  window.extraMagnetR=function(){try{return hasU('u25')?6:0}catch(e){return 0}};
  window.enemySlow=function(){try{return (hasU('u22')&&sprinting)?0.55:1}catch(e){return 1}};
  window.tryGhostHit=function(){try{if(hasU('u21')&&!window._ghostUsed){window._ghostUsed=true;inv=2.8;banner('Fantome !');seq([300,500,700],.07,'sine');return true}}catch(e){}return false};
  window.trySecondWind=function(){try{if(hasU('u24')&&!window._secondWindUsed){window._secondWindUsed=true;lives=1;inv=2;banner('Second souffle !');seq([523,659,784],.08,'triangle');return true}}catch(e){}return false};
  var taps=[],tapT=0;
  addEventListener('pointerdown',function(e){if(e.clientY>innerHeight*0.12)return;var now=performance.now();if(now-tapT>700)taps=[];taps.push(now);tapT=now;if(taps.length>=3){taps=[];if(typeof run!=='undefined'&&run)toggleFP()}},{passive:true});
  var lpT=null,lpTarget=null;
  addEventListener('pointerdown',function(e){var t=e.target;if(t&&(t.id==='wl'||(t.closest&&t.closest('#wl')))){lpTarget='wl';lpT=performance.now()}},{passive:true});
  addEventListener('pointerup',function(){if(lpTarget==='wl'&&lpT&&performance.now()-lpT>900){if(!hasSecret('walletHold')){markSecret('walletHold');try{wallet+=7777;save();$('wl').textContent='◈ '+fmt(wallet);banner('Secret portefeuille +7777')}catch(e){}try{seq([660,880,1100],.07,'triangle')}catch(e){}}}lpT=null;lpTarget=null});
  window.tickSecrets=function(dt){if(typeof run==='undefined'||!run){window._cornerT=0;return}var ax=Math.abs(P.position.x),az=Math.abs(P.position.z);if(ax>A-3.5&&az>A-3.5){window._cornerT+=dt;if(window._cornerT>2.5){var id='corner'+Math.round(P.position.x)+'_'+Math.round(P.position.z);if(!hasSecret(id)){markSecret(id);try{wallet+=1500;gain(5);banner('Coin secret !');seq([523,784,1047],.07,'triangle');save()}catch(e){}}window._cornerT=0}}else window._cornerT=0};
  try{if(typeof CODES==='object'){Object.assign(CODES,{SECRET:{orbs:33333,once:1,label:'Secret +33 333'},LUMIERE:{orbs:9000,item:'k10',once:1,label:'+9 000 + Spectre'},FANTOME:{item:'k11',once:1,label:'Skin Fantome'},DOUBLE:{item:'u20',once:1,label:'Double orbes'},FANTASM:{item:'u21',once:1,label:'Fantome'},RALENTI:{item:'u22',once:1,label:'Ralenti'},CASCADE:{item:'u23',once:1,label:'Cascade'},SOUFFLE:{item:'u24',once:1,label:'Second souffle'},RADAR:{item:'u25',once:1,label:'Radar'},PREMIERE:{orbs:5000,once:1,label:'+5 000 · triple-tap haut = 1P'},COIN:{orbs:2000,once:1,label:'+2 000 · coin 3s'},PORTAIL:{orbs:12000,once:1,label:'+12 000'}})}}catch(e){}
  function wrapStart(){if(typeof start!=='function'||start.__mech)return;var s=start;function ns(r){window._ghostUsed=false;window._secondWindUsed=false;window._cornerT=0;return s(r)}ns.__mech=true;start=ns;window.start=ns}
  wrapStart();setTimeout(wrapStart,100);setTimeout(wrapStart,500);
  function ensureFpBtn(){if(document.getElementById('fpBtn'))return;var b=document.createElement('button');b.id='fpBtn';b.type='button';b.textContent='1P';b.style.cssText='position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:18px;z-index:8;font-size:14px;padding:8px 14px;opacity:.9;pointer-events:auto';b.onclick=function(e){e.stopPropagation();toggleFP()};document.body.appendChild(b)}
  ensureFpBtn();setTimeout(ensureFpBtn,500);
  function hookRender(){try{if(!R||R.__fpHooked)return;var _r=R.render.bind(R);R.render=function(s,c){try{if(window.fpMode&&typeof run!=='undefined'&&run){var yaw=P.rotation.y;C.position.set(P.position.x,1.35,P.position.z);C.lookAt(P.position.x+Math.sin(yaw)*8,1.1,P.position.z+Math.cos(yaw)*8);if(typeof bd!=='undefined'&&bd)bd.visible=false}else if(typeof bd!=='undefined'&&bd)bd.visible=true}catch(e){}return _r(s,c)};R.__fpHooked=true}catch(e){}}
  hookRender();setTimeout(hookRender,200);setTimeout(hookRender,1000);
  setInterval(function(){try{if(typeof run==='undefined'||!run)return;var extra=typeof extraMagnetR==='function'?extraMagnetR():0;if(extra<=0)return;var Rmax=upMagnetR()+extra;for(var i=0;i<orbs.length;i++){var o=orbs[i],dx=P.position.x-o.position.x,dz=P.position.z-o.position.z,d=Math.hypot(dx,dz);if(d<Rmax&&d>.08){var pull=18*(0.5+0.5*(1-d/Rmax));o.position.x+=dx/d*pull*0.05;o.position.z+=dz/d*pull*0.05}}}catch(e){}},50);
  setInterval(function(){try{if(typeof run!=='undefined'&&run)tickSecrets(0.05)}catch(e){}},50);
  var prevLives=3;
  setInterval(function(){try{if(typeof lives==='number'&&typeof run!=='undefined'&&run){if(lives<=0&&prevLives>0){if(trySecondWind()){try{hud()}catch(e){}}}prevLives=lives}}catch(e){}},100);
})();
