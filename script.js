const intro=document.querySelector("#intro"),experience=document.querySelector("#experience"),start=document.querySelector("#start"),pages=[...document.querySelectorAll(".page")],dots=[...document.querySelectorAll(".dot")],prev=document.querySelector("#prev"),next=document.querySelector("#next"),pageNumber=document.querySelector("#pageNumber"),progressFill=document.querySelector("#progressFill"),song=document.querySelector("#song"),music=document.querySelector("#music"),musicText=document.querySelector("#musicText"),toast=document.querySelector("#toast");
let current=0,toastTimer,confettiPieces=[],confettiFrame=0;
song.volume=.72;

function updateMusic(){const playing=!song.paused&&!song.ended;music.classList.toggle("playing",playing);musicText.textContent=playing?"Music on":"Music off";music.setAttribute("aria-label",playing?"Pause birthday song":"Play birthday song")}
function playSong(restart=false){if(restart)try{song.currentTime=0}catch(e){}const p=song.play();if(p)p.then(updateMusic).catch(updateMusic)}
music.addEventListener("click",()=>song.paused?playSong():song.pause());
["play","playing","pause","ended","error"].forEach(event=>song.addEventListener(event,updateMusic));

start.addEventListener("click",()=>{experience.classList.add("visible");experience.setAttribute("aria-hidden","false");intro.classList.add("hidden");playSong(true);setTimeout(()=>burst(240),300)});
function showPage(index){const target=Math.max(0,Math.min(index,pages.length-1));if(target===current)return;pages[current].classList.remove("active");pages[current].classList.toggle("exit",target>current);pages.forEach((p,i)=>{if(i!==current)p.classList.remove("exit")});pages[target].classList.add("active");current=target;dots.forEach((d,i)=>d.classList.toggle("active",i===current));pageNumber.textContent=String(current+1).padStart(2,"0");progressFill.style.width=`${(current+1)/pages.length*100}%`;prev.disabled=current===0;next.disabled=current===pages.length-1;pages[current].scrollTop=0;if(current===5)setTimeout(()=>{burst(120);fireworks(7)},350)}
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(Number(b.dataset.go))));
document.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>showPage(current+1)));
prev.addEventListener("click",()=>showPage(current-1));next.addEventListener("click",()=>showPage(current+1));
document.addEventListener("keydown",e=>{if(!experience.classList.contains("visible"))return;if(e.key==="ArrowRight")showPage(current+1);if(e.key==="ArrowLeft")showPage(current-1)});

let touchX=0;document.addEventListener("touchstart",e=>touchX=e.changedTouches[0].screenX,{passive:true});document.addEventListener("touchend",e=>{const delta=e.changedTouches[0].screenX-touchX;if(Math.abs(delta)>65)showPage(current+(delta<0?1:-1))},{passive:true});
document.querySelector("#burst").addEventListener("click",()=>{burst(260);showToast("Happy Birthday, Bushra! ✨")});
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}

const words=["joy.","peace.","barakah.","success.","laughter.","magic."];let wordIndex=0;setInterval(()=>{const el=document.querySelector("#typedWord");el.style.opacity=0;setTimeout(()=>{wordIndex=(wordIndex+1)%words.length;el.textContent=words[wordIndex];el.style.opacity=1},220)},2200);
document.querySelectorAll(".choc").forEach(choc=>choc.addEventListener("click",()=>{const text=document.querySelector("#wishText");text.style.opacity=0;setTimeout(()=>{text.textContent=choc.dataset.wish;text.style.opacity=1;burst(35)},180)}));

const cake=document.querySelector("#cake"),finalMessage=document.querySelector("#finalMessage");cake.addEventListener("click",()=>{if(cake.classList.contains("blown"))return;cake.classList.add("blown");finalMessage.classList.add("show");burst(340);fireworks(12)});
document.querySelector("#replay").addEventListener("click",()=>{cake.classList.remove("blown");finalMessage.classList.remove("show");showPage(0);burst(100)});
document.querySelector("#fullscreen").addEventListener("click",async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch(e){showToast("Fullscreen is unavailable here.")}});

const confetti=document.querySelector("#confetti"),ctx=confetti.getContext("2d"),colors=["#ff79ad","#ffd166","#a88cff","#7ee3cf","#fff"];
function resize(){const r=Math.min(devicePixelRatio||1,2);confetti.width=innerWidth*r;confetti.height=innerHeight*r;confetti.style.width=`${innerWidth}px`;confetti.style.height=`${innerHeight}px`;ctx.setTransform(r,0,0,r,0,0);resizeStars()}
function burst(amount=150){for(let i=0;i<amount;i++)confettiPieces.push({x:Math.random()*innerWidth,y:-20-Math.random()*100,w:6+Math.random()*7,h:9+Math.random()*10,c:colors[Math.floor(Math.random()*colors.length)],s:2.5+Math.random()*5,d:-1+Math.random()*2,r:Math.random()*6,rs:-.1+Math.random()*.2});if(!confettiFrame)animateConfetti()}
function animateConfetti(){ctx.clearRect(0,0,innerWidth,innerHeight);confettiPieces.forEach(p=>{p.y+=p.s;p.x+=p.d+Math.sin(p.y*.015);p.r+=p.rs;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()});confettiPieces=confettiPieces.filter(p=>p.y<innerHeight+40);if(confettiPieces.length)confettiFrame=requestAnimationFrame(animateConfetti);else{confettiFrame=0;ctx.clearRect(0,0,innerWidth,innerHeight)}}
function fireworks(count){const field=document.querySelector("#fireworks");for(let j=0;j<count;j++)setTimeout(()=>{const x=innerWidth*(.15+Math.random()*.7),y=innerHeight*(.18+Math.random()*.4),color=colors[Math.floor(Math.random()*4)];for(let i=0;i<28;i++){const p=document.createElement("i");p.className="particle";p.style.left=`${x}px`;p.style.top=`${y}px`;p.style.background=color;p.style.boxShadow=`0 0 10px ${color}`;const a=Math.PI*2*i/28,d=45+Math.random()*100;p.animate([{transform:"translate(0,0)",opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(0)`,opacity:0}],{duration:800+Math.random()*500,easing:"ease-out"});field.appendChild(p);setTimeout(()=>p.remove(),1400)}},j*170)}

const starsCanvas=document.querySelector("#stars"),sctx=starsCanvas.getContext("2d");let stars=[];
function resizeStars(){const r=Math.min(devicePixelRatio||1,2);starsCanvas.width=innerWidth*r;starsCanvas.height=innerHeight*r;starsCanvas.style.width=`${innerWidth}px`;starsCanvas.style.height=`${innerHeight}px`;sctx.setTransform(r,0,0,r,0,0);stars=Array.from({length:Math.floor(innerWidth/8)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.2+Math.random()*1.3,a:.2+Math.random()*.7,s:.002+Math.random()*.006}))}
function animateStars(){sctx.clearRect(0,0,innerWidth,innerHeight);stars.forEach(s=>{s.a+=s.s;if(s.a>.95||s.a<.15)s.s*=-1;sctx.beginPath();sctx.fillStyle=`rgba(255,255,255,${s.a})`;sctx.arc(s.x,s.y,s.r,0,Math.PI*2);sctx.fill()});requestAnimationFrame(animateStars)}
window.addEventListener("resize",resize);resize();animateStars();prev.disabled=true;updateMusic();
