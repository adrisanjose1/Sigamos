/*
  KIA SOUL CAR BODY (Tuercas y Calaveras) — photographic flashcard app
  Language: Mexican Spanish UI, English component names.
  Photos: assets/base/   Masks: assets/masks/   Sounds: assets/sounds/

  Sections: 1 data · 2 hit-testing · 3 viewer · 4 sounds · 5 popups · 6 reseña · 7 examen · 8 mistakes · 9 wiring
*/

/* ================= 1. DATA ================= */

const SCENES = {
  front: {image:'assets/base/front.jpg', w:800, h:600, title:'Front View', car:[21,79,15,80]},
  side:  {image:'assets/base/side.jpg',  w:800, h:600, title:'Side View', car:[14,86,20,66]},
  rear:  {image:'assets/base/rear.jpg',  w:800, h:600, title:'Rear View', car:[16,82,7,81]},
};

// Explanations that show up on more than one photo live here once.
const TXT = {
  steering: 'Te ayuda a dirigir el carro hacia la izquierda o la derecha.',
  seat:     'Es donde te sientas para manejar. Se puede ajustar para que estés cómodo y alcances los controles.',
  gear:     'Sirve para cambiar la posición de la transmisión: estacionar, reversa, neutral o manejar.',
  hazard:   'Activa las luces intermitentes para avisar de una situación de emergencia.',
  airbag:   'Franja con una luz que avisa si la bolsa de aire del pasajero está activada o desactivada.',
  wiper:    'Controla los limpiaparabrisas y ayuda a limpiar el parabrisas.',
};

/*
  PARTS LIST — the "class" of every part.
  The same part can appear on several photos (the steering wheel is on four). Each photo keeps its OWN card,
  but all those cards share one class. Examen asks for each class ONCE: it shows the class name, picks one of
  the photos that has the part at random, and a tap on ANY card of that class on that photo is correct.
  To add a part: add one line here, then put  class:'its-key'  on every card that shows it.
*/
const PART_CLASSES = {
  'front-foglights': 'Foglights',
  'front-headlights': 'Headlights',
  'front-hood': 'Hood',
  'side-mirrors': 'Side Mirrors',
  'front-grille': 'Front Grille',
  'front-bumper': 'Front Bumper',
  'front-windshield': 'Windshield',
  'front-wipers': 'Front Wipers',
  'side-rear-quarter-panel': 'Rear Quarter Panel',
  'side-rear-door': 'Rear Door',
  'side-front-fender': 'Front Fender',
  'side-rocker-panel': 'Rocker Panel',
  'side-quarter-window': 'Quarter Side Window',
  'side-front-door': 'Front Door',
  'rear-valance': 'Valance',
  'rear-license-plate': 'License Plate',
  'rear-tailgate': 'Tailgate',
  'rear-bumper': 'Rear Bumper',
  'rear-wiper-arm': 'Rear Wiper and Arm',
  'rear-high-brake-light': 'High Mounted Brake Light',
  'rear-liftgate-handle': 'Liftgate Handle',
  'rear-window': 'Rear Window',
  'rear-taillights': 'Taillights',
  'rear-reflectors': 'Rear Reflectors',
};

