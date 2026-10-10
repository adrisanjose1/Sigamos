/*
  flash.js — FLASHCARDS mode + the pink "how it works" overlay that opens Reseña
  (ported from the Sigamos listening exam: card deck, flick-in, door sounds, pink tutorial)

  Uses the globals of app.js: app, state, CARDS, shuffle, rand, sfx, popup, closePops, removeQCard, setBodyCam, shimmerNow, introTimers, introEl
  Sounds: assets/sounds/door-close.wav · door-slide.wav · card-place-1/2 · carousel-pick(-2)   Hands: img/hand-click.gif · hand-swipe.gif
  Flashcards use only the 30 warning lights (cards without studyOnly); gauges / display parts stay in Reseña.
*/
(function(){
const FC = {on:false, cards:[], i:0, cycle:0, timers:[], audio:[], busy:false};
const COLORS = ['c-red', 'c-yellow', 'c-blue'];
const SFX_PLACE = ['card-place-1.wav', 'card-place-2.mp3'], SFX_PICK = ['carousel-pick.mp3', 'carousel-pick-2.mp3'];
const later = (fn, ms) => { const t = setTimeout(fn, ms); FC.timers.push(t); return t; };
const sfxR = (list, v) => sfx(list[Math.floor(Math.random()*list.length)], v);
const byId = id => document.getElementById(id);

// play a long sound and (optionally) fade it out so it never cuts off abruptly
function playFade(file, vol, fadeAt, fadeMs){
  try{
    const a = new Audio('assets/sounds/'+file); a.volume = vol; a.play().catch(() => {}); FC.audio.push(a);
    if(fadeAt != null) later(() => { const t0 = performance.now(); const f = () => { const k = Math.min(1, (performance.now()-t0)/fadeMs); a.volume = vol*(1-k); if(k < 1) requestAnimationFrame(f); else a.pause(); }; f(); }, fadeAt);
  }catch(e){}
}

/* ================= FLASHCARDS ================= */

// 1) everything on screen falls (door-close)  2) hearts + title rise together (door-slide)  3) the cards flick in
window.enterFlash = function(){
  if(FC.on) return;
  closeClusterIntro();
  introTimers.forEach(clearTimeout); introTimers = []; if(introEl){ introEl.remove(); introEl = null; }   // exam countdown
  removeQCard(); closePops();
  document.querySelectorAll('.feedback,.praise,.burst .particle').forEach(e => e.remove());
  state.screen = 'flash'; state.answerLocked = true;
  FC.on = true; FC.i = 0; FC.cycle = 0; FC.busy = false; FC.ready = false;
  document.body.classList.add('fc-bg');   // the screen behind the falling cluster is white (no black)
  FC.cards = shuffle(CARDS.filter(c => !c.studyOnly));
  const pieces = [...app.querySelectorAll('.home .big-btn, .viewer, .fab, .next-btn')];
  pieces.forEach((el, k) => { el.style.setProperty('--fd', (k*0.12)+'s'); el.style.setProperty('--fr', (rand(17)-8)+'deg'); el.classList.add('fc-fall'); });
  playFade('door-close.wav', .9, 1500, 700);
  later(buildFlash, (pieces.length ? 1350 + 120*(pieces.length-1) : 0) + 150);
};

function buildFlash(){
  const el = document.createElement('div'); el.id = 'flash'; el.className = 'hdr';
  el.innerHTML = `<section class="fc-view">
    <div class="fc-topbar"><button class="fc-back" data-action="home">← Inicio</button><h2>Flashcards</h2>
      <div class="fc-right"><div class="fc-progress"><b>♥</b> <span id="fcProg"></span></div><button class="fc-menu" data-action="menu" aria-label="Menú">☰</button></div></div>
    <div class="fc-study">
      <div class="fc-stage"><div class="fc-title"><span>Adivina el</span><span>testigo</span></div><div class="fc-stack hold" id="fcStack"></div></div>
    </div></section>`;
  document.body.appendChild(el);
  el.querySelector('#fcStack').addEventListener('click', e => { if(e.target.closest('.fc-card.current')) nextCard(); });   // tap the card = next card
  renderCard(false);
  playFade('door-slide.wav', .9);
  app.innerHTML = ''; setBodyCam(false);
  void el.offsetWidth; el.classList.add('hdr-up');                          // 1) only title, Inicio, progress and menu are dragged up (white page)
  later(() => { el.classList.add('hearts'); sfxR(SFX_PLACE, .7); }, 1150);   // 2) hearts POP once the headers are in place
  later(flick, 1150 + 850);                                                  // 3) the cards flick in
}

function renderCard(advancing){
  const c = FC.cards[FC.i], n = FC.cards.length, stack = byId('fcStack'); if(!c || !stack) return;
  const col = k => COLORS[(FC.cycle + k) % 3];
  stack.innerHTML = `<div class="fc-card ${col(2)}"><div class="mini-inner"></div></div>
    <div class="fc-card ${col(1)}"><div class="mini-inner"></div></div>
    <div class="fc-card current ${col(0)}"><div class="fc-face">
      <div class="fc-icon"><img src="assets/cards/${c.class}.png" alt="" draggable="false"></div>
      <div class="fc-name">${esc(c.name)}</div>
      <div class="fc-exp">${esc(c.explanation)}</div>
    </div></div>`;
  const face = stack.querySelector('.fc-card.current .fc-face');   // long texts shrink a little so nothing is ever cut off
  if(face){ let k = 1; face.style.setProperty('--fs', 1); while(face.scrollHeight > face.clientHeight + 1 && k > .6){ k -= .04; face.style.setProperty('--fs', k.toFixed(2)); } }
  byId('fcProg').textContent = `${FC.i+1}/${n}`;
  if(advancing) advanceDeck(stack);
}

// the deck shifts: back card → middle → front, and the card that fell comes back up under the stack
function advanceDeck(stack){
  const els = [...stack.querySelectorAll('.fc-card')]; if(els.length !== 3) return;
  const [back, mid, front] = els;
  const start = [[back, '13deg', '112vh'], [mid, '-7deg', '18px'], [front, '5deg', '9px']];
  els.forEach(e => e.style.transition = 'none');
  start.forEach(([e, r, y]) => { e.style.setProperty('--rot', r); e.style.setProperty('--y', y); });
  void stack.offsetWidth;
  back.style.transition = 'transform 1.05s cubic-bezier(.2,.8,.25,1)';
  mid.style.transition = front.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
  start.forEach(([e]) => { e.style.removeProperty('--rot'); e.style.removeProperty('--y'); });
  later(() => els.forEach(e => e.style.transition = ''), 1150);
}

function flick(){
  const s = byId('fcStack'); if(!s) return;
  s.classList.remove('hold'); s.classList.add('flicking');
  [0, 600, 1200].forEach(d => later(() => sfxR(SFX_PLACE, .95), d + 330));
  later(() => { s.classList.remove('flicking'); FC.ready = true; state.answerLocked = false; }, 2050);
}

function nextCard(){
  if(!FC.ready || FC.busy) return;
  if(FC.i >= FC.cards.length-1){ finishCards(); return; }
  FC.busy = true; sfxR(SFX_PICK, .9); FC.cycle++;
  document.querySelector('#fcStack .fc-card.current')?.classList.add('tumble-out');
  later(() => { FC.i++; renderCard(true); FC.busy = false; }, 1050);
}

function finishCards(){
  FC.busy = true; sfx('correct-bell.wav', .9); sfxR(SFX_PICK, .9);
  document.querySelector('#fcStack .fc-card.current')?.classList.add('tumble-out');
  later(() => { document.querySelector('#fcStack')?.insertAdjacentHTML('beforeend', '<div class="fc-done"><div>🎉</div><b>¡Terminaste!</b><span>Ahora, al Examen…</span></div>'); }, 700);
  later(() => { startExam({eye:true}); }, 2600);   // finished reviewing → sent to the Examen
}

window.flashLeave = function(){
  if(!FC.on) return;
  FC.timers.forEach(clearTimeout); FC.timers = [];
  FC.audio.forEach(a => { try{ a.pause(); }catch(e){} }); FC.audio = [];
  FC.on = false; byId('flash')?.remove(); document.body.classList.remove('fc-bg');
  document.querySelectorAll('.fc-fall').forEach(e => e.classList.remove('fc-fall'));
};

/* ================= RESEÑA: pink "how it works" overlay ================= */
// tap a light → its explanation · swipe between the 3 sides · zoom from the menu · Flashcards live in the menu
const CI = {t:[], el:null};
const ciLater = (fn, ms) => CI.t.push(setTimeout(fn, ms));
window.closeClusterIntro = function(){ CI.t.forEach(clearTimeout); CI.t = []; CI.el?.remove(); CI.el = null; };

window.showClusterIntro = function(){
  closeClusterIntro();
  const tp = CARDS.find(c => c.class === 'tpms'), lb = tp.litBox;
  const lights = CARDS.filter(c => c.lit && !c.studyOnly);
  const litOne = `<img class="ci-lit" src="${tp.lit}" alt="" style="left:${lb[0]}%;top:${lb[2]}%;width:${lb[1]-lb[0]}%;height:${lb[3]-lb[2]}%">`;
  const litAll = lights.map(c => `<img src="${c.lit}" alt="" style="left:${c.litBox[0]}%;top:${c.litBox[2]}%;width:${c.litBox[1]-c.litBox[0]}%;height:${c.litBox[3]-c.litBox[2]}%">`).join('');
  const world = (inner) => `<img class="ci-base" src="assets/base/cluster.jpg" alt="">${inner}`;
  const s = document.createElement('div'); s.className = 'pink-scrim'; s.id = 'ciPop';
  s.innerHTML = `
   <div class="intro-card" id="ciCard">
     <div class="scene" id="ci1">
       <div class="ci-photo"><div class="ci-world">${world(litOne)}</div><div class="ripple" style="left:137px;top:75px"></div><img class="tapper" style="left:137px;top:75px" src="img/hand-click.gif" alt=""></div>
       <div class="ci-card"><b>${esc(tp.name)}</b><span>${esc(tp.explanation)}</span></div>
     </div>
     <div class="scene" id="ci2">
       <div class="ci-photo"><div class="ci-world" id="ciPan">${world(litAll)}</div></div>
       <div class="ci-dots" id="ciDots"><i></i><i class="on"></i><i></i></div>
       <img class="hand-h" src="img/hand-swipe.gif" alt="">
     </div>
     <div class="scene" id="ci3">
       <div class="ci-photo"><div class="ci-world" id="ciZoom">${world(litAll)}</div></div>
       <div class="ci-zoom"><span>🔍 Zoom</span><div class="ci-zs"><b id="ciKnob"></b></div></div>
       <div class="ci-ends"><span>Cerca</span><span>Lejos</span></div>
       <img class="hand-z" id="ciHandZ" src="img/hand-swipe.gif" alt="">
     </div>
     <div class="scene" id="ci4">
       <div class="ci-mini"><span class="pill">RESEÑA</span><div class="ci-fab">☰</div>
         <div class="ci-menu"><div class="y">▤ Reseña</div><div>▶ Examen</div><div class="f">🃏 Flashcards</div><div>⌂ Inicio</div></div>
         <div class="ripple" style="left:245px;top:25px;--rd:.5s"></div><img class="tapper" style="left:245px;top:25px;--td:.35s" src="img/hand-click.gif" alt="">
         <div class="ripple" style="left:136px;top:150px;--rd:2.5s"></div><img class="tapper" style="left:136px;top:150px;--td:2.25s" src="img/hand-click.gif" alt="">
       </div>
     </div>
     <div class="intro-cap" id="ciCap"></div>
   </div>
   <div class="listo-wrap" id="ciListo"><button class="listo" onclick="ciDone()">Listo?</button><img class="listo-tap" src="img/hand-click.gif" alt=""></div>
   <button class="skip" onclick="ciSkip()">Skip ›</button>`;
  document.body.appendChild(s); CI.el = s;

  const SC = [
    {id:'ci1', cap:'Toca un testigo para ver qué significa', ms:5600},
    {id:'ci2', cap:'Desliza para ver los 3 lados del tablero', ms:4600, run:demoPan},
    {id:'ci3', cap:'Con el zoom del menú acercas o alejas el tablero', ms:4800, run:demoZoom},
    {id:'ci4', cap:'En el menú ☰ también entras a Flashcards', ms:4600},
  ];
  let t = 350;
  SC.forEach(sc => {
    ciLater(() => {
      document.querySelectorAll('#ciCard .scene').forEach(e => e.classList.remove('on'));
      byId(sc.id)?.classList.add('on');
      const cap = byId('ciCap'); if(cap){ cap.classList.remove('show'); void cap.offsetWidth; cap.textContent = sc.cap; cap.classList.add('show'); }
      sc.run && sc.run();
    }, t);
    t += sc.ms;
  });
  ciLater(showListo, t);
};

function demoPan(){
  const w = byId('ciPan'), dots = [...document.querySelectorAll('#ciDots i')]; if(!w) return;
  const go = (i, left) => { w.style.left = left+'px'; dots.forEach((d, k) => d.classList.toggle('on', k === i)); };
  go(1, -265);
  ciLater(() => go(2, -436), 600);    // finger drags left  → right side
  ciLater(() => go(0, -98),  1700);   // finger drags right → left side
  ciLater(() => go(1, -265), 2900);   // back to the centre
}
function demoZoom(){
  const z = byId('ciZoom'), k = byId('ciKnob'), h = byId('ciHandZ'); if(!z) return;
  z.style.transform = 'scale(1)'; k.style.left = '0%'; h.style.transform = 'translateX(0)';
  ciLater(() => { z.style.transform = 'scale(.34)'; k.style.left = '100%'; h.style.transform = 'translateX(190px)'; }, 700);   // Lejos: the whole cluster fits
  ciLater(() => { z.style.transform = 'scale(1)'; k.style.left = '0%'; h.style.transform = 'translateX(0)'; }, 2700);          // Cerca again
}
function showListo(){
  byId('ciCard')?.classList.add('gone'); byId('ciListo')?.classList.add('show');
  document.querySelector('#ciPop .skip')?.remove();
}
window.ciSkip = function(){ CI.t.forEach(clearTimeout); CI.t = []; showListo(); };
window.ciDone = function(){ closeClusterIntro(); try{ shimmerNow(); }catch(e){} };
})();
