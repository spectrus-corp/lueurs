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
alert('PARTIAL - still uploading full game');