/*
  One entry per card.  class = key from PART_CLASSES.  box = [left%, right%, top%, bottom%] over its photo.
  mask = file name (no folder, no .png) inside assets/masks/.  Parts without a mask
  fall back to a yellow box until you add one.
*/
const RAW_CARDS = [
  // --- front ---
  {id:1, scene:'front', class:'front-foglights', mask:'front-foglights', name:'Foglights', explanation:'Luces pequeñas en la parte baja del frente. Se prenden con niebla, lluvia o polvo para alumbrar el camino cerca del suelo.', box:[25.25,73.88,58.5,66.0]},
  {id:2, scene:'front', class:'front-headlights', mask:'front-headlights', name:'Headlights', explanation:'Son los faros del frente. Alumbran el camino de noche y avisan a los demás que vas llegando.', box:[24.88,74.25,38.67,48.83]},
  {id:3, scene:'front', class:'front-hood', mask:'front-hood', name:'Hood', explanation:'Es la tapa que cubre el motor. Se levanta para revisar el aceite, el agua y otras partes del motor.', box:[25.62,73.12,33.5,46.17]},
  {id:4, scene:'front', class:'side-mirrors', mask:'front-side-mirrors', name:'Side Mirrors', explanation:'Espejos a los lados que te dejan ver lo que viene al lado y atrás del carro.', box:[23.0,77.0,28.0,33.83]},
  {id:5, scene:'front', class:'front-grille', mask:'front-grille', name:'Front Grille', explanation:'Rejilla del frente que deja entrar aire para enfriar el motor y protege lo que hay detrás.', box:[31.38,67.62,42.5,68.0]},
  {id:6, scene:'front', class:'front-bumper', mask:'front-bumper', name:'Front Bumper', explanation:'Pieza al frente del carro que absorbe golpes leves y protege la carrocería.', box:[22.0,77.12,42.83,74.0]},
  {id:7, scene:'front', class:'front-windshield', mask:'front-windshield', name:'Windshield', explanation:'Es el vidrio grande del frente. Te deja ver el camino y te protege del viento, la lluvia y el polvo.', box:[29.25,70.25,18.0,34.33]},
  {id:8, scene:'front', class:'front-wipers', mask:'front-wipers', name:'Front Wipers', explanation:'Los limpiaparabrisas. Se mueven de un lado a otro para quitar la lluvia y la suciedad del parabrisas.', box:[31.0,56.5,32.67,34.0]},

  // --- side ---
  {id:9, scene:'side', class:'side-rear-quarter-panel', mask:'side-rear-quarter-panel', name:'Rear Quarter Panel', explanation:'Es la lámina de la carrocería que está atrás de la puerta trasera, alrededor de la llanta de atrás.', box:[73.75,85.12,23.83,52.17]},
  {id:10, scene:'side', class:'side-rear-door', mask:'side-rear-door', name:'Rear Door', explanation:'Es la puerta por donde suben y bajan los pasajeros de atrás.', box:[65.75,79.38,23.33,52.83]},
  {id:11, scene:'side', class:'side-front-fender', mask:'side-front-fender', name:'Front Fender', explanation:'Es la lámina que cubre la llanta delantera, entre la puerta y el frente del carro.', box:[39.38,54.25,37.17,54.67]},
  {id:12, scene:'side', class:'side-rocker-panel', mask:'side-rocker-panel', name:'Rocker Panel', explanation:'Es la franja de lámina que va abajo de las puertas, entre la llanta de adelante y la de atrás.', box:[52.25,75.75,52.17,57.67]},
  {id:13, scene:'side', class:'side-quarter-window', mask:'side-quarter-window', name:'Quarter Side Window', explanation:'Es la ventana pequeña y fija que está al final del costado, atrás de la puerta trasera.', box:[74.62,78.12,24.5,31.83]},
  {id:14, scene:'side', class:'side-front-door', mask:'side-front-door', name:'Front Door', explanation:'Es la puerta del conductor (o del copiloto) para subir y bajar del carro.', box:[53.0,67.88,23.0,54.5]},
  {id:15, scene:'side', class:'side-mirrors', mask:'side-mirror', name:'Side Mirror', explanation:'Espejo del costado. Te deja ver lo que viene al lado y atrás del carro.', box:[53.62,60.5,29.5,34.33]},

  // --- rear ---
  {id:16, scene:'rear', class:'rear-valance', mask:'rear-valance', name:'Valance', explanation:'Es la pieza de abajo en la parte trasera, debajo del bumper. Cubre y da un mejor acabado a la parte baja del carro.', box:[26.62,71.5,64.67,72.17]},
  {id:17, scene:'rear', class:'rear-license-plate', mask:'rear-license-plate', name:'License Plate', explanation:'Es la placa del carro. Sirve para identificarlo y va en la parte trasera.', box:[43.12,55.0,55.67,64.17]},
  {id:18, scene:'rear', class:'rear-tailgate', mask:'rear-tailgate', name:'Tailgate', explanation:'Es la puerta de atrás, que se levanta para abrir la cajuela y meter o sacar cosas.', box:[27.0,70.88,28.33,50.33]},
  {id:19, scene:'rear', class:'rear-bumper', mask:'rear-bumper', name:'Rear Bumper', explanation:'Pieza atrás del carro que absorbe golpes leves al estacionarte o en un choque pequeño.', box:[16.62,80.88,38.5,71.83]},
  {id:20, scene:'rear', class:'rear-wiper-arm', mask:'rear-wiper-arm', name:'Rear Wiper and Arm', explanation:'Limpiaparabrisas de atrás: el brazo mueve la gomita para limpiar el vidrio trasero.', box:[48.5,61.88,25.5,27.33]},
  {id:21, scene:'rear', class:'rear-high-brake-light', mask:'rear-high-brake-light', name:'High Mounted Brake Light', explanation:'Tercera luz de freno, arriba del vidrio trasero. Se prende cuando frenas para avisar a quien viene atrás.', box:[42.38,55.62,7.33,9.0]},
  {id:22, scene:'rear', class:'rear-liftgate-handle', mask:'rear-liftgate-handle', name:'Liftgate Handle', explanation:'Es la manija para abrir la puerta trasera y alcanzar la cajuela.', box:[47.5,50.75,40.0,42.83]},
  {id:23, scene:'rear', class:'rear-window', mask:'rear-window', name:'Rear Window', explanation:'Es el vidrio de atrás. Te deja ver lo que hay detrás del carro.', box:[26.88,70.88,9.5,30.5]},
  {id:24, scene:'rear', class:'rear-taillights', mask:'rear-taillights', name:'Taillights', explanation:'Luces rojas traseras. Se prenden de noche y al frenar o dar vuelta para avisar a los demás.', box:[21.5,76.25,10.67,42.83]},
  {id:25, scene:'rear', class:'rear-reflectors', mask:'rear-reflectors', name:'Rear Reflectors', explanation:'Reflejantes en la parte trasera. Rebotan la luz de otros carros para que te vean de noche aunque las luces estén apagadas.', box:[21.75,76.25,57.83,63.5]},
];
const ALL_CARDS = RAW_CARDS.map(c => c.mask ? {...c, mask:`assets/masks/${c.mask}.png`} : c);

// Photos in the game, in the order Reseña walks through them. All six photos are in.
const ACTIVE_SCENES = ['front', 'side', 'rear'];
const CARDS = ALL_CARDS.filter(c => ACTIVE_SCENES.includes(c.scene));
const cardsForScene = scene => CARDS.filter(c => c.scene === scene);

// Safety net while you edit: tells you in the browser console (F12) if a card is mis-typed.
(function validateCards(){
  const seen = {};
  RAW_CARDS.forEach(c => {
    if(seen[c.id]) console.warn('Duplicate card id', c.id); seen[c.id] = true;
    if(!c.class || !PART_CLASSES[c.class]) console.warn('Card', c.id, c.name, 'has no valid class');
    if(!SCENES[c.scene]) console.warn('Card', c.id, 'has an unknown scene', c.scene);
    if(!Array.isArray(c.box) || c.box.length !== 4) console.warn('Card', c.id, 'has no box');
  });
})();
const MAX_HEARTS = 3;

// Look-around world. The sharp photo (and its masks) never changes size; a blurred extension of the
// photo is added around it so you can look past its edges.
// The car is fitted to the screen (FIT_FILL = how much of the screen width the car uses; the rest is the heart-pattern background).
// The menu slider only zooms IN: 0 = fitted, 1 = MAX_ZOOM times closer.
const FIT_FILL = 0.97, FIT_FILL_H = 0.78, MAX_ZOOM = 2.6;
let zoomIn = 0;   // set by the menu slider; resets to the fitted view every time a photo is shown

/* ================= 2. HIT-TESTING ================= */
// One invisible layer over the photo. A tap picks the part whose mask (or box, for parts without a
// mask yet) is under the finger, or the nearest one within FINGER_PX of it, so small parts stay easy to hit.

const FINGER_PX = 22;
const maskData = {};   // url -> {w,h,a:Uint8Array,area}  (null if unreadable)

