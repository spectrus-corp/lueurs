function priceOf(it){return it.p!=null?it.p:PR[it.r]}
let wallet=0,owned=[],eq={k:'k0',t:'t0',a:'a0'},bd=null,accM=null,curSkin=DEFK,curTrail=DEFT,tE=0,shownSlot=-1,shopTab='all',previewing=null;
try{wallet=+localStorage.getItem('lueursW')||0;owned=JSON.parse(localStorage.getItem('lueursO')||'[]');eq=Object.assign(eq,JSON.parse(localStorage.getItem('lueursE')||'{}'));muted=localStorage.getItem('lueursM')=='1'}catch(e){}
if(!eq.a)eq.a='a0';
let syncCode='';try{syncCode=localStorage.getItem('lueursSync')||''}catch(e){}
function profileData(){
  const d={wallet,owned,eq,updated:Date.now()};
  try{if(typeof rankPts==='number')d.rankPts=rankPts}catch(e){}
  try{d.best=+(localStorage.getItem('lueurs')||0)}catch(e){}
  return d;
}
function applyProfile(d,forceEq){
  if(!d)return;
  if(typeof d.wallet==='number')wallet=Math.max(wallet,d.wallet);
  if(Array.isArray(d.owned)){for(const id of d.owned){if(typeof id==='string'&&!owned.includes(id))owned.push(id)}}
  if(d.eq&&typeof d.eq==='object'&&(forceEq||true)){if(d.eq.k)eq.k=d.eq.k;if(d.eq.t)eq.t=d.eq.t;if(d.eq.a)eq.a=d.eq.a}
  try{if(typeof d.rankPts==='number'&&typeof rankPts==='number'){rankPts=Math.max(rankPts,d.rankPts);saveRank&&saveRank();renderRankBadge&&renderRankBadge()}}catch(e){}
  try{if(typeof d.best==='number'){const b=+(localStorage.getItem('lueurs')||0);if(d.best>b){localStorage.setItem('lueurs',d.best);if(typeof best==='number')best=d.best}}}catch(e){}
}
function save(){
  try{localStorage.setItem('lueursW',wallet);localStorage.setItem('lueursO',JSON.stringify(owned));localStorage.setItem('lueursE',JSON.stringify(eq));if(syncCode)localStorage.setItem('lueursSync',syncCode)}catch(e){}
  try{fetch('/api/wallet',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet,owned,eq})}).catch(()=>{})}catch(e){}
  if(syncCode){try{fetch('/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({action:'put',code:syncCode},profileData()))}).catch(()=>{})}catch(e){}}
  try{updateSyncUI&&updateSyncUI()}catch(e){}
}
async function pullSync(){
  if(!syncCode)return;
  try{
    const r=await fetch('/api/sync?code='+encodeURIComponent(syncCode),{cache:'no-store'});
    if(!r.ok)return;
    const d=await r.json();
    applyProfile(d,true);
    try{localStorage.setItem('lueursW',wallet);localStorage.setItem('lueursO',JSON.stringify(owned));localStorage.setItem('lueursE',JSON.stringify(eq))}catch(e){}
    try{$('wl').textContent='◈ '+fmt(wallet);if($('sw'))$('sw').textContent='◈ '+fmt(wallet)+' lueurs'}catch(e){}
    try{setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}
  }catch(e){}
}
async function createSyncCode(){
  try{
    const r=await fetch('/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({action:'create'},profileData()))});
    if(!r.ok)throw 0;
    const d=await r.json();
    syncCode=d.code;try{localStorage.setItem('lueursSync',syncCode)}catch(e){}
    applyProfile(d,true);save();
    try{$('syncMsg').textContent='Code : '+syncCode+' — entre-le sur l’autre appareil'}catch(e){}
    updateSyncUI();seq([523,659,784],.08,'triangle');
    return syncCode;
  }catch(e){try{$('syncMsg').textContent='Impossible de créer le code'}catch(err){}return null}
}
async function joinSyncCode(raw){
  const c=String(raw||'').toUpperCase().replace(/\s/g,'');
  const code=c.startsWith('SYNC-')?c:'SYNC-'+c.replace(/^SYNC-?/,'');
  try{
    const r=await fetch('/api/sync?code='+encodeURIComponent(code),{cache:'no-store'});
    if(!r.ok){try{$('syncMsg').textContent='Code introuvable'}catch(e){}return false}
    const d=await r.json();
    syncCode=code;try{localStorage.setItem('lueursSync',syncCode)}catch(e){}
    applyProfile(d,true);save();
    try{setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}
    try{$('syncMsg').textContent='Compte synchronisé · '+syncCode}catch(e){}
    updateSyncUI();seq([440,554,660,880],.07,'triangle');
    return true;
  }catch(e){try{$('syncMsg').textContent='Erreur de synchro'}catch(err){}return false}
}
function clearSync(){syncCode='';try{localStorage.removeItem('lueursSync')}catch(e){}try{$('syncMsg').textContent='Synchro détachée'}catch(e){}updateSyncUI()}
function updateSyncUI(){
  try{
    const on=!!$('syncOn');if(on)$('syncOn').textContent=syncCode?('Lié : '+syncCode):'Non lié';
    if($('syncGen'))$('syncGen').textContent=syncCode?'Mettre à jour le code':'Générer SYNC-';
  }catch(e){}
}
setInterval(()=>{if(syncCode&&!run)pullSync()},20000);
async function syncWallet(){try{const r=await fetch('/api/wallet',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();
if(typeof d.wallet==='number'&&d.wallet>wallet)wallet=d.wallet;
if(Array.isArray(d.owned)){for(const id of d.owned){if(typeof id==='string'&&!owned.includes(id))owned.push(id)}}
if(d.eq&&typeof d.eq==='object'){if(d.eq.k)eq.k=d.eq.k;if(d.eq.t)eq.t=d.eq.t;if(d.eq.a)eq.a=d.eq.a}}catch(e){}
try{if(!localStorage.getItem('lueursGrant10k')){wallet=Math.max(wallet,10000);localStorage.setItem('lueursGrant10k','1')}catch(e){wallet=Math.max(wallet,10000)}
save();try{$('wl').textContent='◈ '+fmt(wallet)}catch(e){}
try{setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}}
syncWallet().then(()=>pullSync());updateSyncUI();
function hasU(id){return owned.includes(id)}
function upMagnetR(){return 16+(hasU('u1')?3:0)+(hasU('u9')?3:0)}
function upMagnetSp(){return 58+(hasU('u1')?12:0)+(hasU('u9')?14:0)}
function upStaminaMax(){return hasU('u8')?1.35:hasU('u2')?1.15:1}
function upSprintDrain(){return hasU('u8')?0.22:hasU('u2')?0.28:0.34}
function upSprintMul(){return hasU('u3')?1.65:1.55}
function upSpeed(){return hasU('u3')?1.05:1}
function upComboWin(){return hasU('u10')?2.35:hasU('u4')?2.0:1.6}
function upShieldMul(){return hasU('u5')?1.15:1}
function upFreezeMul(){return hasU('u6')?1.15:1}
