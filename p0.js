
const $=id=>document.getElementById(id),A=36,cl=v=>Math.max(-A+1,Math.min(A-1,v)),rnd=()=>(Math.random()*2-1)*(A-3),esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&','<':'<','>':'>'}[c]));
const fmt=n=>Math.floor(n).toLocaleString('fr-FR');
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));document.body.prepend(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0x14102a);S.fog=new THREE.Fog(0x14102a,25,75);
const C=new THREE.PerspectiveCamera(60,1,.1,250);
function rs(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}addEventListener('resize',rs);rs();
S.add(new THREE.HemisphereLight(0xb9a8ff,0x2a1840,1));
const sun=new THREE.DirectionalLight(0xffc98a,.9);sun.position.set(10,20,5);S.add(sun);
const g=new THREE.Mesh(new THREE.PlaneGeometry(A*2,A*2),new THREE.MeshStandardMaterial({color:0x1f1840}));g.rotation.x=-Math.PI/2;S.add(g);
const gr=new THREE.GridHelper(A*2,24,0x6a5acd,0x3a2f6e);gr.position.y=.01;S.add(gr);
const bm=new THREE.MeshStandardMaterial({color:0x6a5acd,emissive:0x4a3acd});
[[0,-A,A*2,.5],[0,A,A*2,.5],[-A,0,.5,A*2],[A,0,.5,A*2]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.6,d),bm);m.position.set(x,.3,z);S.add(m)});
const sp=[];for(let i=0;i<500;i++){const a=Math.random()*6.28,e=Math.random()*1.3+.15,r=120;sp.push(Math.cos(a)*Math.cos(e)*r,Math.sin(e)*r,Math.sin(a)*Math.cos(e)*r)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xfff2d0,size:.9,fog:false})));
const P=new THREE.Group();
const pl=new THREE.PointLight(0xffd36b,1.2,14);pl.position.y=2;P.add(pl);
const sh=new THREE.Mesh(new THREE.SphereGeometry(1.7,16,12),new THREE.MeshBasicMaterial({color:0x6be3ff,transparent:true,opacity:.25}));sh.position.y=.8;sh.visible=false;P.add(sh);S.add(P);
const og=new THREE.IcosahedronGeometry(.55,1),mk=(c,e,i=1.3)=>new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:i});
const om={g:mk(0xfff2b0,0xffb830),s:mk(0xc8f6ff,0x2ab8e8),f:mk(0xe6d0ff,0x9a4dff),m:mk(0xffc4f0,0xff3fc4)};
const hg=new THREE.OctahedronGeometry(.95),hm=mk(0x5a0f2a,0xff2a55,.7),tg=new THREE.TetrahedronGeometry(1.15),tm=mk(0x4a1a00,0xff7a1a,.9),ng=new THREE.IcosahedronGeometry(.95,1),nm=mk(0xc8ffd8,0x1fe86a,1.1);
const pg=new THREE.SphereGeometry(.12,6,6),pc=c=>new THREE.MeshBasicMaterial({color:c}),pm={g:pc(0xffd36b),s:pc(0x6be3ff),f:pc(0xc58bff),m:pc(0xff7ad9),r:pc(0xff4d6d),n:pc(0x4dff8f)};
const orbs=[],haz=[],bits=[],trl=[],tcache=new Map();let grn=null;
/* ---- Sons (SFX synthétisés) ---- */
let ac,muted=false;
function beep(f,d=.1,ty='sine',w=0){if(muted)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),v=ac.createGain(),s=ac.currentTime+w;o.type=ty;o.frequency.value=f;v.gain.setValueAtTime(.07,s);v.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(v);v.connect(ac.destination);o.start(s);o.stop(s+d)}catch(e){}}
function noise(d=.15,f=1200,v=.08,w=0){if(muted)return;try{ac=ac||new AudioContext();const n=Math.floor(ac.sampleRate*d),b=ac.createBuffer(1,n,ac.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),gn=ac.createGain(),t=ac.currentTime+w;s.buffer=b;fl.type='bandpass';fl.frequency.value=f;gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(gn);gn.connect(ac.destination);s.start(t)}catch(e){}}
function seq(notes,step=.08,ty='triangle',w0=0){notes.forEach((f,i)=>beep(f,step*1.6,ty,w0+i*step))}
