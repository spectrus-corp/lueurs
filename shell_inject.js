/* inject missing UI nodes if index was truncated */
(function(){
  function need(id){return !document.getElementById(id)}
  function fill(id, html){
    var el=document.getElementById(id);
    if(!el){el=document.createElement('div');el.id=id;el.hidden=true;document.body.appendChild(el)}
    if(!el.innerHTML || el.innerHTML.trim()==='' || (id==='mp'&&!document.getElementById('mpNew')) || (id==='shop'&&!document.getElementById('shopPanel')) || (id==='stats'&&!document.getElementById('statsPanel')) || (id==='spinOverlay'&&!document.getElementById('spinWheel'))){
      el.innerHTML=html;
    }
    return el;
  }

  fill('shop', "<div id='shopPanel'><div id='shopHead'><h1>Boutique</h1><div id='sinfo'><span id='sw'></span><span id='st'></span></div></div><div id='stabs'></div><div id='shopSec'>Offre du moment</div><div id='sg'></div><h2>Améliorations progressives</h2><div id='su'></div><h2>Ma collection</h2><div id='sc'></div><div id='codeBox'><label for='cdIn'>Code bonus</label><input id='cdIn' maxlength='24' placeholder='Entrez un code' autocomplete='off' spellcheck='false'><button type='button' id='cdGo'>Valider</button><div id='cdMsg'></div></div><div id='syncBox'><label>Synchronisation de compte</label><div id='syncOn'>Non lié</div><button type='button' id='syncGen'>Générer SYNC-</button><button type='button' id='syncClr'>Détacher</button><input id='syncIn' maxlength='16' placeholder='SYNC-XXXXXX'><button type='button' id='syncJoin'>Lier cet appareil</button><div id='syncMsg'></div></div><button type='button' id='sx'>Retour</button></div>");

  fill('stats', "<div id='statsPanel'><h1>Stats</h1><div id='statsGrid'></div><div id='giftBox'><h2>Code cadeau</h2><div id='giftCode'></div><div id='giftRow'><button type='button' id='giftNew'>Nouveau</button><button type='button' id='giftCopy'>Copier</button></div><input id='giftIn' placeholder='Code reçu'><button type='button' id='giftClaim'>Récupérer</button><div id='giftMsg'></div></div><div id='adminBox'><h2>Admin</h2><input id='adKey' placeholder='Code admin'><select id='adType'><option value='orbs'>Orbs</option><option value='skin'>Skin</option></select><input id='adVal' placeholder='Valeur'><input id='adGift' placeholder='Code cadeau cible'><button type='button' id='adSend'>Envoyer</button><div id='adminMsg'></div></div><button id='statsBack' type='button'>Retour</button></div>");

  fill('spinOverlay', "<h2 id='spinTitle'>Roue du jour</h2><div id='spinWrap'><div id='spinPin'></div><canvas id='spinWheel' width='300' height='300'></canvas></div><div id='spinResult'></div><div id='spinHint'>1 tour gratuit par jour</div><button id='spinClose' type='button'>Fermer</button>");

  fill('mp', "<h2>Multijoueur</h2><p style='opacity:.85;max-width:36ch;margin:0'>Choisis un mode, crée un salon et envoie le code à ton pote.</p><div id='mpModes' style='display:flex;gap:8px;flex-wrap:wrap;justify-content:center'><button type='button' id='mpModeCoop' class='on'>Collecte</button><button type='button' id='mpModeBattle'>Battle</button></div><p id='mpModeDesc' style='opacity:.75;max-width:36ch;margin:0;font-size:13px;line-height:1.4'>Collecte commune : score d'\u00e9quipe, vies partagées, objectif à atteindre ensemble.</p><button type='button' id='mpNew'>Nouvelle session</button><div id='mpCodeBox' hidden></div><div id='mpJoinRow' style='display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center'><input id='mpIn' maxlength='8' placeholder='CODE' autocomplete='off' spellcheck='false'><button type='button' id='mpJoin'>Rejoindre</button></div><div id='mpStatus'></div><button id='mpPlay' hidden type='button'>Lancer la partie</button><button id='mpLeave' hidden type='button'>Quitter la session</button><button type='button' id='mpBack'>Retour</button>");

  if(need('mpHud')){
    var h=document.createElement('div');h.id='mpHud';h.hidden=true;
    h.style.cssText='position:fixed;top:calc(48px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:6;padding:6px 14px;border-radius:999px;background:#120e24e6;border:1px solid #ffffff22;font-size:13px;pointer-events:none;white-space:nowrap;max-width:92vw';
    document.body.appendChild(h);
  }

  if(need('board')){
    var b=document.createElement('div');b.id='board';
    b.innerHTML="<h2>Records</h2><ol id='bl'><li class='e'>Chargement…</li></ol>";
    var home=document.getElementById('msgHome');
    if(home) home.appendChild(b); else document.body.appendChild(b);
  }
  if(need('rankBadge')){
    var r=document.createElement('div');r.id='rankBadge';
    r.innerHTML="<div class='rs' id='rankSvg'></div><div class='rtxt'><div class='rn' id='rankName'>Débutant</div><div class='rp' id='rankPts'></div></div>";
    var t=document.getElementById('t');
    if(t&&t.parentNode) t.parentNode.insertBefore(r, t.nextSibling);
  }
  if(need('chat')){
    var c=document.createElement('div');c.id='chat';c.hidden=true;
    c.innerHTML="<div id='chatHead'><b id='chatCode'></b><span id='chatPeer'></span><button type='button' id='chatX'>×</button></div><div id='chatLog'></div><form id='chatForm'><input id='chatIn' maxlength='120' autocomplete='off'><button type='submit'>OK</button></form>";
    document.body.appendChild(c);
  }
  if(need('chatBtn')){
    var btn=document.createElement('button');btn.id='chatBtn';btn.type='button';btn.textContent='💬';btn.hidden=true;
    document.body.appendChild(btn);
  }
  if(need('bsp')){
    var sec=document.getElementById('menuSec');
    if(sec){
      var sp=document.createElement('button');sp.id='bsp';sp.type='button';sp.textContent='🎡 Roue du jour';
      var st=document.createElement('button');st.id='bst';st.type='button';st.textContent='Stats';
      sec.appendChild(sp);sec.appendChild(st);
    }
  }
  if(need('go')){
    var go=document.createElement('div');go.id='go';go.hidden=true;
    go.innerHTML="<input id='nm' maxlength='12' placeholder='Votre pseudo' autocomplete='off'><button id='sb' type='button'>Envoyer mon score</button>";
    var home=document.getElementById('msgHome');
    if(home) home.appendChild(go);
  }
  if(need('mb')){
    var mb=document.createElement('button');mb.id='mb';mb.type='button';mb.textContent='🔊';
    mb.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:10;padding:6px 16px;font-size:20px;background:#14102acc';
    document.body.appendChild(mb);
  }
  if(!document.getElementById('orbCss')){
    var st=document.createElement('style');st.id='orbCss';
    st.textContent=".fl2.pts{font-size:clamp(24px,6vw,40px);color:#ffd36b;text-shadow:0 0 14px #ffd36baa,0 2px 10px #000;font-weight:700}.orbFly{position:fixed;width:22px;height:22px;margin-left:-11px;margin-top:-11px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff9e6,#ffd36b 42%,#ff9a1a 92%);box-shadow:0 0 16px #ffd36bcc,0 0 32px #ff9a1a66;pointer-events:none;z-index:25;transition:transform .58s cubic-bezier(.12,.82,.22,1),opacity .52s ease;opacity:1}#wl{transition:transform .2s ease,color .2s ease;display:inline-block}#wl.pulse{animation:wlPulse .38s ease}@keyframes wlPulse{0%{transform:scale(1)}35%{transform:scale(1.28);color:#ffd36b}100%{transform:scale(1)}}#mpModes button.on{opacity:1;background:var(--g,#ffd36b);color:var(--bg,#14102a);border-color:var(--g,#ffd36b)}#mpModeBattle.on{background:#f43f5e;border-color:#f43f5e;color:#fff}#mpPlay{border-color:#7dffb0;color:#7dffb0}#mpCodeBox{font-size:28px;letter-spacing:.2em;color:var(--g,#ffd36b);padding:12px 20px;border:2px dashed var(--g,#ffd36b);border-radius:12px;background:#ffffff0a}";
    document.head.appendChild(st);
  }
})();