function loadMask(url){
  if(url in maskData) return;
  maskData[url] = null;
  const img = new Image();
  img.onload = () => { try{
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d', {willReadFrequently:true}); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data, a = new Uint8Array(c.width * c.height);
    let area = 0;
    for(let i = 0; i < a.length; i++){ a[i] = d[i*4+3]; if(a[i] > 128) area++; }
    maskData[url] = {w:c.width, h:c.height, a, area};
  }catch(e){ maskData[url] = null; } };
  img.src = url;
}
CARDS.forEach(c => { if(c.mask) loadMask(c.mask); });

// Everything below is measured in one reference size (800 × 600) so it works the same on every photo,
// whatever its real resolution (dash.jpg is 1600 × 1200 but its masks are 800 × 600).
const REF_W = 800, REF_H = 600;

const dragSignal = on => document.dispatchEvent(new CustomEvent('viewerdrag', {detail:on}));

// distance (in reference px) from a point to the part, plus the part's area for tie-breaks
function distToCard(c, x, y, r){
  const m = c.mask && maskData[c.mask];
  if(m){
    const kx = m.w/REF_W, ky = m.h/REF_H;               // mask pixels per reference pixel
    const px = x*kx, py = y*ky, ix = Math.floor(px), iy = Math.floor(py), area = m.area/(kx*ky);
    if(ix >= 0 && iy >= 0 && ix < m.w && iy < m.h && m.a[iy*m.w+ix] > 128) return {d:0, area};
    let best = Infinity;
    const Rx = Math.ceil(r*kx), Ry = Math.ceil(r*ky),
          x0 = Math.max(0, ix-Rx), x1 = Math.min(m.w-1, ix+Rx), y0 = Math.max(0, iy-Ry), y1 = Math.min(m.h-1, iy+Ry);
    for(let yy = y0; yy <= y1; yy++) for(let xx = x0; xx <= x1; xx++){
      if(m.a[yy*m.w+xx] > 128){ const d = Math.hypot((xx+.5)/kx-x, (yy+.5)/ky-y); if(d < best) best = d; }
    }
    return {d:best, area};
  }
  const l = c.box[0]/100*REF_W, rr = c.box[1]/100*REF_W, t = c.box[2]/100*REF_H, b = c.box[3]/100*REF_H;   // no mask (or it failed to load): use the box
  return {d:Math.hypot(Math.max(l-x, 0, x-rr), Math.max(t-y, 0, y-b)), area:(rr-l)*(b-t)};
}

// nx, ny = where the tap landed on the photo (0..1) · cssWidth = how wide the photo is on screen
function hitTest(scene, nx, ny, cssWidth, preferId){
  const x = nx*REF_W, y = ny*REF_H, r = FINGER_PX/(cssWidth/REF_W);
  const near = [];
  cardsForScene(scene).forEach(c => { const h = distToCard(c, x, y, r); if(h.d <= r) near.push({card:c, d:h.d, area:h.area}); });
  if(!near.length) return null;
  const pref = near.find(n => n.card.id === preferId && n.d <= 0.5);
  if(pref) return pref.card;
  const inside = near.filter(n => n.d <= 0.5).sort((a, b) => a.area - b.area)[0];
  // inside a big part (e.g. the seat) but a much smaller part is within finger reach: take the small one
  const small = near.filter(n => n !== inside && (!inside || n.area < inside.area/6)).sort((a, b) => a.d - b.d)[0];
  if(inside) return (small || inside).card;
  // nothing under the finger: nearest wins, but big parts (seat) count as farther than small ones
  const eff = n => n.d * (1 + n.area/10000);
  return near.sort((a, b) => eff(a) - eff(b))[0].card;
}

/* ================= 3. LOOK-AROUND VIEWER ================= */

const areaOf = c => (c.box[1]-c.box[0]) * (c.box[3]-c.box[2]);

// The yellow highlight for a card (png mask, or a plain box when the part has no mask yet).
function highlightLayer(p, on){
  const cls = on ? ' on' : '';
  const sd = `--sd:${(p.box[0]*0.012).toFixed(2)}s`;   // shimmer ripples left → right across the photo (Reseña)
  if(p.mask) return `<img class="hl-img${cls}" data-id="${p.id}" src="${p.mask}" alt="" aria-hidden="true" draggable="false" style="${sd}" />`;
  const b = p.box;
  return `<div class="hl-box${cls}" data-id="${p.id}" style="left:${b[0]}%;top:${b[2]}%;width:${b[1]-b[0]}%;height:${b[3]-b[2]}%;${sd}"></div>`;
}

// The photo sits on the heart-pattern background (#flash in style.css). No blur, no zoom-out:
// the car is fitted and centred on the screen, and the slider only zooms IN from there.
const titleHTML = `<div class="tc-title"><span>Tuercas y</span><span>Calaveras</span></div>`;

function viewerHTML(scene, cards, allOn){
  const s = SCENES[scene];
  const layers = [...cards].sort((a, b) => areaOf(b) - areaOf(a)).map(c => highlightLayer(c, allOn)).join('');   // small parts on top
  return `<div class="viewer${allOn ? ' shimmer' : ''}" data-scene="${scene}">
      <div class="frame"><div class="world"><div class="photo"><img class="base" src="${s.image}" alt="${s.title}" draggable="false"/>${layers}</div></div></div>
      ${titleHTML}
      <div class="hud"></div><div class="sel-pill"></div><div class="look-hint">↔↕ Arrastra para mirar alrededor</div>
    </div>
    <button class="fab" data-action="menu" aria-label="Menú">☰</button>`;
}

