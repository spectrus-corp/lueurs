function priceOf(it){return it.p!=null?it.p:PR[it.r]}
let wallet=0,owned=[],eq={k:'k0',t:'t0',a:'a0'},bd=null,accM=null,curSkin=DEFK,curTrail=DEFT,tE=0,shownSlot=-1,shopTab='all',previewing=null;
try{wallet=+localStorage.getItem('lueursW')||0;owned=JSON.parse(localStorage.getItem('lueursO')||'[]');eq=Object.assign(eq,JSON.parse(localStorage.getItem('lueursE')||'{}'));muted=localStorage.getItem('lueursM')=='1'}catch(e){}
if(!eq.a)eq.a='a0';
let syncCode='';try{syncCode=localStorage.getItem('lueursSync')||''}catch(e){}
const SYNC_BROKERS=['wss://broker.hivemq.com:8884/mqtt','wss://broker.emqx.io:8084/mqtt','wss://test.mosquitto.org:8081/mqtt'];
function syncTopic(code){return 'lueurs/v1/sync/'+String(code).toUpperCase()}
function genSyncCode(){
  const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let b='';
  for(let i=0;i<6;i++)b+=a[Math.floor(Math.random()*a.length)];
  return 'SYNC-'+b;
}
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
  if(d.eq&&typeof d.eq==='object'){if(d.eq.k)eq.k=d.eq.k;if(d.eq.t)eq.t=d.eq.t;if(d.eq.a)eq.a=d.eq.a}
  try{if(typeof d.rankPts==='number'&&typeof rankPts==='number'){rankPts=Math.max(rankPts,d.rankPts);if(typeof saveRank==='function')saveRank();if(typeof renderRankBadge==='function')renderRankBadge()}}catch(e){}
  try{if(typeof d.best==='number'){const b=+(localStorage.getItem('lueurs')||0);if(d.best>b){localStorage.setItem('lueurs',d.best);if(typeof best==='number')best=d.best}}}catch(e){}
}
function mqttSync(handler,timeoutMs){
  timeoutMs=timeoutMs||8000;
  return new Promise((resolve,reject)=>{
    if(typeof mqtt==='undefined'){reject(new Error('mqtt'));return}
    let idx=0,done=false,client=null,timer=null;
    const finish=(ok,val)=>{
      if(done)return;done=true;
      try{if(timer)clearTimeout(timer)}catch(e){}
      try{if(client)client.end(true)}catch(e){}
      ok?resolve(val):reject(val||new Error('fail'));
    };
    const tryBroker=()=>{
      if(done)return;
      if(idx>=SYNC_BROKERS.length){finish(false,new Error('no broker'));return}
      const url=SYNC_BROKERS[idx++];
      try{
        client=mqtt.connect(url,{clientId:'lueurs_s_'+Math.random().toString(36).slice(2,10),clean:true,connectTimeout:5000,reconnectPeriod:0});
        const to=setTimeout(()=>{try{client.end(true)}catch(e){}tryBroker()},5500);
        client.on('connect',()=>{
          clearTimeout(to);
          Promise.resolve().then(()=>handler(client)).then(v=>finish(true,v)).catch(e=>{try{client.end(true)}catch(err){}tryBroker()});
        });
        client.on('error',()=>{clearTimeout(to);try{client.end(true)}catch(e){}tryBroker()});
      }catch(e){tryBroker()}
    };
    timer=setTimeout(()=>finish(false,new Error('timeout')),timeoutMs);
    tryBroker();
  });
}
function pushSyncProfile(){
  if(!syncCode)return Promise.resolve();
  const payload=JSON.stringify(Object.assign({code:syncCode},profileData()));
  return mqttSync(c=>new Promise((res,rej)=>{
    c.publish(syncTopic(syncCode),payload,{qos:1,retain:true},err=>{err?rej(err):res()});
  }),7000).catch(()=>{});
}
function save(){
  try{localStorage.setItem('lueursW',wallet);localStorage.setItem('lueursO',JSON.stringify(owned));localStorage.setItem('lueursE',JSON.stringify(eq));if(syncCode)localStorage.setItem('lueursSync',syncCode)}catch(e){}
  try{fetch('/api/wallet',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet,owned,eq})}).catch(()=>{})}catch(e){}
  if(syncCode)pushSyncProfile();
  try{updateSyncUI&&updateSyncUI()}catch(e){}
}
async function pullSync(){
  if(!syncCode)return;
  try{
    const d=await mqttSync(c=>new Promise((res,rej)=>{
      const t=syncTopic(syncCode);
      let got=false;
      c.subscribe(t,{qos:1},err=>{if(err)rej(err)});
      c.on('message',(topic,buf)=>{
        if(got||topic!==t)return;
        got=true;
        try{res(JSON.parse(buf.toString()))}catch(e){rej(e)}
      });
      setTimeout(()=>{if(!got)rej(new Error('empty'))},4500);
    }),8000);
    if(!d)return;
    applyProfile(d,true);
    try{localStorage.setItem('lueursW',wallet);localStorage.setItem('lueursO',JSON.stringify(owned));localStorage.setItem('lueursE',JSON.stringify(eq))}catch(e){}
    try{$('wl').textContent='◈ '+fmt(wallet);if($('sw'))$('sw').textContent='◈ '+fmt(wallet)+' lueurs'}catch(e){}
    try{setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}
  }catch(e){}
}
async function createSyncCode(){
  try{$('syncMsg').textContent='Génération…'}catch(e){}
  const code=genSyncCode();
  const data=Object.assign({code},profileData());
  try{
    await mqttSync(c=>new Promise((res,rej)=>{
      c.publish(syncTopic(code),JSON.stringify(data),{qos:1,retain:true},err=>{err?rej(err):res()});
    }),8000);
    syncCode=code;
    try{localStorage.setItem('lueursSync',syncCode)}catch(e){}
    try{$('syncMsg').textContent='Code : '+syncCode+' — entre-le sur l’autre appareil'}catch(e){}
    updateSyncUI();
    try{seq([523,659,784],.08,'triangle')}catch(e){}
    return syncCode;
  }catch(e){
    try{$('syncMsg').textContent='Échec réseau — réessaie'}catch(err){}
    return null;
  }
}
async function joinSyncCode(raw){
  const c=String(raw||'').toUpperCase().replace(/\s/g,'');
  let code=c.startsWith('SYNC-')?c:'SYNC-'+c.replace(/^SYNC-?/,'');
  code=code.replace(/[^A-Z0-9-]/g,'').slice(0,11);
  if(code.length<10){try{$('syncMsg').textContent='Code invalide'}catch(e){}return false}
  try{$('syncMsg').textContent='Connexion…'}catch(e){}
  try{
    const d=await mqttSync(c2=>new Promise((res,rej)=>{
      const t=syncTopic(code);
      let got=false;
      c2.subscribe(t,{qos:1},err=>{if(err)rej(err)});
      c2.on('message',(topic,buf)=>{
        if(got||topic!==t)return;
        got=true;
        try{res(JSON.parse(buf.toString()))}catch(e){rej(e)}
      });
      setTimeout(()=>{if(!got)rej(new Error('notfound'))},5000);
    }),9000);
    if(!d||typeof d!=='object'){try{$('syncMsg').textContent='Code introuvable'}catch(e){}return false}
    syncCode=code;
    try{localStorage.setItem('lueursSync',syncCode)}catch(e){}
    applyProfile(d,true);
    try{localStorage.setItem('lueursW',wallet);localStorage.setItem('lueursO',JSON.stringify(owned));localStorage.setItem('lueursE',JSON.stringify(eq))}catch(e){}
    try{setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0')}catch(e){}
    try{$('wl').textContent='◈ '+fmt(wallet);if($('sw'))$('sw').textContent='◈ '+fmt(wallet)+' lueurs'}catch(e){}
    try{$('syncMsg').textContent='Compte synchronisé · '+syncCode}catch(e){}
    updateSyncUI();
    pushSyncProfile();
    try{seq([440,554,660,880],.07,'triangle')}catch(e){}
    return true;
  }catch(e){
    try{$('syncMsg').textContent='Code introuvable ou hors ligne'}catch(err){}
    return false;
  }
}
function clearSync(){syncCode='';try{localStorage.removeItem('lueursSync')}catch(e){}try{$('syncMsg').textContent='Synchro détachée'}catch(e){}updateSyncUI()}
function updateSyncUI(){
  try{
    if($('syncOn'))$('syncOn').textContent=syncCode?('Lié : '+syncCode):'Non lié';
    if($('syncGen'))$('syncGen').textContent=syncCode?'Republier le profil':'Générer SYNC-';
  }catch(e){}
}
setInterval(()=>{if(syncCode&&!run)pullSync()},25000);

async function syncWallet(){try{const r=await fetch('/api/wallet',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();
if(typeof d.wallet==='number'&&d.wallet>wallet)wallet=d.wallet;
if(Array.isArray(d.owned)){for(const id of d.owned){if(typeof id==='string'&&!owned.includes(id))owned.push(id)}}
if(d.eq&&typeof d.eq==='object'){if(d.eq.k)eq.k=d.eq.k;if(d.eq.t)eq.t=d.eq.t;if(d.eq.a)eq.a=d.eq.a}}catch(e){}
try{if(!localStorage.getItem('lueursGrant10k')){wallet=Math.max(wallet,10000);localStorage.setItem('lueursGrant10k','1')}}catch(e){wallet=Math.max(wallet,10000)}
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

try{
  $('syncGen').onclick=()=>createSyncCode();
  $('syncJoin').onclick=()=>joinSyncCode(($('syncIn').value||'').trim());
  $('syncClr').onclick=()=>clearSync();
  $('syncIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();joinSyncCode(($('syncIn').value||'').trim())}});
}catch(e){}
