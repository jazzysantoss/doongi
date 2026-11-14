const PHOTOS = [
  "photos/doongi-1.jpg",
  "photos/doongi-2.jpg",
  "photos/doongi-3.jpg",
  "photos/doongi-4.jpg",
  "photos/doongi-5.jpg",
  "photos/doongi-6.jpg"
];

const TRICKS = [
  {id:'anja', ko:'앉아', name:'Anja', en:'Sit', em:'🐶', lv:1},
  {id:'sohn', ko:'손', name:'Sohn', en:'Paw', em:'🐾', lv:3},
  {id:'bang', ko:'빵', name:'Bang', en:'Play dead', em:'💥', lv:5},
];
const SNACKS = [
  {id:'kibble', ko:'사료', name:'Kibble', em:'🥣', lv:1, full:20, happy:6, xp:6},
];
const HEAD = [
  {id:'none', name:'Nothing', em:'🚫', lv:1},
  {id:'bow', name:'Bow', em:'🎀', lv:2},
  {id:'santa', name:'Santa hat', em:'🎅', lv:4},
];
const BODY = [
  {id:'none', name:'Natural fluff', em:'☁️', lv:1},
];
[...TRICKS,...SNACKS,...HEAD,...BODY].forEach(x=>x.lv=1);
const MAXLV = 6;
const need = l => 30 + l*15;

const $ = s => document.querySelector(s);
const stage = $('#stage'), dog = $('#dog'), head = $('#head');
let S;
const DEFAULT = {level:1, xp:0, full:75, happy:75, energy:85, head:'none', body:'none', asleep:false, last:Date.now()};
function load(){
  try{ const raw = localStorage.getItem('doongi-v1'); if(raw){ S = Object.assign({}, DEFAULT, JSON.parse(raw)); return true; } }catch(e){}
  S = {...DEFAULT}; return false;
}
function save(){ S.last = Date.now(); try{ localStorage.setItem('doongi-v1', JSON.stringify(S)); }catch(e){} }
const clamp = v => Math.max(0, Math.min(100, v));

/* ---------- rendering ---------- */
function barColor(v){ return v>60 ? 'linear-gradient(90deg,#3f9b4f,#6cc56f)' : v>30 ? 'linear-gradient(90deg,#ffb347,#ffcc70)' : 'linear-gradient(90deg,#ff7043,#ff8a65)'; }
function renderStats(){
  for(const k of ['full','happy','energy']){
    const v = Math.round(S[k]);
    $('#b-'+k).style.width = v+'%'; $('#b-'+k).style.background = barColor(v);
    $('#v-'+k).textContent = v;
    $('#st-'+k).classList.toggle('low', v<25);
  }
  $('#lv').textContent = S.level;
  const n = need(S.level);
  $('#xpbar').style.width = (S.level>=MAXLV?100:Math.min(100, S.xp/n*100))+'%';
  $('#xptext').textContent = S.level>=MAXLV ? 'MAX LEVEL 🏆' : `${Math.floor(S.xp)} / ${n} XP`;
  const nxt = [...TRICKS,...SNACKS,...HEAD,...BODY].filter(x=>x.lv>S.level).sort((a,b)=>a.lv-b.lv)[0];
  $('#nextUnlock').textContent = nxt ? `Next: ${nxt.em} ${nxt.ko||nxt.name} at Lv ${nxt.lv}` : '';
  dog.style.setProperty('--wag', S.asleep ? '4s' : S.happy>70 ? '.45s' : S.happy>35 ? '.9s' : '2s');
  $('#tongue').style.display = (S.happy>65 && !S.asleep) ? '' : 'none';
    $('#moodline').textContent = S.asleep ? 'is napping… 💤' : S.full<25 ? 'is hungry 🥺' : S.energy<20 ? 'is sleepy 😪' : S.happy>80 ? 'is super happy! 🧡' : S.happy<30 ? 'wants some love 🥹' : 'is chilling with you';
  stage.classList.toggle('sleeping', S.asleep);
  $('#sleepBtn').textContent = S.asleep ? '☀️ Wake up' : '💤 Nap time';
  setEyes();
}
let eyeOverride = null;
function setEyes(){
  const m = eyeOverride || (S.asleep ? 'sleep' : 'open');
  $('#eyesOpen').setAttribute('display', m==='open'?'inline':'none');
  $('#eyesHappy').setAttribute('display', m==='happy'?'inline':'none');
  $('#eyesSleep').setAttribute('display', m==='sleep'?'inline':'none');
  $('#eyesX').setAttribute('display', m==='x'?'inline':'none');
}
function renderWear(){
  document.querySelectorAll('.wear').forEach(g=>{
    const w = g.dataset.w;
    g.style.display = (w===S.head || w===S.body) ? '' : 'none';
  });
}
function card(it, extra, cls=''){
  const locked = S.level < it.lv;
  return `<button class="item ${cls} ${locked?'locked':''}" data-lv="${it.lv}" data-id="${it.id}">
    <span class="em">${it.em}</span>${it.ko?`<span class="ko">${it.ko}</span>`:''}<span class="nm">${it.name}</span>${extra?`<span class="sub">${extra}</span>`:''}</button>`;
}
function renderPanels(){
  $('#trickGrid').innerHTML = TRICKS.map(t=>card(t, t.en, 'trick star')).join('');
  $('#snackGrid').innerHTML = SNACKS.map(s=>card(s, '')).join('');
  $('#headGrid').innerHTML = HEAD.map(h=>card(h,'', S.head===h.id?'sel':'')).join('');
  $('#bodyGrid').innerHTML = BODY.map(h=>card(h,'', S.body===h.id?'sel':'')).join('');
}
function renderAll(){ renderStats(); renderWear(); renderPanels(); }