let viewerCtl = null;
function mountViewer(onTap, getPrefer){
  const el = document.querySelector('.viewer'); if(!el) return null;
  const frame = el.querySelector('.frame'), world = el.querySelector('.world'), photo = el.querySelector('.photo'), scene = el.dataset.scene, sc = SCENES[scene], hint = el.querySelector('.look-hint'), ttl = el.querySelector('.tc-title');
  const [cl, cr, ct, cb] = sc.car;                                  // where the car is inside the photo (% of the photo)
  const carCx = (cl+cr)/200, carCy = (ct+cb)/200;                   // centre of the car, 0-1
  let vw = 0, vh = 0, Hf = 0, ft = 0, pw = 0, ph = 0, x = 0, y = 0, cx = carCx, cy = carCy, raf = 0;   // pw,ph = photo size on screen · cx,cy = which point of the photo is in the middle of the screen
  const sMix = () => Math.min(1, zoomIn*4);                        // 0 = fitted view (locked on the car) · 1 = free to look around
  // allowed positions per axis: the photo may not drift off the screen. At the fitted view the car is locked in the centre.
  const range = (view, size, home) => {
    const a = Math.min(0, view-size), b = Math.max(0, view-size), h = Math.min(b, Math.max(a, home)), s = sMix();
    return [h+(a-h)*s, h+(b-h)*s];
  };
  const homeX = () => vw/2-carCx*pw, homeY = () => Hf/2-carCy*ph;
  const clampX = v => { const [a, b] = range(vw, pw, homeX()); return Math.min(b, Math.max(a, v)); };
  const clampY = v => { const [a, b] = range(Hf, ph, homeY()); return Math.min(b, Math.max(a, v)); };
  const clamp = () => { x = clampX(x); y = clampY(y); };
  const placeTitle = () => {
    if(!ttl) return;
    const top = Math.max(52, ft - ttl.offsetHeight + 30);           // sits on the top edge of the picture frame, overlapping it a little
    ttl.style.top = top + 'px';
    ttl.style.opacity = String(Math.max(0, 1 - zoomIn*5));          // fades away once you zoom in
  };
  const apply = () => { world.style.transform = `translate3d(${x}px,${y}px,0)`; placeTitle(); };
  const syncCenter = () => { cx = (vw/2-x)/pw; cy = (Hf/2-y)/ph; };
  function layout(){
    vw = el.clientWidth; vh = el.clientHeight; if(!vw || !vh) return;
    // every view uses the SAME picture frame (full width, same height), so Front / Side / Rear look uniform.
    // Each photo is scaled to fit its own car, then cropped to that frame with the car centred in it.
    const fitK = id => { const c = SCENES[id], cw = (c.car[1]-c.car[0])/100*c.w, ch = (c.car[3]-c.car[2])/100*c.h; return Math.min(vw*FIT_FILL/cw, vh*FIT_FILL_H/ch); };
    let H0 = Infinity, need = 0;
    Object.keys(ACTIVE_SCENES.length ? Object.fromEntries(ACTIVE_SCENES.map(i => [i, 1])) : SCENES).forEach(id => {
      const c = SCENES[id], k0 = fitK(id), cy0 = (c.car[2]+c.car[3])/200;
      H0 = Math.min(H0, 2*c.h*k0*Math.min(cy0, 1-cy0));                 // tallest frame that still keeps this car centred inside its photo
      need = Math.max(need, (c.car[3]-c.car[2])/100*c.h*k0*1.04);       // …but never shorter than the tallest car
    });
    H0 = Math.min(vh, Math.max(H0, need));
    const kFit = fitK(scene), k = kFit*(1 + zoomIn*(MAX_ZOOM-1)); pw = sc.w*k; ph = sc.h*k;
    Hf = Math.min(vh, H0 + (ph - sc.h*kFit));                           // the frame only grows when you zoom in
    ft = (vh-Hf)/2; frame.style.top = ft+'px'; frame.style.height = Hf+'px';
    world.style.width = pw+'px'; world.style.height = ph+'px';
    x = vw/2-cx*pw; y = Hf/2-cy*ph; clamp(); apply(); syncCenter();
  }
  layout(); new ResizeObserver(layout).observe(el);
  document.fonts?.ready.then(() => { placeTitle(); });

  let down = null, moved = false, vx = 0, vy = 0, lt = 0, sx = 0, sy = 0, lx = 0, ly = 0, downAt = 0;
  el.addEventListener('pointerdown', e => {
    // a finger that never reported "up" (call, notification, app switch…) must not lock the screen for good
    if(down !== null && performance.now()-downAt < 1500) return;
    down = e.pointerId; downAt = performance.now(); moved = false; vx = vy = 0; cancelAnimationFrame(raf);
    sx = lx = e.clientX; sy = ly = e.clientY; lt = performance.now();
    try{ el.setPointerCapture(e.pointerId); }catch(err){}
  });
  el.addEventListener('pointermove', e => {
    if(e.pointerId !== down) return;
    if(!moved && Math.hypot(e.clientX-sx, e.clientY-sy) > (e.pointerType === 'mouse' ? 6 : 10)){ moved = true; hint.classList.add('gone'); dragSignal(true); }   // fingers wobble: a bit more slack than a mouse
    if(!moved) return;
    const dx = e.clientX-lx, dy = e.clientY-ly, now = performance.now(), dt = Math.max(1, now-lt);
    x += dx; y += dy; clamp(); apply(); vx = dx/dt*16; vy = dy/dt*16; lx = e.clientX; ly = e.clientY; lt = now;
  });
  const cancel = e => { if(e.pointerId === down){ down = null; cancelAnimationFrame(raf); syncCenter(); dragSignal(false); } };   // browser took the touch away (long-press menu, system gesture): not a tap
  const end = e => {
    if(e.pointerId !== down) return;
    down = null;
    if(moved) dragSignal(false);
    if(!moved){   // a tap — measured against the sharp photo, so masks/boxes stay exactly where they were drawn
      const fr = frame.getBoundingClientRect();
      if(e.clientX < fr.left || e.clientX > fr.right || e.clientY < fr.top || e.clientY > fr.bottom){ onTap(null, e); return; }   // tapped the heart background
      const r = photo.getBoundingClientRect();
      onTap(hitTest(scene, (e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height, r.width, getPrefer ? getPrefer() : undefined), e);
      return;
    }
    const glide = () => {
      vx *= .94; vy *= .94;
      if(Math.abs(vx) < .2 && Math.abs(vy) < .2){ syncCenter(); return; }
      x += vx; y += vy; clamp(); apply(); raf = requestAnimationFrame(glide);
    };
    if(performance.now()-lt < 80) glide(); else syncCenter();
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', cancel); el.addEventListener('lostpointercapture', cancel);
  el.addEventListener('dragstart', e => e.preventDefault());
  el.addEventListener('contextmenu', e => e.preventDefault());   // long-press on a phone would open the image menu and cancel the touch

  viewerCtl = { relayout: layout, lookAt(p){   // smoothly pan so a part is centred (only does something once you have zoomed in)
    cancelAnimationFrame(raf);
    const tx = vw/2-(p.box[0]+p.box[1])/200*pw, ty = Hf/2-(p.box[2]+p.box[3])/200*ph, x0 = x, y0 = y, t0 = performance.now();
    const step = n => {
      const k = Math.min(1, (n-t0)/450), e = 1-Math.pow(1-k, 3);
      x = x0+(clampX(tx)-x0)*e; y = y0+(clampY(ty)-y0)*e; apply();
      if(k < 1) raf = requestAnimationFrame(step); else syncCenter();
    };
    raf = requestAnimationFrame(step);
  } };
  return viewerCtl;
}

/* ================= 4. STATE + SOUNDS ================= */

const state = {screen:'home', sceneIndex:0, exam:[], examIndex:0, score:0, hearts:MAX_HEARTS, mistakes:[], selected:null, answerLocked:false};
const app = document.getElementById('app');
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[m]));
const heartsText = () => '♥'.repeat(state.hearts) + '♡'.repeat(MAX_HEARTS - state.hearts);

