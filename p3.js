function sw(it){if(it.rb||it.id=='t10'||it.id=='t11')return 'conic-gradient(#f55,#fd5,#5f5,#5df,#85f,#f5d,#f55)';if(it.id=='t0'||it.id=='a0')return '#3a2f6e';if(it.t=='u')return 'linear-gradient(135deg,#ffe29a,#6be3ff)';if(it.t=='a')return `radial-gradient(circle at 35% 30%,#fff9,${hx(it.c||0xffd36b)} 50%,${hx(it.e||0x553300)})`;return it.t=='k'?`radial-gradient(circle at 35% 30%,#fff9,${hx(it.c)} 45%,${hx(it.e)})`:`linear-gradient(90deg,${(it.c||[0xffd36b]).map(hx).join(',')})`}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function stock(slot){const r=rng(slot*7919+13),out=[];
for(const ty of['k','t']){const pool=CAT.filter(i=>i.t==ty&&!i.secret);for(let n=0;n<2;n++){if(!pool.length)break;const tot=pool.reduce((s,i)=>s+RW[i.r],0);let x=r()*tot,ch=pool[0];for(const i of pool){x-=RW[i.r];if(x<=0){ch=i;break}}out.push(ch);pool.splice(pool.indexOf(ch),1)}}
for(const ty of['a','u']){const pool=CAT.filter(i=>i.t==ty&&!i.secret&&!owned.includes(i.id));for(let n=0;n<2;n++){if(!pool.length)break;out.push(pool.splice(Math.floor(r()*pool.length),1)[0])}}
return out}
function stockFiltered(slot){const all=stock(slot);return shopTab=='all'?all:all.filter(i=>i.t==shopTab)}
function renderShop(){const slot=Math.floor(Date.now()/6e5);shownSlot=slot;$('sw').textContent='◈ '+fmt(wallet)+' lueurs';
$('stabs').innerHTML=[['all','Tout'],['k','Skins'],['t','Traînées'],['a','Accessoires'],['u','Améliorations']].map(([id,lb])=>`<button data-tab='${id}' class='${shopTab==id?'on':''}'>${lb}</button>`).join('');
const list=stockFiltered(slot);
$('sg').innerHTML=list.length?list.map(it=>{const own=owned.includes(it.id),pr=priceOf(it),canPrev=it.t=='k'||it.t=='t'||it.t=='a';
return `<div class='cd' style='--rc:${RC[it.r]}'><i class='sw' style='background:${sw(it)}'></i><b>${it.n}</b><span class='rr'>${RN[it.r]} · ${TN[it.t]}</span>${it.desc?`<span class='tag'>${it.desc}</span>`:''}${own?`<em>Possédé</em>`:`<button data-b='${it.id}' ${wallet<pr?'disabled':''}>${fmt(pr)} ◈</button>`}${canPrev?`<button class='pv' data-p='${it.id}'>Aperçu</button>`:''}</div>`}).join(''):`<p style='opacity:.7'>Rien dans cet onglet pour ce cycle</p>`;
const col=[DEFK,DEFT,DEFA,...CAT.filter(i=>owned.includes(i.id))];
$('sc').innerHTML=col.map(it=>{const isU=it.t=='u',on=!isU&&eq[it.t]==it.id;
return `<div class='cd' style='--rc:${RC[it.r]}'><i class='sw' style='background:${sw(it)}'></i><b>${it.n}${it.secret?' ✦':''}</b><span class='rr'>${TN[it.t]}</span>${it.desc?`<span class='tag'>${it.desc}</span>`:''}${isU?`<em>Actif</em>`:`<button data-e='${it.id}' ${on?'disabled':''}>${on?'Équipé':'Équiper'}</button>`}${!isU&&(it.t=='k'||it.t=='t'||it.t=='a')?`<button class='pv' data-p='${it.id}'>Aperçu</button>`:''}</div>`}).join('')}
function preview(id){const it=find(id);if(!it||it.t=='u')return;previewing=id;
if(it.t=='k'){setSkin(id);setAcc(eq.a||'a0')}
else if(it.t=='t')curTrail=it;
else if(it.t=='a')setAcc(id);
$('prev').textContent='Aperçu : '+it.n+' — fermez pour annuler, ou équipez pour garder';beep(620,.06,'sine')}
function endPreview(){if(!previewing)return;previewing=null;
try{const e=JSON.parse(localStorage.getItem('lueursE')||'{}');eq.k=e.k||eq.k;eq.t=e.t||eq.t;eq.a=e.a||'a0'}catch(e){}
setSkin(eq.k);curTrail=find(eq.t);setAcc(eq.a||'a0');$('prev').textContent='Touchez « Aperçu » pour voir sur votre personnage'}