/* ---------- fx ---------- */
let bubbleT;
function say(ko, en, ms=2200){
  const b = $('#bubble');
  let txt = en || ko;
  const emo = (ko.match(/\p{Extended_Pictographic}/gu)||[]).join('');
  if(en && emo && !/\p{Extended_Pictographic}/u.test(en)) txt += ' ' + emo;
  b.innerHTML = `<span class="say">${txt}</span>`;
  b.classList.add('show'); clearTimeout(bubbleT);
  bubbleT = setTimeout(()=>b.classList.remove('show'), ms);
}
function fx(char, x, y, n=1, spread=40){
  const r = stage.getBoundingClientRect();
  for(let i=0;i<n;i++){
    const e = document.createElement('span'); e.className='fx'; e.textContent=char;
    e.style.left = (x ?? r.width/2) + (Math.random()-.5)*spread + 'px';
    e.style.top = (y ?? r.height*.45) + (Math.random()-.5)*spread*.6 + 'px';
    e.style.setProperty('--dx', (Math.random()-.5)*60+'px');
    e.style.animationDelay = i*90+'ms';
    stage.appendChild(e); setTimeout(()=>e.remove(), 1600+i*90);
  }
}
function toast(html){ const t=$('#toast'); t.innerHTML=html; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 3200); }
function confetti(){
  const cols=['#3f9b4f','#ff8a3d','#ffd24d','#6cc56f','#ffb38a','#fff'];
  for(let i=0;i<70;i++){
    const c=document.createElement('i'); c.className='confetti';
    c.style.left=Math.random()*100+'vw'; c.style.background=cols[i%cols.length];
    c.style.animationDuration=(1.8+Math.random()*1.8)+'s'; c.style.animationDelay=Math.random()*.5+'s';
    c.style.borderRadius = Math.random()>.5?'50%':'2px';
    document.body.appendChild(c); setTimeout(()=>c.remove(),4200);
  }
}
const anim = (el, frames, opts) => el.animate(frames, Object.assign({duration:600, easing:'ease-in-out'}, opts)).finished.catch(()=>{});
const wait = ms => new Promise(r=>setTimeout(r,ms));
const dogPos = (fy=.45) => { const r=stage.getBoundingClientRect(), d=$('#dogsvg').getBoundingClientRect(); return [d.left-r.left+d.width/2, d.top-r.top+d.height*fy]; };