const sfxCache = {};
function sfx(file, vol = 1){
  try{
    const base = sfxCache[file] || (sfxCache[file] = Object.assign(new Audio('assets/sounds/'+file), {preload:'auto'}));
    const a = base.cloneNode(true); a.volume = vol; a.play().catch(() => {});
  }catch(e){}
}
let actx = null;
const Sound = {
  correct:     () => sfx('correct-bell.wav', .9),
  wrong:       () => sfx('wrong-bell.wav', .9),
  pageForward: () => sfx('page-forward.wav', .9),
  pageBack:    () => sfx('page-back.wav', .9),
  countdown:   () => sfx('countdown.mp3', 1),
  pop:         () => sfx('pop.wav', .7),
  next:        () => { sfx('whoosh.wav', .8); setTimeout(() => sfx('pop.wav', .7), 110); setTimeout(() => sfx('ding.wav', .8), 200); },
  tick:        () => {   // short synthesized clock tick
    try{
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if(actx.state === 'suspended') actx.resume();
      const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'square'; o.frequency.value = 900;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t+.004); g.gain.exponentialRampToValueAtTime(.0001, t+.07);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t+.09);
    }catch(e){}
  },
};
const play = name => { try{ Sound[name]?.(); }catch(e){} };

/* ================= 5. SCREENS + POPUPS ================= */

const ICON = {book:'▤', play:'▶', home:'⌂'};
const setBodyCam = on => document.body.classList.toggle('cam', on);

function renderHome(){
  app.innerHTML = `<section class="home">
    <button class="big-btn review" data-action="review">Reseña</button>
    <button class="big-btn exam" data-action="exam">Examen</button>
  </section>`;
}

function closePops(){
  document.querySelectorAll('.explain-overlay').forEach(o => o.remove());
  document.querySelectorAll('.hl-img.focus,.hl-box.focus').forEach(h => h.classList.remove('focus'));
}
function popup(html, {lock = false} = {}){
  closePops();
  const o = document.createElement('div'); o.className = 'explain-overlay';
  o.innerHTML = `<div class="cloud-backdrop" ${lock ? '' : 'data-action="closeExplanation"'}></div><div class="pop-card">${html}</div>`;
  o._born = performance.now(); document.body.appendChild(o); return o;
}
// bottom "cloud" sheet used for part explanations
// Dudu (Bedu) dance sticker: assets/dudu-dance.gif is a normal transparent GIF. If the file is ever missing a little bear emoji stands in.
const DUDU_FILE = 'assets/dudu-dance.gif';
const gifFace = () => `<div class="gif-face"><img src="${DUDU_FILE}" alt="" draggable="false" data-dudu="1"></div>`;
const gifFallback = () => '<span class="dudu-fallback">🐻</span>';
function cloudSheet(tag, title, text, btnLabel, btnAction){
  closePops();
  const o = document.createElement('div'); o.className = 'explain-overlay sheet';
  o.innerHTML = `<div class="cloud-backdrop" data-action="closeExplanation"></div><div class="cloud-card">${gifFace()}<div class="cloud-body"><div class="mini-tag">${esc(tag)}</div><h2>${esc(title)}</h2><p>${esc(text)}</p><button class="yellow-btn" data-action="${btnAction}">${btnLabel}</button></div></div>`;
  o._born = performance.now(); document.body.appendChild(o);
}

// Draws a photo full-screen. hud = text in the little top-left pill.
function showScene(scene, {hud = '', allOn = false, onTap = () => {}, getPrefer} = {}){
  removeQCard();
  setBodyCam(true); zoomIn = 0;
  app.innerHTML = viewerHTML(scene, cardsForScene(scene), allOn);
  $('.hud').innerHTML = hud;
  return mountViewer(onTap, getPrefer);
}

function setZoom(t){
  zoomIn = Math.min(1, Math.max(0, t));
  if(viewerCtl && document.querySelector('.viewer')) viewerCtl.relayout();
}
const zoomRowHTML = () => document.querySelector('.viewer') ? `<div class="zoom-row">
      <label class="zoom-title" for="zoomSlider">🔍 Zoom</label>
      <input id="zoomSlider" class="zoom-slider" type="range" min="0" max="100" step="1" value="${Math.round(zoomIn*100)}" aria-label="Acercar la foto"/>
      <div class="zoom-ends"><span>Normal</span><span>Cerca</span></div>
    </div>` : '';

function menuPopup(){
  play('pageForward');
  const inExam = state.screen === 'exam', inReview = state.screen === 'review';
  popup(`<div class="mini-tag">KIA SOUL · CAR BODY</div><h2>Menú</h2>
    ${zoomRowHTML()}
    ${inExam ? `<div class="pop-stat"><span class="progress-pill">${state.examIndex+1}/${state.exam.length}</span><span class="hearts">${heartsText()}</span></div>` : ''}
    <div class="pop-col">
      <button class="${inReview ? 'yellow-btn' : 'secondary-btn'}" data-action="review">${ICON.book} Reseña</button>
      <button class="${inExam ? 'yellow-btn' : 'secondary-btn'}" data-action="exam">${ICON.play} Examen</button>
      <button class="secondary-btn" data-action="mistakes">Review all the mistakes</button>
      <button class="secondary-btn" data-action="home">${ICON.home} Inicio</button>
      <button class="secondary-btn" data-action="howto">❓ Cómo funciona</button>
      <button class="secondary-btn" data-action="closeExplanation">Seguir mirando</button>
    </div>`);
}

