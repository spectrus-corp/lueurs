const $=id=>document.getElementById(id),A=36,cl=v=>Math.max(-A+1,Math.min(A-1,v)),rnd=()=>(Math.random()*2-1)*(A-3),esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&','<':'<','>':'>'}[c]));
const fmt=n=>Math.floor(n).toLocaleString('fr-FR');
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));document.body.prepend(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(0x14102a);S.fog=new THREE.Fog(0x14102a,25,75);
const C=new THREE.PerspectiveCamera(50,1,.1,120);C.position.set(0,16,13);
const L=new THREE.DirectionalLight(0xfff0d0,1.1);L.position.set(8,18,6);S.add(L,new THREE.AmbientLight(0x6a5cff,.55));
const floor=new THREE.Mesh(new THREE.PlaneGeometry(A*2,A*2,1,1),new THREE.MeshStandardMaterial({color:0x1a1638,roughness:.9,metalness:.1}));floor.rotation.x=-Math.PI/2;S.add(floor);
const grid=new THREE.GridHelper(A*2,36,0x2e2860,0x221c48);grid.position.y=.02;S.add(grid);
function resize(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const mk=(c,e,i=1)=>new THREE.MeshStandardMaterial({color:c,emissive:e,emissiveIntensity:i,roughness:.35,metalness:.25});
const pc=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.85,depthWrite:false});
const og=new THREE.SphereGeometry(.45,12,10),pg=new THREE.SphereGeometry(.16,6,5);
const om={g:mk(0xfff2b0,0xffb830),s:mk(0xc8f6ff,0x2ab8e8),f:mk(0xe6d0ff,0x9a4dff),m:mk(0xffc4f0,0xff3fc4),b:mk(0xffa040,0xff4a00),j:mk(0xffe48a,0xffb830)};
const RG=new THREE.RingGeometry(.6,1,24);
const hg=new THREE.OctahedronGeometry(.95),hm=mk(0x5a0f2a,0xff2a55,.7),tg=new THREE.TetrahedronGeometry(1.05);
const P=new THREE.Group();S.add(P);const vel=new THREE.Vector3();
let bd=null,sh=null;
sh=new THREE.Mesh(new THREE.SphereGeometry(1.35,16,12),new THREE.MeshBasicMaterial({color:0x6be3ff,transparent:true,opacity:.22,depthWrite:false}));sh.visible=false;P.add(sh);
let run=false,paused=false,score=0,best=0,got=0,wave=1,lives=3,combo=1,lastT=0,inv=0,shield=0,freeze=0,magnet=0,flash=0,bt=0,tk=0,heart=0,greenT=14,grn=null,worldBest=0;
const orbs=[],haz=[],bits=[],trl=[];
try{best=+localStorage.getItem('lueurs')||0}catch(e){}
let ac=null,muted=false;
try{muted=localStorage.getItem('lueursM')=='1'}catch(e){}
function beep(f,d=.1,ty='sine',w=0){if(muted)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+w;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.01)}catch(e){}}
function noise(vol=.1,freq=1000,d=.05,w=0){if(muted)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const n=2*ac.sampleRate|0,buf=ac.createBuffer(1,n,ac.sampleRate),data=buf.getChannelData(0);for(let i=0;i<n;i++)data[i]=Math.random()*2-1;const s=ac.createBufferSource();s.buffer=buf;const fl=ac.createBiquadFilter();fl.type='bandpass';fl.frequency.value=freq;const gn=ac.createGain(),t=ac.currentTime+w;gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(gn);gn.connect(ac.destination);s.start(t)}catch(e){}}
function seq(notes,step=.08,ty='triangle',w0=0){notes.forEach((f,i)=>beep(f,step*1.6,ty,w0+i*step))}