/* ---------- progress ---------- */
function gain(xp){
  renderStats(); save(); return;
  S.xp += xp;
  while(S.level<MAXLV && S.xp >= need(S.level)){
    S.xp -= need(S.level); S.level++;
    const un = [...TRICKS,...SNACKS,...HEAD,...BODY].filter(x=>x.lv===S.level).map(x=>`${x.em} ${x.ko||x.name}`);
    setTimeout(()=>{ confetti(); toast(`🎉 Level ${S.level}!<small>${un.length?'Unlocked: '+un.join(', '):'Doongi loves you even more'}</small>`);  }, 300);
    renderPanels();
  }
  renderStats(); save();
}

/* ---------- actions ---------- */
let busy = false;
async function happyFace(ms=900){ eyeOverride='happy'; setEyes(); await wait(ms); eyeOverride=null; setEyes(); }

let lastPet = 0, lastAttention = Date.now(), lastRefused = false;
function pet(x, y){
  if(S.asleep){ const [zx,zy]=dogPos(.2); fx('💤',zx+40,zy,1,0); return; }
  const now = Date.now(); if(now-lastPet < 350) return; lastPet = now;
  S.happy = clamp(S.happy+4);
  fx(Math.random()<.15?'🖕':'❤️', x, y, 1, 10);
  lastAttention = now;
  if(!busy && Math.random()<.12){
    anim(head,[{transform:'translateY(0) scale(1)'},{transform:'translateY(8px) scale(1.08)'},{transform:'translateY(0) scale(1)'}],{duration:300});
    fx('🖕', x, y, 1, 0);
    say(...pick([['😤','stawp it'],['🙄','wtf bro']]));
    gain(2); return;
  }
  if(!busy){ anim(head,[{transform:'rotate(0)'},{transform:'rotate(-8deg)'},{transform:'rotate(5deg)'},{transform:'rotate(0)'}],{duration:700}); happyFace(700); }
  if(Math.random()<.25) say(...pick([['','hehe'],['😤','stawp it'],['😒','stawp it. …ok one more'],['😼','more peasant']]));
  gain(2);
}
const pick = a => a[Math.floor(Math.random()*a.length)];