function home(){ removeQCard(); setBodyCam(false); state.screen = 'home'; renderHome(); }

const CAM_SCREENS = ['review', 'exam', 'results', 'mistakes'];
function render(){
  setBodyCam(CAM_SCREENS.includes(state.screen));
  ({home:renderHome, review:renderReview, exam:renderExam, results:renderResults, mistakes:renderMistakes})[state.screen]?.();
}

/* ================= 6. RESEÑA ================= */
const SHIMMER_IDLE = {review:5, exam:10};   // seconds without touching before every highlight shimmers again
let lastTouch = performance.now();

function renderReview(){
  const scene = ACTIVE_SCENES[state.sceneIndex % ACTIVE_SCENES.length], multi = ACTIVE_SCENES.length > 1;
  showScene(scene, {
    hud: `<span class="h">RESEÑA</span> · ${esc(SCENES[scene].title)}`,
    allOn: true,
    onTap: hit => { if(hit) showExplanation(hit); },
  });
  lastTouch = performance.now() - SHIMMER_IDLE.review*1000 + 700;   // first shimmer ~0.7 s after the photo appears
  if(multi){   // "¿Sigamos?" = next base photo
    app.insertAdjacentHTML('beforeend', '<button class="yellow-btn next-btn" data-action="nextReview">¿Sigamos?</button>');
    $('.look-hint').classList.add('above');
  }
}

function showExplanation(p){
  play('correct');
  cloudSheet(SCENES[p.scene].title, p.name, p.explanation, 'Tap to exit', 'closeExplanation');
  document.querySelectorAll(`.world [data-id="${p.id}"]`).forEach(h => h.classList.add('focus'));
}

/* ================= 7. EXAMEN ================= */
// Every part (every class in PART_CLASSES) is asked exactly once, in random order.
// For each part the game picks one of the photos that shows it at random, so the steering wheel can come up on
// any photo that has one. A tap on ANY card of that class on that photo is correct.

