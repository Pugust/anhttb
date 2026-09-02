const Lockpicking=(()=>{let stage,pick,cyl,status,count,attempts,angle,sweet,forcing,opened,broken,forceSince,lastSound;let picks=1,tries=0;const TAU=Math.PI*2;
const norm=a=>{while(a<=-Math.PI)a+=TAU;while(a>Math.PI)a-=TAU;return a};const diff=(a,b)=>Math.abs(norm(a-b));
function pa(e){let r=stage.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))}
function rd(e){let r=stage.getBoundingClientRect();return Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))/(r.width/2)}
function setA(a){angle=norm(a);pick.style.transform=`rotate(${angle}rad)`}
function reset(){broken=opened=forcing=false;forceSince=0;angle=0;sweet=Math.random()*TAU-Math.PI;pick.classList.remove("shake","forcing");stage.classList.remove("tension","opened");cyl.style.transform="translate(-50%,-50%)";status.textContent="Encontre a posição correta.";setA(0)}
function brk(){if(broken||opened)return;broken=true;forcing=false;pick.classList.add("shake");AudioManager.play("break");AudioManager.vibrate([35,25,70]);status.textContent="LOCKPICK QUEBROU";picks++;count.textContent=picks;setTimeout(()=>{pick.classList.remove("shake");reset()},850)}
function force(e){if(!forcing||opened||broken)return;let d=diff(angle,sweet),r=rd(e),f=Math.max(0,Math.min(1,(r-.18)/.62)),near=Math.max(0,1-d/Math.PI);let turn=f*(.08+1.25*near);cyl.style.transform=`translate(-50%,-50%) rotate(${turn}rad)`;stage.classList.toggle("tension",f>.1);
if(f<.08){forceSince=0;status.textContent="Posição encontrada? Agora force o tambor.";return}
if(d<.13){status.textContent="A fechadura está cedendo...";if(!forceSince)forceSince=performance.now();if(performance.now()-forceSince>700){open();return}}
else if(d<.38){forceSince=0;status.textContent="Resistência moderada — ajuste a posição.";if(f>.5)pick.classList.add("shake");else pick.classList.remove("shake")}
else if(d<.72){forceSince=0;status.textContent="Muita resistência — ajuste o lockpick.";if(f>.32)pick.classList.add("shake");else pick.classList.remove("shake")}
else{status.textContent="RESISTÊNCIA CRÍTICA";if(f>.18){if(!forceSince)forceSince=performance.now();if(performance.now()-forceSince>180)brk();}}
if(f>.18&&performance.now()-lastSound>450){AudioManager.play("tension");lastSound=performance.now()}}
function open(){opened=true;forcing=false;pick.classList.remove("shake","forcing");stage.classList.add("opened");status.textContent="LOCK ABERTO";AudioManager.play("open");setTimeout(()=>document.dispatchEvent(new CustomEvent("lockOpened")),1100)}
function down(e){if(opened||broken)return;tries++;attempts.textContent=tries;AudioManager.play("pickInsert");setA(pa(e));forcing=true;forceSince=0;lastSound=performance.now();pick.classList.add("forcing");pick.setPointerCapture?.(e.pointerId);force(e)}
function move(e){if(opened||broken)return;setA(pa(e));if(forcing)force(e)}
function up(){forcing=false;forceSince=0;pick.classList.remove("forcing","shake");stage.classList.remove("tension");if(!opened)cyl.style.transform="translate(-50%,-50%)"}
function init(){stage=document.querySelector("#lock-stage");pick=document.querySelector("#lockpick");cyl=document.querySelector("#lock-cylinder");status=document.querySelector("#lock-status");count=document.querySelector("#pick-count");attempts=document.querySelector("#attempt-count");stage.onpointerdown=down;stage.onpointermove=move;stage.onpointerup=up;stage.onpointercancel=up;reset()}return{init}})();