/* ---- Stats + Code cadeau + Admin gifts ---- */
(function(){
const GIFT_BROKERS=['wss://broker.hivemq.com:8884/mqtt','wss://broker.emqx.io:8084/mqtt','wss://test.mosquitto.org:8081/mqtt'];
function giftTopic(code){return 'lueurs/v1/gift/'+String(code).toUpperCase()}
function genGiftCode(){
  const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let b='';
  for(let i=0;i<6;i++)b+=a[Math.floor(Math.random()*a.length)];
  return 'GIFT-'+b;
}
let giftCode='';
try{giftCode=localStorage.getItem('lueursGift')||''}catch(e){}
if(!giftCode||!/^GIFT-[A-Z0-9]{6}$/.test(giftCode)){
  giftCode=genGiftCode();
  try{localStorage.setItem('lueursGift',giftCode)}catch(e){}
}
let claimedGifts=[];
try{claimedGifts=JSON.parse(localStorage.getItem('lueursClaimed')||'[]')}catch(e){}
function saveClaimed(){try{localStorage.setItem('lueursClaimed',JSON.stringify(claimedGifts))}catch(e){}}

let gamesPlayed=0,totalGot=0;
try{gamesPlayed=+localStorage.getItem('lueursGames')||0;totalGot=+localStorage.getItem('lueursTotalGot')||0}catch(e){}
function saveLife(){try{localStorage.setItem('lueursGames',gamesPlayed);localStorage.setItem('lueursTotalGot',totalGot)}catch(e){}}

try{
  const _end=end;
  end=function(){
    try{
      gamesPlayed++;
      if(typeof got==='number')totalGot+=got;
      saveLife();
    }catch(e){}
    return _end.apply(this,arguments);
  };
}catch(e){}

async function publishAllBrokers(topic,payload){
  const body=typeof payload==='string'?payload:JSON.stringify(payload);
  const results=[];
  for(const url of GIFT_BROKERS){
    try{
      await new Promise((res,rej)=>{
        const c=mqtt.connect(url,{clientId:'lueurs_gp_'+Math.random().toString(36).slice(2,10),clean:true,connectTimeout:5000,reconnectPeriod:0});
        const t=setTimeout(()=>{try{c.end(true)}catch(e){};rej(new Error('t'))},6000);
        c.on('connect',()=>{
          c.publish(topic,body,{qos:1,retain:true},err=>{
            clearTimeout(t);try{c.end(true)}catch(e){};
            err?rej(err):res();
          });
        });
        c.on('error',e=>{clearTimeout(t);try{c.end(true)}catch(x){};rej(e)});
      });
      results.push(url+' ok');
    }catch(e){results.push(url+' fail')}
  }
  return results;
}

async function readGiftBag(code){
  const topic=giftTopic(code);
  for(const url of GIFT_BROKERS){
    try{
      const data=await new Promise((resolve,reject)=>{
        const c=mqtt.connect(url,{clientId:'lueurs_gr_'+Math.random().toString(36).slice(2,10),clean:true,connectTimeout:4500,reconnectPeriod:0});
        let got=false;
        const done=(v)=>{if(got)return;got=true;try{c.end(true)}catch(e){};resolve(v)};
        const fail=(e)=>{if(got)return;got=true;try{c.end(true)}catch(x){};reject(e)};
        const t=setTimeout(()=>fail(new Error('empty')),4000);
        c.on('connect',()=>{
          c.subscribe(topic,{qos:1},()=>{});
          c.on('message',(tp,buf)=>{
            if(tp!==topic)return;
            clearTimeout(t);
            try{done(JSON.parse(buf.toString()))}catch(e){done(null)}
          });
        });
        c.on('error',e=>{clearTimeout(t);fail(e)});
      });
      if(data&&typeof data==='object')return data;
    }catch(e){}
  }
  return null;
}

function grantItemSafe(id){
  if(!id||owned.includes(id))return false;
  try{
    if(typeof grantItem==='function')return grantItem(id);
  }catch(e){}
  try{
    const it=typeof CAT!=='undefined'?CAT.find(x=>x.id===id):null;
    if(!it||it.secret)return false;
    owned.push(id);
    if(it.t!=='u'){
      try{if(typeof equip==='function')equip(id)}catch(e){
        eq[it.t]=id;
        if(it.t==='k'&&typeof setSkin==='function')setSkin(id);
        else if(it.t==='t')curTrail=it;
        else if(it.t==='a'&&typeof setAcc==='function')setAcc(id);
      }
    }
    return true;
  }catch(e){return false}
}

async function claimGifts(){
  try{$('giftMsg').textContent='Recherche…';$('giftMsg').style.color='var(--c)'}catch(e){}
  try{
    const bag=await readGiftBag(giftCode);
    if(!bag||!Array.isArray(bag.gifts)||!bag.gifts.length){
      try{$('giftMsg').textContent='Aucun cadeau en attente';$('giftMsg').style.color='var(--c)'}catch(e){}
      return;
    }
    const parts=[];
    let changed=false;
    for(const g of bag.gifts){
      const id=String(g.id||g.ts||Math.random());
      if(claimedGifts.includes(id))continue;
      if(typeof g.orbs==='number'&&g.orbs>0){wallet+=g.orbs;parts.push('+'+fmt(g.orbs)+' orbs')}
      if(g.item){if(grantItemSafe(g.item)){const it=typeof find==='function'?find(g.item):null;parts.push(it?it.n:g.item)}else parts.push('item déjà possédé')}
      if(Array.isArray(g.items)){for(const it of g.items){if(grantItemSafe(it))parts.push(it)}}
      claimedGifts.push(id);changed=true;
    }
    if(changed){
      saveClaimed();
      try{save()}catch(e){}
      try{$('wl').textContent='◈ '+fmt(wallet);if($('sw'))$('sw').textContent='◈ '+fmt(wallet)+' lueurs'}catch(e){}
      renderStats();
      const label=parts.length?parts.join(' · '):'Cadeau reçu';
      try{$('giftMsg').textContent=label;$('giftMsg').style.color='var(--g)'}catch(e){}
      try{seq([523,659,784,1047],.08,'triangle');noise(.1,4000,.05)}catch(e){}
    }else{
      try{$('giftMsg').textContent='Déjà récupéré';$('giftMsg').style.color='var(--c)'}catch(e){}
    }
  }catch(e){
    try{$('giftMsg').textContent='Réseau indisponible, réessaie';$('giftMsg').style.color='var(--r)'}catch(err){}
  }
}

async function adminSendGift(){
  const key=(($('adKey')&&$('adKey').value)||'').trim();
  if(key!=='lueurs-admin'){
    try{$('adminMsg').textContent='Code admin requis / incorrect';$('adminMsg').style.color='var(--r)'}catch(e){}
    try{beep(180,.12,'sawtooth')}catch(e){}
    return;
  }
  const code=(($('adCode').value||'').trim().toUpperCase().replace(/\s+/g,''));
  const orbs=Math.max(0,Math.floor(+$('adOrbs').value||0));
  const item=(($('adItem').value||'').trim().toLowerCase());
  const label=(($('adLabel').value||'').trim())||'Cadeau admin';
  if(!/^GIFT-[A-Z0-9]{6}$/.test(code)){
    try{$('adminMsg').textContent='Code GIFT- invalide';$('adminMsg').style.color='var(--r)'}catch(e){}
    return;
  }
  if(orbs<=0&&!item){
    try{$('adminMsg').textContent='Indique des orbs ou un item';$('adminMsg').style.color='var(--r)'}catch(e){}
    return;
  }
  try{$('adminMsg').textContent='Envoi…';$('adminMsg').style.color='var(--c)'}catch(e){}
  try{
    let bag=await readGiftBag(code);
    if(!bag||typeof bag!=='object')bag={code,gifts:[]};
    if(!Array.isArray(bag.gifts))bag.gifts=[];
    const gift={id:'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),orbs,item:item||undefined,label,ts:Date.now()};
    bag.gifts.push(gift);
    bag.updated=Date.now();
    const res=await publishAllBrokers(giftTopic(code),bag);
    const ok=res.some(x=>x.endsWith('ok'));
    try{$('adminMsg').textContent=ok?('Envoyé à '+code+(orbs?' · +'+fmt(orbs):'')+(item?' · '+item:'')):'Échec réseau';$('adminMsg').style.color=ok?'var(--g)':'var(--r)'}catch(e){}
    if(ok){try{seq([440,554,660],.07,'triangle')}catch(e){}}
  }catch(e){
    try{$('adminMsg').textContent='Échec : '+(e&&e.message||'erreur');$('adminMsg').style.color='var(--r)'}catch(err){}
  }
}

function renderStats(){
  try{
    $('stWallet').textContent=fmt(wallet);
    $('stBest').textContent=fmt(typeof best==='number'?best:(+localStorage.getItem('lueurs')||0));
    const rk=typeof rankOf==='function'?rankOf(typeof rankPts==='number'?rankPts:0):{n:'—'};
    $('stRank').textContent=rk.n||'—';
    $('stRankPts').textContent=fmt(typeof rankPts==='number'?rankPts:0);
    $('stOwned').textContent=String((owned||[]).length);
    $('stGames').textContent=fmt(gamesPlayed);
    $('stTotal').textContent=fmt(totalGot);
    let lv=1,xp=0;
    try{xp=+localStorage.getItem('lueursX')||0;lv=Math.floor(Math.sqrt(xp/150))+1}catch(e){}
    $('stLvl').textContent=lv+' · '+fmt(xp)+' XP';
    $('giftCode').textContent=giftCode;
  }catch(e){}
}

function openStats(){
  try{$('msg').hidden=true}catch(e){}
  try{$('shop').hidden=true}catch(e){}
  try{$('mp').hidden=true}catch(e){}
  $('stats').hidden=false;
  renderStats();
  claimGifts();
  try{seq([500,700],.06)}catch(e){}
}
function closeStats(){
  $('stats').hidden=true;
  try{if(!run)$('msg').hidden=false}catch(e){}
  try{seq([700,500],.06)}catch(e){}
}

try{
  $('bst').onclick=()=>openStats();
  $('statsBack').onclick=()=>closeStats();
  $('giftCopy').onclick=()=>{
    try{
      navigator.clipboard.writeText(giftCode);
      $('giftMsg').textContent='Code copié !';
      $('giftMsg').style.color='var(--g)';
    }catch(e){
      try{$('giftMsg').textContent=giftCode}catch(err){}
    }
  };
  $('giftCheck').onclick=()=>claimGifts();
  $('adSend').onclick=()=>adminSendGift();
  let taps=0;
  $('adminHint').onclick=()=>{
    taps++;
    if(taps>=5){
      taps=0;
      const p=prompt('Mot de passe admin');
      if(p==='lueurs-admin'){
        $('adminBox').hidden=false;
        try{$('adminMsg').textContent='Mode admin activé — entre le code pour envoyer';$('adminMsg').style.color='var(--g)'}catch(e){}
      }else if(p!=null){
        try{$('adminMsg').textContent='Refusé'}catch(e){}
      }
    }
  };
}catch(e){}

setTimeout(()=>{try{claimGifts()}catch(e){}},2500);
setInterval(()=>{try{if(!run)claimGifts().catch(()=>{})}catch(e){}},60000);

window.renderStats=renderStats;
window.claimGifts=claimGifts;
window.giftCode=()=>giftCode;
window.adminSendGift=adminSendGift;
})();
