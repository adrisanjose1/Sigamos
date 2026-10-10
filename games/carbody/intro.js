/*
  RESEÑA "HOW IT WORKS" OVERLAY — pink overlay + white card that plays 4 short animated scenes, then "Listo?".
  CarIntro.mount()  builds it (the eye is still shut)   CarIntro.start()  plays it (the eye has opened)
  CarIntro.show()   mount + start (menu button)         CarIntro.close()  removes it
  Hands: drop assets/hand-click.gif and assets/hand-swipe.gif into the folder and they are used automatically.
  Until then a drawn hand is used. Shown automatically only the first time Reseña is opened (localStorage 'seenReseñaIntro').
*/
const CarIntro = (() => {
  const SEEN = 'seenReseñaIntro';
  const HAND = `<svg viewBox="0 0 110 110" width="110" height="110" aria-hidden="true"><g fill="#ffe3c8" stroke="#d99a72" stroke-width="3" stroke-linejoin="round"><rect x="30" y="16" width="17" height="56" rx="8.5"/><path d="M23 60 Q23 52 31 52 H72 Q86 52 86 68 V88 Q86 106 68 106 H44 Q27 106 23 90 Z"/><path d="M50 50 V60 M64 52 V62" fill="none"/><path d="M24 70 Q9 66 12 79 Q17 92 29 86" /></g></svg>`;
  const hand = (kind, cls, style = '') => `<img class="${cls}" style="${style}" src="assets/hand-${kind}.gif" alt="" draggable="false" onerror="CarIntro.svg(this)">`;
  const svg = img => { const d = document.createElement('div'); d.innerHTML = HAND; const s = d.firstChild; s.setAttribute('class', img.className); s.setAttribute('style', img.getAttribute('style') || ''); img.replaceWith(s); };
  const part = name => (typeof CARDS !== 'undefined' && CARDS.find(c => c.name === name)) || {name, explanation:''};
  let timers = [], pop = null;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const $i = id => document.getElementById(id);

  function html(){
    const hl = part('Headlights');
    return `<div class="pink-scrim" id="ciPop">
      <div class="intro-card" id="ciCard">
        <div class="scene" id="ci1">
          <div class="ci-frame" style="height:168px">
            <img class="ci-ph" src="assets/base/front.jpg" alt="" draggable="false" style="width:1555px;left:-342px;top:-431px">
            <img class="ci-hl" src="assets/masks/front-headlights.png" alt="" draggable="false" style="width:1555px;left:-342px;top:-431px">
            <span class="ripple" style="left:132px;top:82px"></span>
            ${hand('click', 'tapper', 'left:132px;top:82px')}
          </div>
          <div class="ci-card"><b>${esc(hl.name)}</b><span>${esc(hl.explanation)}</span></div>
        </div>
        <div class="scene" id="ci2">
          <div class="ci-frame" style="height:190px">
            <img class="ci-ph ci-slide" id="ciPan" src="assets/base/front.jpg" alt="" draggable="false" style="width:1600px;left:-660px;top:-469px">
            ${hand('swipe', 'swiper swipe-pan')}
          </div>
          <div class="ci-dots"><i id="ciD0"></i><i id="ciD1" class="on"></i><i id="ciD2"></i></div>
        </div>
        <div class="scene" id="ci3">
          <div class="ci-frame" style="height:170px">
            <div class="ci-zoom" id="ciZoom"><img class="ci-ph" src="assets/base/front.jpg" alt="" draggable="false" style="width:468px;left:-94px;top:-80px"></div>
          </div>
          <div class="ci-slider"><div class="ci-track"><div class="ci-knob" id="ciKnob"></div></div><div class="ci-ends"><span>Normal</span><span>Cerca</span></div>
            ${hand('swipe', 'swiper swipe-knob')}
          </div>
        </div>
        <div class="scene" id="ci4">
          <div class="ci-phone">
            <div class="ci-bar"><span>Tuercas y Calaveras</span><b class="ci-burger">☰</b></div>
            <span class="ripple" style="right:25px;top:23px;left:auto;--rd:.6s"></span>
            ${hand('click', 'tapper', 'right:-6px;top:30px;left:auto;--td:.3s')}
            <div class="ci-menu"><i>Reseña</i><i class="flash-row">Examen</i><i>Inicio</i></div>
          </div>
        </div>
        <div class="intro-cap" id="ciCap"></div>
      </div>
      <div class="listo-wrap" id="ciListo">
        <button class="listo" onclick="CarIntro.close()">Listo?</button>
        ${hand('click', 'listo-tap')}
      </div>
      <button class="skip" onclick="CarIntro.skip()">Skip ›</button>
    </div>`;
  }

  const SC = [
    {id:'ci1', cap:'Toca una parte del carro para ver qué es',               ms:5600},
    {id:'ci2', cap:'Desliza para mover la foto cuando te acercas',           ms:4600, run:demoPan},
    {id:'ci3', cap:'Con el zoom del menú ☰ acercas el carro',                ms:4800, run:demoZoom},
    {id:'ci4', cap:'En el menú ☰ también entras a Examen',                   ms:4600},
  ];
  function demoPan(){
    const w = $i('ciPan'), dots = [0, 1, 2].map(i => $i('ciD' + i)), dot = n => dots.forEach((d, i) => d.classList.toggle('on', i === n));
    later(() => { w.style.left = '-1000px'; dot(2); }, 600);   // right side of the car
    later(() => { w.style.left = '-330px';  dot(0); }, 1700);  // left side
    later(() => { w.style.left = '-660px';  dot(1); }, 2900);  // back to the middle
  }
  function demoZoom(){
    const z = $i('ciZoom'), k = $i('ciKnob');
    later(() => { z.style.transform = 'scale(2.3)'; k.style.left = '100%'; }, 700);
    later(() => { z.style.transform = 'scale(1)';   k.style.left = '0%';   }, 2700);
  }

  function showListo(){
    $i('ciCard')?.classList.add('gone');
    $i('ciListo')?.classList.add('show');
    pop?.querySelector('.skip')?.remove();
  }
  function mount(){
    close();
    document.body.insertAdjacentHTML('beforeend', html());
    pop = $i('ciPop');
    try { localStorage.setItem(SEEN, '1'); } catch(e){}
  }
  function start(){
    if(!pop) return;
    let t = 350;
    SC.forEach(sc => {
      later(() => {
        pop.querySelectorAll('#ciCard .scene').forEach(e => e.classList.remove('on'));
        $i(sc.id)?.classList.add('on');
        const cap = $i('ciCap'); if(!cap) return;
        cap.classList.remove('show'); void cap.offsetWidth; cap.textContent = sc.cap; cap.classList.add('show');
        sc.run && sc.run();
      }, t);
      t += sc.ms;
    });
    later(showListo, t);
  }
  function skip(){ timers.forEach(clearTimeout); timers = []; showListo(); }
  function close(){ timers.forEach(clearTimeout); timers = []; document.getElementById('ciPop')?.remove(); pop = null; }
  const seen = () => { try { return !!localStorage.getItem(SEEN); } catch(e){ return true; } };
  return {mount, start, skip, close, svg, seen, show(){ mount(); start(); }};
})();
