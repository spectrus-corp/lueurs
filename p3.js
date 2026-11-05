function hx(c){return '#'+Number(c).toString(16).padStart(6,'0')}
function iconHTML(it){
  if(it.t=='u'){
    const sym={u1:'🧲',u2:'⚡',u3:'💨',u4:'⏱️',u5:'🛡️',u6:'❄️',u7:'✨',u8:'💨',u9:'🧲',u10:'⏱️',u11:'💰'}[it.id]||'▲';
    return '<span style="font-size:36px;line-height:1">'+sym+'</span>';
  }
  if(it.t=='a'){
    const c=hx(it.c||0xffd36b),e=hx(it.e||it.c||0xffd36b);
    if(it.g=='halo')return '<svg viewBox="0 0 64 64"><ellipse cx="32" cy="18" rx="18" ry="6" fill="none" stroke="'+c+'" stroke-width="4"/><ellipse cx="32" cy="18" rx="12" ry="3" fill="'+e+'" opacity=".5"/></svg>';
    if(it.g=='ring')return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="none" stroke="'+c+'" stroke-width="5"/><circle cx="32" cy="32" r="12" fill="none" stroke="'+e+'" stroke-width="2" opacity=".6"/></svg>';
    if(it.g=='crown')return '<svg viewBox="0 0 64 64"><path d="M10 40 L16 18 L26 32 L32 14 L38 32 L48 18 L54 40 Z" fill="'+c+'" stroke="'+e+'" stroke-width="2"/><rect x="10" y="40" width="44" height="8" rx="2" fill="'+e+'"/></svg>';
    if(it.g=='orb')return '<svg viewBox="0 0 64 64"><circle cx="44" cy="24" r="10" fill="'+c+'"/><circle cx="40" cy="20" r="3" fill="#fff" opacity=".5"/><circle cx="32" cy="36" r="14" fill="none" stroke="'+e+'" stroke-width="2" stroke-dasharray="4 3" opacity=".5"/></svg>';
    if(it.g=='aura')return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="'+c+'" opacity=".25"/><circle cx="32" cy="32" r="14" fill="'+c+'" opacity=".35"/><circle cx="32" cy="32" r="6" fill="'+e+'"/></svg>';
    if(it.g=='fins')return '<svg viewBox="0 0 64 64"><path d="M8 40 L22 20 L28 36 Z" fill="'+c+'"/><path d="M56 40 L42 20 L36 36 Z" fill="'+c+'"/><circle cx="32" cy="34" r="8" fill="'+e+'" opacity=".7"/></svg>';
    if(it.g=='sat')return '<svg viewBox="0 0 64 64"><rect x="38" y="14" width="14" height="14" rx="2" fill="'+c+'" transform="rotate(20 45 21)"/><circle cx="32" cy="36" r="10" fill="none" stroke="'+e+'" stroke-width="2" stroke-dasharray="3 2"/><circle cx="32" cy="36" r="4" fill="'+e+'" opacity=".5"/></svg>';
    return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="8" fill="#3a2f6e"/></svg>';
  }
  if(it.t=='t'){
    const cols=(it.c&&it.c.length)?it.c:[0x3a2f6e];
    const st=it.style||'dots';
    let parts='';
    if(st==='fluid'){
      const c0=hx(cols[0]),c1=hx(cols[Math.min(1,cols.length-1)]);
      parts='<path d="M12 48 Q20 20 32 28 Q44 36 52 12" fill="none" stroke="'+c0+'" stroke-width="10" stroke-linecap="round" opacity=".9"/>';
      parts+='<path d="M12 48 Q20 20 32 28 Q44 36 52 12" fill="none" stroke="'+c1+'" stroke-width="5" stroke-linecap="round" opacity=".7"/>';
      parts+='<circle cx="52" cy="12" r="5" fill="'+c0+'"/>';
    }else if(st==='streak'){
      for(let i=0;i<4;i++){
        const col=hx(cols[i%cols.length]);
        const y=18+i*10;
        parts+='<rect x="'+(14+i*2)+'" y="'+y+'" width="'+(30-i*4)+'" height="4" rx="2" fill="'+col+'" opacity="'+(0.9-i*0.15)+'"/>';
      }
    }else{
      for(let i=0;i<5;i++){
        const col=hx(cols[i%cols.length]);
        const y=12+i*8,w=28+i*4,x=32-w/2,op=(.35+i*.12).toFixed(2);
        parts+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="5" rx="2.5" fill="'+col+'" opacity="'+op+'"/>';
      }
    }
    if(it.up&&it.up>0) parts+='<path d="M32 8 L36 16 L28 16 Z" fill="'+hx(cols[0])+'" opacity=".8"/>';
    return '<svg viewBox="0 0 64 64">'+parts+'</svg>';
  }
  const c=hx(it.c||0xffd36b),e=hx(it.e||0x553300);
  let defs='', fill=c;
  if(it.rb){
    defs='<defs><linearGradient id="rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff5a7a"/><stop offset="25%" stop-color="#ffd36b"/><stop offset="50%" stop-color="#4dff8f"/><stop offset="75%" stop-color="#6be3ff"/><stop offset="100%" stop-color="#c58bff"/></linearGradient></defs>';
    fill='url(#rb)';
  }
  if(it.g=='cone') return '<svg viewBox="0 0 64 64">'+defs+'<polygon points="32,8 54,54 10,54" fill="'+fill+'" stroke="'+e+'" stroke-width="2"/><ellipse cx="32" cy="52" rx="18" ry="4" fill="'+e+'" opacity=".35"/></svg>';
  if(it.g=='cyl') return '<svg viewBox="0 0 64 64">'+defs+'<rect x="18" y="14" width="28" height="36" rx="10" fill="'+fill+'" stroke="'+e+'" stroke-width="2"/><ellipse cx="32" cy="14" rx="14" ry="5" fill="'+e+'" opacity=".5"/></svg>';
  if(it.g=='oct') return '<svg viewBox="0 0 64 64">'+defs+'<polygon points="32,6 54,24 54,40 32,58 10,40 10,24" fill="'+fill+'" stroke="'+e+'" stroke-width="2"/></svg>';
  if(it.g=='tet') return '<svg viewBox="0 0 64 64">'+defs+'<polygon points="32,8 56,52 8,52" fill="'+fill+'" stroke="'+e+'" stroke-width="2"/><line x1="32" y1="8" x2="32" y2="52" stroke="'+e+'" stroke-width="1.5" opacity=".5"/></svg>';
  if(it.g=='ico') return '<svg viewBox="0 0 64 64">'+defs+'<polygon points="32,6 50,18 50,38 32,58 14,38 14,18" fill="'+fill+'" stroke="'+e+'" stroke-width="2"/><polygon points="32,6 40,28 24,28" fill="'+e+'" opacity=".25"/></svg>';
  if(it.g=='dod') return '<svg viewBox="0 0 64 64">'+defs+'<circle cx="32" cy="32" r="22" fill="'+fill+'" stroke="'+e+'" stroke-width="2"/><polygon points="32,14 42,20 42,32 32,38 22,32 22,20" fill="'+e+'" opacity=".3"/></svg>';
  if(it.g=='knot') return '<svg viewBox="0 0 64 64">'+defs+'<path d="M20 32 C20 16,44 16,44 32 C44 48,20 48,20 32" fill="none" stroke="'+fill+'" stroke-width="7" stroke-linecap="round"/><path d="M32 18 C48 18,48 46,32 46 C16 46,16 18,32 18" fill="none" stroke="'+e+'" stroke-width="3.5" opacity=".7"/></svg>';
  return '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="18" fill="'+c+'"/></svg>';
}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function stock(slot){const r=rng(slot*7919+13),out=[];
for(const ty of['k','t']){const pool=CAT.filter(i=>i.t==ty&&!i.secret);for(let n=0;n<3;n++){if(!pool.length)break;const tot=pool.reduce((s,i)=>s+RW[i.r],0);let x=r()*tot,ch=pool[0];for(const i of pool){x-=RW[i.r];if(x<=0){ch=i;break}}out.push(ch);pool.splice(pool.indexOf(ch),1)}}
for(const ty of['a','u']){const pool=CAT.filter(i=>i.t==ty&&!i.secret&&!owned.includes(i.id));for(let n=0;n<2;n++){if(!pool.length)break;out.push(pool.splice(Math.floor(r()*pool.length),1)[0])}}
return out}
function stockFiltered(slot){const all=stock(slot);return shopTab=='all'?all:all.filter(i=>i.t==shopTab)}
function cardHTML(it,mode){
  const own=owned.includes(it.id),pr=priceOf(it),isU=it.t=='u';
  const on=!isU&&eq[it.t]==it.id;
  let act='';
  if(mode=='shop'){
    act=own?'<em>Possédé</em>':'<button data-b="'+it.id+'" '+(wallet<pr?'disabled':'')+'>'+fmt(pr)+' ◈</button>';
  }else{
    act=isU?'<em>Actif</em>':'<button data-e="'+it.id+'" '+(on?'disabled':'')+'>'+(on?'Équipé':'Équiper')+'</button>';
  }
  const styleTag=it.t=='t'&&it.style?' · '+(it.style==='fluid'?'Fluide':it.style==='streak'?'Traits':'Points'):'';
  return '<div class="cd" style="--rc:'+RC[it.r]+'"><div class="ic">'+iconHTML(it)+'</div><b>'+it.n+(it.secret?' ✦':'')+'</b><span class="rr">'+RN[it.r]+' · '+TN[it.t]+styleTag+'</span>'+(it.desc?'<span class="tag">'+it.desc+'</span>':'')+act+'</div>';
}
function renderShop(){const slot=Math.floor(Date.now()/6e5);shownSlot=slot;$('sw').textContent='◈ '+fmt(wallet)+' lueurs';
$('stabs').innerHTML=[['all','Tout'],['k','Skins'],['t','Traînées'],['a','Accessoires'],['u','Améliorations']].map(([id,lb])=>'<button data-tab="'+id+'" class="'+(shopTab==id?'on':'')+'">'+lb+'</button>').join('');
const list=stockFiltered(slot);
$('sg').innerHTML=list.length?list.map(it=>cardHTML(it,'shop')).join(''):'<p style="opacity:.7;grid-column:1/-1">Rien dans cet onglet pour ce cycle</p>';
const col=[DEFK,DEFT,DEFA,...CAT.filter(i=>owned.includes(i.id))];
$('sc').innerHTML=col.map(it=>cardHTML(it,'col')).join('')}