const rand = n => Math.floor(Math.random() * n);
function shuffle(list){
  const a = [...list];
  for(let i = a.length-1; i > 0; i--){ const j = rand(i+1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function buildExam(){
  const byClass = {};
  CARDS.forEach(c => (byClass[c.class] = byClass[c.class] || []).push(c));
  return shuffle(Object.keys(byClass)).map(cls => ({cls, name:PART_CLASSES[cls] || byClass[cls][0].name, card:byClass[cls][rand(byClass[cls].length)]}));
}
const currentPart = () => state.exam[state.examIndex];   // {cls, name, card}: card = the photo/mask shown this time

function startExam(){
  Object.assign(state, {exam:buildExam(), examIndex:0, score:0, hearts:MAX_HEARTS, mistakes:[], selected:null, answerLocked:true, screen:'exam'});
  renderExam({intro:true});
}

// ---- 3, 2, 1, GO! intro (pink dim + Friday Night Funkin' countdown, same as Sigamos) ----
let introEl = null, introTimers = [];
const CD = {ready:1.24, set:1.8, go:2.4, end:3.1};   // beat times of countdown.mp3, in seconds
function introAt(fn, sec){ introTimers.push(setTimeout(fn, sec*1000)); }
const fnfHTML = text => `<b class="fo">${text}</b><b class="ff">${text}</b>`;   // black comic outline under the coloured fill
function fnfWord(text, cls){
  if(!introEl) return;
  introEl.querySelector('.fnf-word')?.remove();
  const w = document.createElement('div');
  w.className = 'fnf-word ' + cls; w.innerHTML = fnfHTML(text);
  introEl.appendChild(w);
}
function openScrim(){   // the pink overlay alone (it is already there when the eye opens)
  introTimers.forEach(clearTimeout); introTimers = []; introEl?.remove();
  introEl = document.createElement('div'); introEl.className = 'intro-scrim';
  document.body.appendChild(introEl);
}
function beginIntro(onDone){
  if(!introEl) openScrim();
  play('countdown');
  introAt(() => fnfWord('¡Preparados!', 'ready'), CD.ready);
  introAt(() => fnfWord('Listos', 'set'), CD.set);
  introAt(() => fnfWord('¡GO!', 'go'), CD.go);
  introAt(() => endIntro(onDone), CD.end);
}
function endIntro(onDone){
  const el = introEl; introEl = null; introTimers = [];
  if(el){ el.classList.add('out'); setTimeout(() => el.remove(), 500); }
  onDone();
}

function examHud(){ return `<span class="h">${heartsText()}</span> ${state.examIndex+1}/${state.exam.length} · ${esc(currentPart().name)}`; }
function updateHud(){ const h = $('.hud'); if(h) h.innerHTML = examHud(); }

// The "identification card": white, with a red / yellow / blue border that cycles question after question.
// It slides up from the bottom (1.2 s), stays 1 s, slides down into a small card that only shows the part's name
// (where the "Arrastra para mirar" hint sits), stays fully visible for 1 s, then fades to 50 %. While the player drags the photo
// it drops to 20 %. It has no buttons and ignores touches, so it can never get in the way.
const Q_TIME = {up:1200, hold:1000, shrink:800, full:1000};   // ms
let qTimers = [], qDragOff = 0;
const qAt = (fn, ms) => qTimers.push(setTimeout(fn, ms));
function removeQCard(){ qTimers.forEach(clearTimeout); qTimers = []; document.querySelector('.q-card')?.remove(); }
function showQCard(){
  removeQCard();
  const q = currentPart(), n = state.examIndex;
  const el = document.createElement('div');
  el.className = 'q-card c' + (n % 3);                                  // c0 red · c1 yellow · c2 blue
  el.innerHTML = `<div class="q-tag">${n+1}/${state.exam.length} · FIND THIS PART</div><div class="q-name">${esc(q.name)}</div><div class="q-help">Toca la parte para marcarla en amarillo.<br>Tócala otra vez para confirmar.</div>`;
  document.body.appendChild(el);
  qAt(() => el.classList.add('min'), Q_TIME.up + Q_TIME.hold);
  qAt(() => el.classList.add('dim'), Q_TIME.up + Q_TIME.hold + Q_TIME.shrink + Q_TIME.full);
}
// the viewer says when the player starts / stops dragging the photo
document.addEventListener('viewerdrag', e => {
  const c = document.querySelector('.q-card'); if(!c) return;
  clearTimeout(qDragOff);
  if(e.detail) c.classList.add('drag'); else qDragOff = setTimeout(() => document.querySelector('.q-card')?.classList.remove('drag'), 500);
});

let pendingCountdown = null;   // starts 3, 2, 1, GO! (called when the eye has opened)
function renderExam({intro = false} = {}){
  const q = currentPart(); state.selected = null;
  showScene(q.card.scene, {
    hud: examHud(),
    getPrefer: () => state.selected || undefined,
    onTap: hit => {
      if(state.answerLocked) return;
      if(!hit){ setSelected(null); return; }
      if(state.selected === hit.id){ hit.class === q.cls ? answerExam() : wrongExam(); }   // second tap = final answer · same class = correct
      else { setSelected(hit.id); play('pop'); }                                           // first tap = show yellow mask
    },
  });
  $('.look-hint')?.remove();   // the little name card takes the hint's place
  if(intro){
    state.answerLocked = true;
    openScrim();   // pink overlay shows first; the countdown starts once the eye has opened
    pendingCountdown = () => { pendingCountdown = null; beginIntro(() => { state.answerLocked = false; shimmerNow(); showQCard(); }); };   // after 3, 2, 1, GO!: every mask shimmers and the card slides up
  } else showQCard();
}

function setSelected(id){
  state.selected = id;
  document.querySelectorAll('.world .hl-img,.world .hl-box').forEach(h => h.classList.toggle('on', Number(h.dataset.id) === id));
  const pill = $('.sel-pill'); if(pill){ pill.textContent = 'Toca otra vez para confirmar'; pill.classList.toggle('on', id !== null); }
}

// little message in the middle of the screen
function flash(html, cls, ms, then){
  const f = document.createElement('div'); f.className = 'feedback';
  f.innerHTML = `<div class="bubble ${cls}">${html}</div>`; document.body.appendChild(f);
  setTimeout(() => { f.remove(); then(); }, ms);
}

function answerExam(){
  if(state.answerLocked) return;
  state.answerLocked = true; state.score++; play('correct');
  showPraise(); burst('💗', 18);
  setTimeout(nextExam, 850);
}

function wrongExam(){
  if(state.answerLocked) return;
  const p = currentPart();
  state.answerLocked = true; state.hearts = Math.max(0, state.hearts-1); play('wrong'); updateHud();
  if(!state.mistakes.some(m => m.class === p.card.class)) state.mistakes.push(p.card);
  flash(`Try again!<small>${esc(p.name)}</small>`, 'bad', 700, () => {
    if(state.hearts === 0){ state.screen = 'results'; render(); return; }   // out of hearts: game over
    state.answerLocked = false; setSelected(null); updateHud();
  });
}

function nextExam(){
  if(state.examIndex >= state.exam.length-1){ state.screen = 'results'; render(); return; }
  state.examIndex++; state.answerLocked = false; state.selected = null; render(); play('next');
}

function renderResults(){
  showScene(currentPart().card.scene);
  const tried = state.examIndex + 1, lost = state.hearts === 0;
  popup(`<div style="font-size:3.4rem">🏁</div><h2>${lost ? '¡Te quedaste sin vidas!' : '¡Terminaste!'}</h2><div class="result-score">${state.score}/${tried}</div><p>Acertaste ${state.score} tarjetas.</p>
    <div class="pop-col"><button class="yellow-btn" data-action="exam">Jugar otra vez</button>${state.mistakes.length ? `<button class="secondary-btn" data-action="mistakes">Review all the mistakes (${state.mistakes.length})</button>` : ''}<button class="secondary-btn" data-action="home">${ICON.home} Inicio</button></div>`, {lock:true});
}

// Praise word + heart explosion for a correct answer
const PRAISE = ['Sweet!', 'Correcto', 'Genial', 'ANG GALING', 'AWESOME', 'COOL', 'GREAT', 'Chido', 'QUE PADRE', 'PADRISIMO'];
const PRAISE_COLORS = ['#ff617f', '#ff9f43', '#62b66f', '#a05cff', '#4ca6ff', '#ff4e7a', '#f2b600'];
const pick = list => list[rand(list.length)];

function showPraise(){
  const p = document.createElement('div');
  p.className = 'praise'; p.textContent = pick(PRAISE); p.style.color = pick(PRAISE_COLORS);
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 700);
}

function burst(symbol, n){
  let root = $('#burst');
  if(!root){ root = document.createElement('div'); root.id = 'burst'; root.className = 'burst'; document.body.appendChild(root); }
  for(let i = 0; i < n; i++){
    const x = document.createElement('span');
    x.className = 'particle'; x.textContent = symbol;
    x.style.left = (50 + Math.random()*10 - 5) + '%';
    x.style.top = (42 + Math.random()*12 - 6) + '%';
    x.style.setProperty('--dx', (Math.random()*360 - 180) + 'px');
    x.style.setProperty('--dy', (Math.random()*460 - 230) + 'px');
    x.style.setProperty('--r', (Math.random()*540 - 270) + 'deg');
    x.style.animationDelay = (Math.random()*0.15) + 's';
    root.appendChild(x);
    setTimeout(() => x.remove(), 1300);
  }
}

/* ================= 8. MISTAKES ================= */

function renderMistakes(){
  state.screen = 'mistakes';
  showScene(state.mistakes[0]?.scene || ACTIVE_SCENES[0], {hud:'<span class="h">MISTAKES</span>'});
  showMistakeList();
}

function showMistakeList(){
  document.querySelectorAll('.world .on').forEach(h => h.classList.remove('on'));
  const buttons = `<div class="pop-col"><button class="secondary-btn" data-action="home">${ICON.home} Inicio</button><button class="secondary-btn" data-action="closeExplanation">Seguir mirando</button></div>`;
  if(!state.mistakes.length){ popup(`<div class="mini-tag">REVIEW</div><h2>Mistakes</h2><p>¡Sin errores por ahora! 🎉</p>${buttons}`); return; }
  popup(`<div class="mini-tag">REVIEW</div><h2>Mistakes</h2><p>Toca una tarjeta para ver la parte resaltada.</p>
    <div class="pop-list">${state.mistakes.map(p => `<button class="mistake-card" data-action="mistakeOpen" data-id="${p.id}"><span class="mistake-icon">☁️</span><span class="mistake-name">${esc(p.name)}</span><small>${esc(SCENES[p.scene].title)}</small></button>`).join('')}</div>${buttons}`);
}

function openMistake(id){
  const p = state.mistakes.find(m => m.id === id); if(!p) return;
  closePops();
  if($('.viewer')?.dataset.scene !== p.scene) showScene(p.scene, {hud:'<span class="h">MISTAKES</span>'});   // mistake is on another photo
  document.querySelectorAll('.world .hl-img,.world .hl-box').forEach(h => h.classList.toggle('on', Number(h.dataset.id) === p.id));
  viewerCtl?.lookAt(p);
  cloudSheet('REVIEW', p.name, p.explanation, 'Volver', 'mistakes');
  play('pageForward');
}

/* ================= 9. SHIMMER + WIRING ================= */
// Every highlight on the photo shimmers (a quick ripple left → right) when the player has not touched the screen for a while:
// Reseña every 5 s, Examen every 10 s. In Examen it also plays once right after the 3, 2, 1, GO! (when the first question closes).
// (SHIMMER_IDLE / lastTouch are declared in section 6, above, because Reseña uses them first.)
let flashTimer = 0;
function shimmerNow(){
  const v = $('.viewer'); if(!v) return;
  v.classList.remove('flash'); void v.offsetWidth; v.classList.add('flash');
  clearTimeout(flashTimer); flashTimer = setTimeout(() => v.classList.remove('flash'), 2700);
  lastTouch = performance.now();
}
const touched = () => { lastTouch = performance.now(); };
['pointerdown', 'pointermove', 'keydown', 'wheel'].forEach(ev => document.addEventListener(ev, touched, {capture:true, passive:true}));
const canShimmer = () => $('.viewer') && !introEl && !state.answerLocked && !document.hidden && !document.querySelector('.explain-overlay');
setInterval(() => {
  const sec = SHIMMER_IDLE[state.screen];
  if(sec && performance.now()-lastTouch >= sec*1000 && canShimmer()) shimmerNow();
}, 500);

// if a mask picture is missing, that part falls back to a yellow box so it is never invisible
document.addEventListener('error', e => {
  const t = e.target; if(!t || t.tagName !== 'IMG') return;
  if(t.dataset.dudu){ t.parentElement.innerHTML = gifFallback(); return; }   // no assets/dudu-dance.gif yet
  if(!t.classList.contains('hl-img')) return;
  const c = CARDS.find(c => String(c.id) === t.dataset.id); if(!c) return;
  t.outerHTML = highlightLayer({...c, mask:null}, t.classList.contains('on'));
}, true);

document.addEventListener('input', e => { if(e.target.classList && e.target.classList.contains('zoom-slider')) setZoom(e.target.value/100); });

/* ================= 10. THE EYE (screen transitions) ================= */
// Two white blocks. They close from top and bottom, the screen is swapped while they are shut, then they open from the middle like an eye.
const eye = document.getElementById('eye'), EYE_MS = 520;
const wait = ms => new Promise(r => setTimeout(r, ms));
let eyeBusy = false;
function clearOverlays(){   // everything that belongs to the screen we are leaving
  closePops(); CarIntro.close(); removeQCard();
  introTimers.forEach(clearTimeout); introTimers = []; introEl?.remove(); introEl = null; pendingCountdown = null;
  document.querySelectorAll('.feedback,.praise,.burst').forEach(n => n.remove());
}
async function eyeSwap(change, after){
  if(eyeBusy) return; eyeBusy = true;
  eye.classList.add('busy', 'closed'); await wait(EYE_MS + 60);
  try{ change(); }catch(err){ console.error(err); }
  await wait(200);
  eye.classList.remove('closed'); await wait(EYE_MS + 60);
  eye.classList.remove('busy'); eyeBusy = false;
  try{ after && after(); }catch(err){ console.error(err); }
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if(!el) return;
  // The "click" that finishes the very tap that opened a popup lands on the popup's backdrop and used to close it
  // again instantly (the sheet flashed and vanished). Clicks in the first moments of a popup's life are ignored.
  const ov = el.closest('.explain-overlay'); if(ov && performance.now() - (ov._born || 0) < 400) return;
  switch(el.dataset.action){
    case 'menu':             menuPopup(); break;
    case 'closeExplanation': closePops(); break;
    case 'home':             play('pageBack'); eyeSwap(() => { clearOverlays(); home(); }); break;
    case 'review':           play('pageForward'); { const first = !CarIntro.seen();
                               eyeSwap(() => { clearOverlays(); state.screen = 'review'; state.sceneIndex = 0; render(); if(first) CarIntro.mount(); }, () => { if(first) CarIntro.start(); }); } break;
    case 'nextReview':       closePops(); state.sceneIndex = (state.sceneIndex+1) % ACTIVE_SCENES.length; render(); play('next'); break;
    case 'exam':             eyeSwap(() => { clearOverlays(); startExam(); }, () => pendingCountdown?.()); break;   // eye shuts → pink overlay is set up → eye opens → 3, 2, 1, GO!
    case 'howto':            closePops(); CarIntro.show(); break;
    case 'mistakes':
      if(state.screen === 'mistakes' && $('.viewer')) showMistakeList();
      else eyeSwap(() => { clearOverlays(); state.screen = 'mistakes'; render(); });
      break;
    case 'mistakeOpen':      openMistake(Number(el.dataset.id)); break;
  }
});

renderHome();
// when the page starts the eye is shut (white), then it opens on the home screen
Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(1200)]).then(() => wait(250)).then(() => { eye.classList.remove('closed'); setTimeout(() => eye.classList.remove('busy'), EYE_MS + 80); });
