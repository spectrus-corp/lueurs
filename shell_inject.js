/* inject missing UI nodes if index was truncated */
(function(){
  function need(id){return !document.getElementById(id)}
  var shop=document.getElementById('shop');
  if(shop && !document.getElementById('shopPanel')){
    shop.innerHTML="<div id='shopPanel'><div id='shopHead'><h1>Boutique</h1><div id='sinfo'><span id='sw'></span><span id='st'></span></div></div><div id='stabs'></div><div id='shopSec'>Offre du moment</div><div id='sg'></div><h2>Améliorations progressives</h2><div id='su'></div><h2>Ma collection</h2><div id='sc'></div><div id='codeBox'><label for='cdIn'>Code bonus</label><input id='cdIn' maxlength='24' placeholder='Entrez un code' autocomplete='off' spellcheck='false'><button type='button' id='cdGo'>Valider</button><div id='cdMsg'></div></div><div id='syncBox'><label>Synchronisation de compte</label><div id='syncOn'>Non lié</div><button type='button' id='syncGen'>Générer SYNC-</button><button type='button' id='syncClr'>Détacher</button><input id='syncIn' maxlength='16' placeholder='SYNC-XXXXXX'><button type='button' id='syncJoin'>Lier cet appareil</button><div id='syncMsg'></div></div><button id='sx'>Retour</button></div>";
  }
  if(need('stats')){
    var d=document.createElement('div');d.id='stats';d.hidden=true;
    d.innerHTML="<div id='statsPanel'><h1>Stats</h1><div id='statsGrid'></div><div id='giftBox'><h2>Code cadeau</h2><div id='giftCode'></div><div id='giftRow'><button type='button' id='giftNew'>Nouveau</button><button type='button' id='giftCopy'>Copier</button></div><input id='giftIn' placeholder='Code reçu'><button type='button' id='giftClaim'>Récupérer</button><div id='giftMsg'></div></div><div id='adminBox'><h2>Admin</h2><input id='adKey' placeholder='Code admin'><select id='adType'><option value='orbs'>Orbs</option><option value='skin'>Skin</option></select><input id='adVal' placeholder='Valeur'><input id='adGift' placeholder='Code cadeau cible'><button type='button' id='adSend'>Envoyer</button><div id='adminMsg'></div></div><button id='statsBack' type='button'>Retour</button></div>";
    document.body.appendChild(d);
  }
  if(need('spinOverlay')){
    var s=document.createElement('div');s.id='spinOverlay';s.hidden=true;
    s.innerHTML="<h2 id='spinTitle'>Roue du jour</h2><div id='spinWrap'><div id='spinPin'></div><canvas id='spinWheel' width='300' height='300'></canvas></div><div id='spinResult'></div><div id='spinHint'>1 tour gratuit par jour</div><button id='spinClose' type='button'>Fermer</button>";
    document.body.appendChild(s);
  }
  if(need('mp')){
    var m=document.createElement('div');m.id='mp';m.hidden=true;
    m.innerHTML="<h2>Multijoueur</h2><p>Choisis un mode, crée un salon et envoie le code à ton pote.</p><div id='mpModes'><button type='button' id='mpModeCoop' class='on'>Collecte</button><button type='button' id='mpModeBattle'>Battle</button></div><p id='mpModeDesc'></p><button id='mpNew'>Nouvelle session</button><div id='mpCodeBox' hidden></div><div id='mpJoinRow'><input id='mpIn' maxlength='8' placeholder='CODE'><button id='mpJoin'>Rejoindre</button></div><div id='mpStatus'></div><button id='mpPlay' hidden type='button'>Lancer la partie</button><button id='mpLeave' hidden>Quitter la session</button><button id='mpBack'>Retour</button>";
    document.body.appendChild(m);
  }
  if(need('board')){
    var b=document.createElement('div');b.id='board';
    b.innerHTML="<h2>Records</h2><ol id='bl'><li class='e'>Chargement…</li></ol>";
    var home=document.getElementById('msgHome');
    if(home) home.appendChild(b);
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
    var btn=document.createElement('button');btn.id='chatBtn';btn.type='button';btn.textContent='💬';
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
  if(!document.getElementById('orbCss')){
    var st=document.createElement('style');st.id='orbCss';
    st.textContent=".fl2.pts{font-size:clamp(24px,6vw,40px);color:#ffd36b;text-shadow:0 0 14px #ffd36baa,0 2px 10px #000;font-weight:700}.orbFly{position:fixed;width:22px;height:22px;margin-left:-11px;margin-top:-11px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff9e6,#ffd36b 42%,#ff9a1a 92%);box-shadow:0 0 16px #ffd36bcc,0 0 32px #ff9a1a66;pointer-events:none;z-index:25;transition:transform .58s cubic-bezier(.12,.82,.22,1),opacity .52s ease;opacity:1}#wl{transition:transform .2s ease,color .2s ease;display:inline-block}#wl.pulse{animation:wlPulse .38s ease}@keyframes wlPulse{0%{transform:scale(1)}35%{transform:scale(1.28);color:#ffd36b}100%{transform:scale(1)}}";
    document.head.appendChild(st);
  }
})();