async function feed(s, btn){
  if(busy) return;
  if(S.asleep){ const [zx,zy]=dogPos(.2); fx('💤',zx+40,zy,1,0); return; }
  if(S.full > 92){ say('😝','nope'); anim(head,[{transform:'rotate(0)'},{transform:'rotate(-12deg)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}],{duration:600}); return; }
  busy = true;
  const food = $('#bowlFood');
  food.style.transform='scale(.3)'; food.style.opacity=1;
  requestAnimationFrame(()=>food.style.transform='scale(1)');
  await wait(450);
  await anim(dog,[{transform:'translate(0,0) rotate(0)'},{transform:'translate(-34px,6px) rotate(-14deg)'}],{duration:400,fill:'forwards'});
  for(let i=0;i<4;i++){ await anim(head,[{transform:'translateY(0)'},{transform:'translateY(8px) rotate(-4deg)'},{transform:'translateY(0)'}],{duration:230}); food.style.transform=`scale(${1-(i+1)*.22})`; }
  food.style.opacity=0;
  await anim(dog,[{transform:'translate(-34px,6px) rotate(-14deg)'},{transform:'translate(0,0) rotate(0)'}],{duration:350});
  dog.getAnimations().forEach(a=>a.cancel());
  const [dx,dy] = dogPos(.5);
  fx('✨', dx, dy, 3, 50);
  S.full = clamp(S.full + s.full); S.happy = clamp(S.happy + s.happy);
  lastAttention = Date.now();
  say(...pick([['🙄','wtf bro, kibble again?'],['🥲','kibble again... are we poor'],['🥲','kibble again... are we poor'],['😼','more peasant'],['','hehe']]));
  happyFace(800);
  gain(s.xp); busy = false;
}

async function doTrick(t){
  if(busy) return;
  if(S.asleep){ const [zx,zy]=dogPos(.2); fx('💤',zx+40,zy,1,0); return; }
  if(S.energy < 8){ say('😝','nope'); return; }
  if(S.full < 10){ say('😼','more peasant'); return; }
  busy = true; lastAttention = Date.now();
  const [cx, cy] = dogPos(.35);
  if(!lastRefused && Math.random()<.22){
    lastRefused = true;
    await wait(900);
    await anim(head,[{transform:'rotate(0)'},{transform:'rotate(22deg) translateX(10px)'}],{duration:300,fill:'forwards'});
    $('#tongue').style.display=''; eyeOverride='happy'; setEyes();
    say(...pick([['😝','nope'],['😝','bleh'],['🙄','wtf bro'],['😤','stawp it']]));
    await wait(1200);
    await anim(head,[{transform:'rotate(22deg) translateX(10px)'},{transform:'rotate(0)'}],{duration:300});
    head.getAnimations().forEach(a=>a.cancel()); eyeOverride=null; setEyes(); renderStats();
    gain(1); busy=false; return;
  }
  lastRefused = false;
  
  await wait(250);
  const legL = $('#legL');
  switch(t.id){
    case 'anja':
      await anim(dog,[{transform:'translateY(0) scale(1,1)'},{transform:'translateY(0) scale(1.06,.86)'}],{duration:350,fill:'forwards'});
      await happyFace(700);
      await anim(dog,[{transform:'scale(1.06,.86)'},{transform:'scale(1,1)'}],{duration:300});
      break;
    case 'sohn':
      await anim(legL,[{transform:'rotate(0)'},{transform:'rotate(70deg) translateY(-6px)'}],{duration:350,fill:'forwards'});
      fx('🤝', cx-95, cy+20, 1, 0);
      await anim(legL,[{transform:'rotate(70deg) translateY(-6px)'},{transform:'rotate(60deg) translateY(-6px)'},{transform:'rotate(70deg) translateY(-6px)'}],{duration:700});
      await anim(legL,[{transform:'rotate(70deg) translateY(-6px)'},{transform:'rotate(0)'}],{duration:300});
      break;
    case 'bang':
      fx('💥', cx-70, cy-20, 1, 0);
      await anim(dog,[{transform:'rotate(0)'},{transform:'translateY(-14px) rotate(-30deg)', offset:.4},{transform:'translate(95px,-95px) rotate(-90deg)'}],{duration:500,easing:'ease-in',fill:'forwards'});
      eyeOverride='x'; setEyes(); $('#tongue').style.display='';
      await wait(1500);
      eyeOverride=null; setEyes();
      await anim(dog,[{transform:'translate(95px,-95px) rotate(-90deg)'},{transform:'translateY(-18px) rotate(10deg)', offset:.7},{transform:'rotate(0)'}],{duration:550});
      say(...pick([['😏','yo mama fell for that too'],['','hehe']]));
      break;
    case 'spin':
      await anim(dog,[{transform:'rotateY(0)'},{transform:'rotateY(360deg)'}],{duration:800});
      await anim(dog,[{transform:'rotateY(0)'},{transform:'rotateY(-360deg)'}],{duration:800});
      break;
    case 'high':
      await anim(legL,[{transform:'rotate(0)'},{transform:'rotate(150deg) translateY(-10px)'}],{duration:350,fill:'forwards'});
      fx('✋', cx-80, cy-60, 1, 0); fx('⭐', cx-80, cy-40, 4, 70);
      await wait(800);
      await anim(legL,[{transform:'rotate(150deg) translateY(-10px)'},{transform:'rotate(0)'}],{duration:350});
      break;
    case 'jump':
      await anim(dog,[{transform:'translateY(0) scale(1,1)'},{transform:'translateY(0) scale(1.08,.88)',offset:.2},{transform:'translateY(-90px) scale(.95,1.06)',offset:.55},{transform:'translateY(0) scale(1.08,.9)',offset:.85},{transform:'translateY(0) scale(1,1)'}],{duration:900});
      fx('✨', cx, cy+80, 3, 80);
      break;
    case 'down':
      await anim(dog,[{transform:'scale(1,1)'},{transform:'translateY(10px) scale(1.12,.7)'}],{duration:500,fill:'forwards'});
      eyeOverride='sleep'; setEyes(); await wait(1400); eyeOverride=null; setEyes();
      await anim(dog,[{transform:'translateY(10px) scale(1.12,.7)'},{transform:'scale(1,1)'}],{duration:400});
      break;
    case 'sing':
      $('#mouthO').setAttribute('display','inline'); $('#tongue').style.display='none';
      eyeOverride='happy'; setEyes();
      
      for(let i=0;i<3;i++){ fx(pick(['🎵','🎶','♪']), cx+30, cy-30, 1, 40); await anim(head,[{transform:'rotate(0)'},{transform:'rotate(-14deg) translateY(-6px)'},{transform:'rotate(0)'}],{duration:600}); }
      $('#mouthO').setAttribute('display','none'); eyeOverride=null; setEyes(); renderStats();
      break;
    case 'kiss':
      eyeOverride='happy'; setEyes();
      await anim(dog,[{transform:'scale(1)'},{transform:'scale(1.15) translateY(-6px)'},{transform:'scale(1)'}],{duration:700});
      fx('💋', cx, cy, 1, 0); fx('💚', cx, cy, 4, 90); fx('🧡', cx, cy, 4, 90);
      await wait(600); eyeOverride=null; setEyes();
      break;
  }
  [dog, head, legL].forEach(el=>el.getAnimations().forEach(a=>a.cancel()));
  S.energy = clamp(S.energy - 8); S.full = clamp(S.full - 3); S.happy = clamp(S.happy + 5);
  fx('⭐', cx, cy-40, 1, 0);
  gain(10);
  renderStats(); busy = false;
}

function toggleSleep(){
  if(busy) return;
  S.asleep = !S.asleep;
  
  renderStats(); save();
}

/* ---------- loop ---------- */
let tick = 0;
setInterval(()=>{
  tick++;
  if(S.asleep){
    S.energy = clamp(S.energy + 1.6); S.full = clamp(S.full - .05);
    if(tick%3===0){ const [x,y]=dogPos(.2); fx('💤', x+50, y, 1, 10); }
    if(S.energy >= 100){ S.asleep=false; }
  } else {
    S.full = clamp(S.full - .18); S.happy = clamp(S.happy - .14); S.energy = clamp(S.energy - .08);
    if(tick%14===0 && !busy && !$('#bubble').classList.contains('show')){
      if(S.full<25) say('😼','more peasant');
      else if(S.energy<20) { const [zx,zy]=dogPos(.2); fx('😪',zx+40,zy,1,0); }
      else if(S.happy<30) say('🙄','wtf bro, hello??');
      else if(Date.now()-lastAttention > 40000) say('🙄','wtf bro, hello??');
      else say(...pick([['😏','yo mama'],['🙄','wtf bro'],['😼','yo mama so slow she still hasn\'t fed me'],['','hehe'],['😝','bleh']]));
    }
    if(tick%9===0 && !busy && !eyeOverride){ eyeOverride='sleep'; setEyes(); setTimeout(()=>{ if(eyeOverride==='sleep'){eyeOverride=null; setEyes();} },160); }
  }
  if(tick%5===0) save();
  renderStats();
  const d=new Date(); $('#hh').style.transform=`translateX(-50%) rotate(${(d.getHours()%12)*30+d.getMinutes()/2}deg)`; $('#mm').style.transform=`translateX(-50%) rotate(${d.getMinutes()*6}deg)`;
  stage.classList.toggle('night', d.getHours()>=19 || d.getHours()<6);
}, 1000);

/* ---------- events ---------- */
const svg = $('#dogsvg');
let stroking=false, lastXY=null, dist=0;
svg.addEventListener('pointerdown', e=>{ stroking=true; const r=stage.getBoundingClientRect(); lastXY=[e.clientX,e.clientY]; dist=0; pet(e.clientX-r.left, e.clientY-r.top); });
svg.addEventListener('pointermove', e=>{
  if(!stroking) return;
  dist += Math.hypot(e.clientX-lastXY[0], e.clientY-lastXY[1]); lastXY=[e.clientX,e.clientY];
  if(dist>50){ dist=0; const r=stage.getBoundingClientRect(); pet(e.clientX-r.left, e.clientY-r.top); }
});
window.addEventListener('pointerup', ()=>stroking=false);
$('#petBtn').onclick = ()=>{ const [x,y]=dogPos(.3); lastPet=0; pet(x,y); };
$('#sleepBtn').onclick = toggleSleep;
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on', x===b));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on', p.id==='p-'+b.dataset.tab));
});
function lockedMsg(it){ toast(`🔒 Unlocks at level ${it.lv}`); }
$('#trickGrid').onclick = e=>{ const b=e.target.closest('.item'); if(!b) return; const t=TRICKS.find(x=>x.id===b.dataset.id); S.level<t.lv?lockedMsg(t):doTrick(t); };
$('#snackGrid').onclick = e=>{ const b=e.target.closest('.item'); if(!b) return; const s=SNACKS.find(x=>x.id===b.dataset.id); S.level<s.lv?lockedMsg(s):feed(s,b); };
function wearClick(list, slot){ return e=>{
  const b=e.target.closest('.item'); if(!b) return; const it=list.find(x=>x.id===b.dataset.id);
  if(S.level<it.lv) return lockedMsg(it);
  S[slot]=it.id; renderWear(); renderPanels(); save();
  if(it.id!=='none'){ const [x,y]=dogPos(.4); fx('✨',x,y,4,90); say('','hehe'); happyFace(800); S.happy=clamp(S.happy+2); }
}; }
$('#headGrid').onclick = wearClick(HEAD,'head');
$('#bodyGrid').onclick = wearClick(BODY,'body');
function setFrame(i){ S.frame=i; $('#framePhoto').src=PHOTOS[i]; document.querySelectorAll('#photos img').forEach(im=>im.classList.toggle('inframe', +im.dataset.i===i)); save(); }
let lbIndex=0;
$('#photos').innerHTML = PHOTOS.map((p,i)=>`<img src="${p}" alt="Doongi photo ${i+1}" data-i="${i}">`).join('');
$('#photos').onclick = e=>{ if(e.target.tagName==='IMG'){ lbIndex=+e.target.dataset.i; $('#lbimg').src=e.target.src; $('#lightbox').classList.add('on'); } };
$('#lightbox').onclick = e=>{ if(e.target.id==='lightbox'||e.target.id==='lbClose') $('#lightbox').classList.remove('on'); };
$('#toFrame').onclick = ()=>{ setFrame(lbIndex); $('#lightbox').classList.remove('on'); toast('🖼️ Frame updated!'); };
document.querySelector('.frame').onclick = ()=>setFrame(((S.frame??5)+1)%PHOTOS.length);
let resetArm=false;
$('#resetBtn').onclick = e=>{
  if(!resetArm){ resetArm=true; e.target.textContent='tap again to reset everything'; setTimeout(()=>{resetArm=false; e.target.textContent='reset progress';},3000); return; }
  S={...DEFAULT}; save(); renderAll(); resetArm=false; e.target.textContent='reset progress';
};

/* ---------- start ---------- */
const returning = load();
if(returning){
  const mins = Math.min((Date.now()-S.last)/60000, 600);
  S.full = clamp(S.full - mins*.25); S.happy = clamp(S.happy - mins*.15);
  S.energy = S.asleep ? clamp(S.energy + mins*3) : clamp(S.energy + mins*.5);
  if(S.energy>=100) S.asleep=false;
}
if(!HEAD.some(h=>h.id===S.head)) S.head='none';
if(!BODY.some(h=>h.id===S.body)) S.body='none';
if(S.level>MAXLV){S.level=MAXLV;S.xp=0;}
renderAll();
setFrame(typeof S.frame==='number' && S.frame<PHOTOS.length ? S.frame : 5);
setTimeout(()=>{ say('','hehe'); fx('💚',undefined,undefined,3,80); }, 500);
