/*
  INSTRUMENT CLUSTER — photographic flashcard app (same game as the Kia Soul one)
  Language: Mexican Spanish UI, English component names.
  ONE panorama photo with 3 sides you swipe between: left · centre · right.
  Photo: assets/base/   Masks: assets/masks/   Sounds: assets/sounds/

  Sections: 1 data · 2 hit-testing · 3 viewer · 4 sounds · 5 popups · 6 reseña · 7 examen · 8 mistakes · 9 wiring
*/

/* ================= 1. DATA ================= */

// One panorama. sides = where the photo is centred on each of the 3 sides you swipe between
// (fraction of the photo's width, left → right). sideNames show on the explanation card.
const SCENES = {
  cluster: {image:'assets/base/cluster.jpg', w:1584, h:672, title:'Instrument Cluster',
            sides:[0.293, 0.502, 0.715], sideNames:['Lado izquierdo', 'Centro', 'Lado derecho']},
};

/*
  PARTS LIST — the "class" of every indicator.
  Examen asks for each class once (here every light is its own class). If the same part ever shows up
  more than once, give those cards the same class and a tap on any of them counts as correct.
*/
const PART_CLASSES = {
  "key-out": "KEY OUT Indicator Light",
  "position-lights": "Light ON Indicator Light",
  "high-beam": "High Beam Indicator",
  "seat-belt": "Seat Belt Warning Light",
  "fog-light": "Front Fog Light Indicator",
  "airbag": "Airbag Warning Light",
  "brake-warning": "Parking Brake & Brake Fluid Warning Light",
  "battery": "Charging System Warning Light",
  "eco": "ECO Mode / Drive Mode Indicator",
  "check-engine": "Fuel Cap / Malfunction Indicator (Check Engine Light)",
  "oil-pressure": "Engine Oil Pressure Warning Light",
  "left-turn": "Turn Signal Indicator (Left)",
  "door-ajar": "Door Ajar Warning Light",
  "trunk-open": "Liftgate Open Warning Light",
  "power-steering": "Electronic Power Steering Warning Light",
  "right-turn": "Turn Signal Indicator (Right)",
  "sport": "Drive Mode Indicator (SPORT)",
  "normal": "Drive Mode Indicator (NORMAL)",
  "comfort": "Drive Mode Indicator (COMFORT)",
  "cruise": "Cruise Indicator Light",
  "set": "Cruise SET Indicator Light",
  "coolant-temp": "Engine Coolant Temperature Warning Light",
  "green-car-outline": "Sunroof Open Warning Light",
  "green-car-solid": "Immobilizer Indicator Light",
  "red-exhaust": "Fuel Cap Open Warning Indicator",
  "tpms": "Low Tire Pressure Light / TPMS Malfunction Indicator",
  "fuel": "Low Fuel Level Warning Light",
  "esc": "Electronic Stability Control (ESC) Indicator",
  "esc-off": "Electronic Stability Control (ESC) OFF Indicator",
  "abs": "Anti-lock Braking System (ABS) Warning Light",
  "tachometer": "Tachometer",
  "speedometer": "Speedometer",
  "gear-shift": "Gear Shift Position",
  "odometer": "Odometer",
  "trip-mode": "Trip Mode",
  "trip-mileage": "Trip Mileage",
  "engine-temp-gauge": "Engine Temperature Gauge",
  "fuel-gauge": "Fuel Gauge",
  "exterior-temp": "Exterior Temperature",
  "lcd-display": "LCD Display",
};

/*
  One entry per card.  class = key from PART_CLASSES.
  lit  = the glowing picture of the light (transparent PNG, glow kept), placed on litBox = [left %, right %, top %, bottom %] of the photo.
  mask = invisible tap area (cropped to box = [left %, right %, top %, bottom %]); it is never drawn, it only decides what a tap hits.
*/
const RAW_CARDS = [
  {id:1, scene:'cluster', class:"key-out", mask:"cluster-key-out", lit:"cluster-key-out", litBox:[22.9167, 25.8207, 41.8155, 49.256], name:"KEY OUT Indicator Light", explanation:"Se enciende cuando el auto no detecta la llave inteligente dentro de la cabina. Revisa que la traigas contigo antes de apagar el motor o bajarte.", box:[23.3586, 25.4419, 43.006, 48.2143]},
  {id:2, scene:'cluster', class:"position-lights", mask:"cluster-position-lights", lit:"cluster-position-lights", litBox:[27.6515, 31.0606, 52.2321, 58.4821], name:"Light ON Indicator Light", explanation:"Se prende en verde cuando las luces de posición o los faros están encendidos. Apágalos al bajarte del auto para no dejar la batería sin carga.", box:[28.0303, 30.4924, 53.2738, 57.4405]},
  {id:3, scene:'cluster', class:"high-beam", mask:"cluster-high-beam", lit:"cluster-high-beam", litBox:[30.2399, 33.5859, 51.9345, 58.4821], name:"High Beam Indicator", explanation:"Se enciende en azul cuando traes las luces altas. Cámbialas a bajas cuando venga otro auto de frente o vayas detrás de alguien, para no deslumbrarlo.", box:[30.6818, 32.9545, 52.9762, 57.5893]},
  {id:4, scene:'cluster', class:"seat-belt", mask:"cluster-seat-belt", lit:"cluster-seat-belt", litBox:[23.9899, 27.0202, 56.25, 63.6905], name:"Seat Belt Warning Light", explanation:"Avisa que el conductor o algún pasajero no se ha abrochado el cinturón de seguridad. Se apaga cuando todos se lo ponen.", box:[24.6843, 26.6414, 57.2917, 62.7976]},
  {id:5, scene:'cluster', class:"fog-light", mask:"cluster-fog-light", lit:"cluster-fog-light", litBox:[29.4192, 32.0076, 56.6964, 62.7976], name:"Front Fog Light Indicator", explanation:"Indica que los faros de niebla delanteros están encendidos. Úsalos solo con niebla, lluvia fuerte o poca visibilidad.", box:[29.5455, 31.8813, 57.1429, 62.5]},
  {id:6, scene:'cluster', class:"airbag", mask:"cluster-airbag", lit:"cluster-airbag", litBox:[23.9268, 26.2626, 62.0536, 68.6012], name:"Airbag Warning Light", explanation:"Se prende unos segundos al arrancar y se apaga. Si se queda encendida o se prende mientras manejas, hay una falla en el sistema de bolsas de aire: llévalo a revisar.", box:[24.1162, 26.3258, 62.6488, 68.1548]},
  {id:7, scene:'cluster', class:"brake-warning", mask:"cluster-brake-warning", lit:"cluster-brake-warning", litBox:[26.5152, 29.4823, 61.4583, 68.8988], name:"Parking Brake & Brake Fluid Warning Light", explanation:"Se enciende si el freno de mano está puesto o si el líquido de frenos está bajo. Si ya lo quitaste y sigue prendida, detente y revisa los frenos. Si se prende junto con ABS, puede ser una falla del EBD (distribución electrónica de frenado).", box:[26.5152, 29.2929, 62.5, 67.8571]},
  {id:8, scene:'cluster', class:"battery", mask:"cluster-battery", lit:"cluster-battery", litBox:[29.9242, 32.7652, 61.756, 68.6012], name:"Charging System Warning Light", explanation:"Indica una falla en el sistema de carga: la batería o el alternador no están cargando bien. Si se prende mientras manejas, llévalo a revisar antes de que se quede sin batería.", box:[29.9874, 32.5126, 62.7976, 67.5595]},
  {id:9, scene:'cluster', class:"eco", mask:"cluster-eco", lit:"cluster-eco", litBox:[32.2601, 35.4167, 62.0536, 68.1548], name:"ECO Mode / Drive Mode Indicator", explanation:"Se enciende en verde cuando el modo ECO está activado: el auto cuida el consumo y gasta menos gasolina.", box:[32.3864, 35.2273, 63.0952, 67.1131]},
  {id:10, scene:'cluster', class:"check-engine", mask:"cluster-check-engine", lit:"cluster-check-engine", litBox:[27.0202, 29.6717, 66.0714, 73.3631], name:"Fuel Cap / Malfunction Indicator (Check Engine Light)", explanation:"Avisa de una falla en el motor o en el control de emisiones. A veces solo es el tapón de la gasolina mal cerrado; si sigue prendida o parpadea, llévalo a revisar.", box:[27.0833, 29.6717, 67.2619, 72.3214]},
  {id:11, scene:'cluster', class:"oil-pressure", mask:"cluster-oil-pressure", lit:"cluster-oil-pressure", litBox:[29.4192, 33.2702, 66.2202, 72.7679], name:"Engine Oil Pressure Warning Light", explanation:"Avisa que la presión del aceite del motor está baja. Detente en un lugar seguro, apaga el motor y revisa el nivel de aceite.", box:[29.798, 32.9545, 67.4107, 71.5774]},
  {id:12, scene:'cluster', class:"left-turn", mask:"cluster-left-turn", lit:"cluster-left-turn", litBox:[42.3611, 44.8232, 61.3095, 67.8571], name:"Turn Signal Indicator (Left)", explanation:"Parpadea en verde cuando pones la direccional izquierda para dar vuelta o cambiarte de carril. Si parpadea más rápido de lo normal, puede haber un foco fundido.", box:[42.6136, 44.697, 62.0536, 66.9643]},
  {id:13, scene:'cluster', class:"door-ajar", mask:"cluster-door-ajar", lit:"cluster-door-ajar", litBox:[45.0126, 47.2854, 61.1607, 68.3036], name:"Door Ajar Warning Light", explanation:"Avisa que una o más puertas no están bien cerradas. Ciérralas bien antes de arrancar.", box:[45.1389, 47.1591, 61.756, 67.4107]},
  {id:14, scene:'cluster', class:"trunk-open", mask:"cluster-trunk-open", lit:"cluster-trunk-open", litBox:[47.2854, 50.6313, 61.3095, 67.5595], name:"Liftgate Open Warning Light", explanation:"Avisa que el portón trasero (la cajuela) está abierto o mal cerrado.", box:[47.3485, 50.5051, 62.0536, 66.6667]},
  {id:15, scene:'cluster', class:"power-steering", mask:"cluster-power-steering", lit:"cluster-power-steering", litBox:[50.3157, 52.5253, 61.3095, 67.7083], name:"Electronic Power Steering Warning Light", explanation:"Indica una falla en la dirección eléctrica asistida: el volante puede sentirse pesado o duro. Maneja con cuidado y llévalo a revisar.", box:[50.3157, 52.5884, 61.9048, 66.8155]},
  {id:16, scene:'cluster', class:"right-turn", mask:"cluster-right-turn", lit:"cluster-right-turn", litBox:[55.5556, 57.8283, 61.3095, 67.5595], name:"Turn Signal Indicator (Right)", explanation:"Parpadea en verde cuando pones la direccional derecha para dar vuelta o cambiarte de carril. Si parpadea más rápido de lo normal, puede haber un foco fundido.", box:[55.6187, 57.702, 61.9048, 66.8155]},
  {id:17, scene:'cluster', class:"sport", mask:"cluster-sport", lit:"cluster-sport", litBox:[67.4242, 71.5909, 23.8095, 29.7619], name:"Drive Mode Indicator (SPORT)", explanation:"Muestra que la dirección está en modo SPORT: se siente más firme y precisa, útil a mayor velocidad.", box:[68.1187, 71.2121, 24.5536, 29.1667]},
  {id:18, scene:'cluster', class:"normal", mask:"cluster-normal", lit:"cluster-normal", litBox:[67.5505, 71.9066, 28.2738, 33.9286], name:"Drive Mode Indicator (NORMAL)", explanation:"Muestra que la dirección está en modo NORMAL: una firmeza equilibrada para el manejo de todos los días.", box:[68.0556, 71.4646, 28.5714, 33.3333]},
  {id:19, scene:'cluster', class:"comfort", mask:"cluster-comfort", lit:"cluster-comfort", litBox:[67.5505, 71.9066, 32.5893, 36.9048], name:"Drive Mode Indicator (COMFORT)", explanation:"Muestra que la dirección está en modo COMFORT: se siente más ligera y suave, ideal para la ciudad y para estacionarte.", box:[67.9293, 71.4646, 32.7381, 36.9048]},
  {id:20, scene:'cluster', class:"cruise", mask:"cluster-cruise", lit:"cluster-cruise", litBox:[67.5505, 71.8434, 35.8631, 42.1131], name:"Cruise Indicator Light", explanation:"Se enciende cuando el control de crucero está activado y listo para usarse, aunque todavía no hayas fijado una velocidad.", box:[68.1187, 71.4015, 36.3095, 41.5179]},
  {id:21, scene:'cluster', class:"set", mask:"cluster-set", lit:"cluster-set", litBox:[67.803, 71.7172, 41.0714, 47.3214], name:"Cruise SET Indicator Light", explanation:"Se enciende cuando ya fijaste una velocidad y el auto la mantiene solo. Si frenas, se desactiva.", box:[68.4975, 70.8333, 41.8155, 46.5774]},
  {id:22, scene:'cluster', class:"coolant-temp", mask:"cluster-coolant-temp", lit:"cluster-coolant-temp", litBox:[74.4949, 77.5253, 38.5417, 43.75], name:"Engine Coolant Temperature Warning Light", explanation:"Avisa que el motor se está sobrecalentando. Detente en un lugar seguro, apaga el motor y deja que se enfríe antes de abrir el cofre.", box:[74.6843, 76.9571, 38.3929, 43.75]},
  {id:23, scene:'cluster', class:"green-car-outline", mask:"cluster-green-car-outline", lit:"cluster-green-car-outline", litBox:[67.803, 71.7172, 45.8333, 51.9345], name:"Sunroof Open Warning Light", explanation:"Avisa que el quemacocos (el techo corredizo) está abierto. Ciérralo antes de bajarte del auto o de que empiece a llover.", box:[68.1187, 71.2121, 46.2798, 51.3393]},
  {id:24, scene:'cluster', class:"green-car-solid", mask:"cluster-green-car-solid", lit:"cluster-green-car-solid", litBox:[67.803, 71.7172, 50.4464, 56.6964], name:"Immobilizer Indicator Light", explanation:"Es la luz del inmovilizador, el sistema antirrobo que solo deja arrancar el motor con tu llave. Si el motor no enciende y esta luz parpadea o se queda prendida, el auto no está reconociendo la llave.", box:[68.0556, 71.149, 50.8929, 56.1012]},
  {id:25, scene:'cluster', class:"red-exhaust", mask:"cluster-red-exhaust", lit:"cluster-red-exhaust", litBox:[67.803, 71.2121, 53.4226, 62.0536], name:"Fuel Cap Open Warning Indicator", explanation:"Avisa que el tapón del tanque de gasolina está abierto o mal cerrado. Ciérralo bien, hasta que haga clic.", box:[68.5606, 70.9596, 55.2083, 60.7143]},
  {id:26, scene:'cluster', class:"tpms", mask:"cluster-tpms", lit:"cluster-tpms", litBox:[66.5404, 69.5076, 57.5893, 66.369], name:"Low Tire Pressure Light / TPMS Malfunction Indicator", explanation:"Si se queda prendida fija, una o más llantas tienen poca presión: revísalas e ínflalas. Si parpadea cerca de un minuto y luego se queda prendida, hay una falla en el sistema que monitorea las llantas (TPMS).", box:[66.6667, 69.3182, 59.375, 65.0298]},
  {id:27, scene:'cluster', class:"fuel", mask:"cluster-fuel", lit:"cluster-fuel", litBox:[69.0025, 72.2222, 57.8869, 66.5179], name:"Low Fuel Level Warning Light", explanation:"Avisa que queda poca gasolina en el tanque. Ve a cargar combustible pronto.", box:[69.2551, 71.8434, 59.0774, 64.881]},
  {id:28, scene:'cluster', class:"esc", mask:"cluster-esc", lit:"cluster-esc", litBox:[64.7096, 68.2449, 62.3512, 71.875], name:"Electronic Stability Control (ESC) Indicator", explanation:"Parpadea cuando el control de estabilidad está trabajando, por ejemplo en piso mojado o resbaloso. Si se queda prendida fija, hay una falla en el sistema.", box:[65.0253, 67.6136, 63.9881, 70.3869]},
  {id:29, scene:'cluster', class:"esc-off", mask:"cluster-esc-off", lit:"cluster-esc-off", litBox:[66.9823, 70.1389, 62.2024, 72.3214], name:"Electronic Stability Control (ESC) OFF Indicator", explanation:"Indica que el control de estabilidad está apagado porque lo desactivaste con el botón. Vuelve a activarlo para manejar con más seguridad.", box:[67.3611, 69.9495, 63.6905, 70.8333]},
  {id:30, scene:'cluster', class:"abs", mask:"cluster-abs", lit:"cluster-abs", litBox:[69.4444, 73.2323, 62.5, 72.3214], name:"Anti-lock Braking System (ABS) Warning Light", explanation:"Avisa de una falla en el sistema antibloqueo de frenos. Los frenos normales siguen funcionando, pero las llantas pueden bloquearse al frenar fuerte: llévalo a revisar.", box:[69.5707, 72.8535, 64.1369, 70.6845]},
  // ---- gauges & display parts (Reseña only: studyOnly cards are never asked in Examen and never appear in the Flashcards) ----
  {id:31, scene:'cluster', class:"tachometer", mask:"cluster-tachometer", studyOnly:true, name:"Tachometer", explanation:"Marca las revoluciones del motor (RPM) multiplicadas por 1000, o sea, qué tan exigido está el motor. La franja roja del final es el límite: no te pases de ahí.", box:[0.0, 32.2601, 23.3631, 66.9643]},
  {id:32, scene:'cluster', class:"speedometer", mask:"cluster-speedometer", studyOnly:true, name:"Speedometer", explanation:"Marca qué tan rápido va el auto. La escala grande está en millas por hora (MPH) y la chiquita, en kilómetros por hora (km/h).", box:[38.952, 70.8965, 0.0, 66.9643]},
  {id:33, scene:'cluster', class:"gear-shift", mask:"cluster-gear-shift", studyOnly:true, name:"Gear Shift Position", explanation:"Muestra en qué posición está la palanca de velocidades: P (estacionamiento), R (reversa), N (neutral) o D (avance).", box:[45.4545, 48.2323, 47.619, 52.8274]},
  {id:34, scene:'cluster', class:"odometer", mask:"cluster-odometer", studyOnly:true, name:"Odometer", explanation:"Cuenta la distancia total que el auto ha recorrido en toda su vida (aquí en millas). No se puede poner en cero; sirve para saber cuándo toca el servicio.", box:[48.3586, 54.5455, 53.5714, 56.6964]},
  {id:35, scene:'cluster', class:"trip-mode", mask:"cluster-trip-mode", studyOnly:true, name:"Trip Mode", explanation:"Indica qué contador de viaje (Trip) estás viendo en la pantalla. Con el botón del tablero cambias entre los contadores de viaje y la computadora de viaje (autonomía y consumo promedio).", box:[48.3586, 52.904, 46.875, 48.9583]},
  {id:36, scene:'cluster', class:"trip-mileage", mask:"cluster-trip-mileage", studyOnly:true, name:"Trip Mileage", explanation:"Es el kilometraje (millas) del viaje actual: lo que has recorrido desde la última vez que lo pusiste en cero. Sirve para medir un trayecto o calcular cuánto rinde un tanque de gasolina; se reinicia con el botón TRIP/RESET del tablero.", box:[48.3586, 53.2197, 48.6607, 52.381]},
  {id:37, scene:'cluster', class:"engine-temp-gauge", mask:"cluster-engine-temp-gauge", studyOnly:true, name:"Engine Temperature Gauge", explanation:"La aguja marca la temperatura del motor: C es frío y H es caliente. Normalmente se queda a la mitad; si sube hacia H, el motor se está sobrecalentando.", box:[66.2879, 100.0, 0.0, 66.9643]},
  {id:38, scene:'cluster', class:"fuel-gauge", mask:"cluster-fuel-gauge", studyOnly:true, name:"Fuel Gauge", explanation:"Muestra cuánta gasolina queda, de E (vacío) a F (lleno). La flechita junto a la bomba te dice de qué lado del auto está la tapa del tanque.", box:[66.2879, 100.0, 0.0, 66.9643]},
  {id:39, scene:'cluster', class:"exterior-temp", mask:"cluster-exterior-temp", studyOnly:true, name:"Exterior Temperature", explanation:"Muestra la temperatura del aire afuera del auto (aquí en °F). Es útil para saber si hay riesgo de hielo cuando marca cerca de 32 °F (0 °C).", box:[45.9596, 49.8106, 53.5714, 56.6964]},
  {id:40, scene:'cluster', class:"lcd-display", mask:"cluster-lcd-display", studyOnly:true, name:"LCD Display", explanation:"Es la pantalla de información del tablero: muestra la posición de la palanca, el contador de viaje, el odómetro, la temperatura exterior y los mensajes de advertencia.", box:[0.0, 54.8611, 23.3631, 57.2917]},
];
const ALL_CARDS = RAW_CARDS.map(c => ({...c, mask:c.mask ? `assets/masks/${c.mask}.png` : null, lit:c.lit ? `assets/lit/${c.lit}.png` : null}));

const ACTIVE_SCENES = ['cluster'];
const CARDS = ALL_CARDS.filter(c => ACTIVE_SCENES.includes(c.scene));
const cardsForScene = scene => CARDS.filter(c => c.scene === scene && !(c.studyOnly && state.screen !== 'review'));   // gauges & display parts live in Reseña only

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
const PAN_MARGIN = 0.02;   // how far past the photo's edge you can drag when the photo fills the screen (fraction of the photo)
const WORLD_PAD  = 0.6;    // blurred extension on EACH side (fraction of the photo). Needs to be big enough for the furthest zoom-out.
let zoomOut = 0;   // 0 = photo fills the screen · 1 = zoomed out as far as it goes (menu slider)
const PHOTO_ZOOM = {h:1.18, w:1.1};   // how big the photo is on screen: photo height = 1.18 × screen height (or width = 1.3 × screen width, whichever is bigger). Lower = see more at once
const EDGE_FEATHER = 2.5; // % of the photo's edge that fades into the blurred extension (0 = hard edge)

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

// Everything below is measured in one reference size: 800 units wide and as tall as the photo's own shape
// (800 × 339 for this panorama), so a finger covers the same distance sideways and up-down.
const REF_W = 800;
const refH = scene => REF_W * SCENES[scene].h / SCENES[scene].w;

const dragSignal = on => document.dispatchEvent(new CustomEvent('viewerdrag', {detail:on}));

// distance (in reference units) from a point to the part, plus the part's area for tie-breaks.
// The mask picture is cropped: it covers exactly the card's box.
function distToCard(c, x, y, r, RH){
  const l = c.box[0]/100*REF_W, rr = c.box[1]/100*REF_W, t = c.box[2]/100*RH, b = c.box[3]/100*RH;
  if(x < l-r || x > rr+r || y < t-r || y > b+r) return {d:Infinity, area:0};
  const m = c.mask && maskData[c.mask];
  if(m){
    const kx = m.w/(rr-l), ky = m.h/(b-t);               // mask pixels per reference unit
    const px = (x-l)*kx, py = (y-t)*ky, ix = Math.floor(px), iy = Math.floor(py), area = m.area/(kx*ky);
    if(ix >= 0 && iy >= 0 && ix < m.w && iy < m.h && m.a[iy*m.w+ix] > 128) return {d:0, area};
    let best = Infinity;
    const Rx = Math.ceil(r*kx), Ry = Math.ceil(r*ky),
          x0 = Math.max(0, ix-Rx), x1 = Math.min(m.w-1, ix+Rx), y0 = Math.max(0, iy-Ry), y1 = Math.min(m.h-1, iy+Ry);
    for(let yy = y0; yy <= y1; yy++) for(let xx = x0; xx <= x1; xx++){
      if(m.a[yy*m.w+xx] > 128){ const d = Math.hypot(l+(xx+.5)/kx-x, t+(yy+.5)/ky-y); if(d < best) best = d; }
    }
    return {d:best, area};
  }
  return {d:Math.hypot(Math.max(l-x, 0, x-rr), Math.max(t-y, 0, y-b)), area:(rr-l)*(b-t)};   // no mask (or it failed to load): use the box
}

// nx, ny = where the tap landed on the photo (0..1) · cssWidth = how wide the photo is on screen
function hitTest(scene, nx, ny, cssWidth, preferId){
  const RH = refH(scene), x = nx*REF_W, y = ny*RH, r = FINGER_PX/(cssWidth/REF_W);
  const near = [];
  cardsForScene(scene).forEach(c => { const h = distToCard(c, x, y, r, RH); if(h.d <= r) near.push({card:c, d:h.d, area:h.area}); });
  if(!near.length) return null;
  const pref = near.find(n => n.card.id === preferId && n.d <= 0.5);
  if(pref) return pref.card;
  const inside = near.filter(n => n.d <= 0.5).sort((a, b) => a.area - b.area)[0];
  const small = near.filter(n => n !== inside && (!inside || n.area < inside.area/6)).sort((a, b) => a.d - b.d)[0];   // a much smaller part within finger reach wins
  if(inside) return (small || inside).card;
  const eff = n => n.d * (1 + n.area/10000);   // nothing under the finger: nearest wins
  return near.sort((a, b) => eff(a) - eff(b))[0].card;
}

/* ================= 3. LOOK-AROUND VIEWER ================= */

const areaOf = c => (c.box[1]-c.box[0]) * (c.box[3]-c.box[2]);

// The highlight for a card: the glowing picture of the light itself (p.lit) placed on its litBox.
// Cards without one fall back to the yellow mask / box.
function highlightLayer(p, on){
  const cls = on ? ' on' : '';
  const sd = `--sd:${(p.box[0]*0.012).toFixed(2)}s`;   // shimmer ripples left → right across the photo
  if(p.lit){
    const b = p.litBox;
    return `<img class="hl-img lit${cls}" data-id="${p.id}" src="${p.lit}" alt="" aria-hidden="true" draggable="false" style="left:${b[0]}%;top:${b[2]}%;width:${b[1]-b[0]}%;height:${b[3]-b[2]}%;${sd}" />`;
  }
  const b = p.box, place = `left:${b[0]}%;top:${b[2]}%;width:${b[1]-b[0]}%;height:${b[3]-b[2]}%;`;
  if(p.mask) return `<img class="hl-img${cls}" data-id="${p.id}" src="${p.mask}" alt="" aria-hidden="true" draggable="false" style="${place}${sd}" />`;
  return '';   // no yellow box fallback: a part is shown only through its lit picture or its yellow mask
}

// Blurred extension of a photo: the photo is mirrored on all 8 sides, then softened.
// Mirroring keeps colours continuous at the photo's edge, so the seam blends in.
// (Built tiny and blurred by shrinking/enlarging, so it is cheap on phones and needs no CSS filter.)
const backdropCache = {};
function makeBackdrop(img, sc){
  const tw = 240, th = Math.round(tw*sc.h/sc.w), px = Math.round(tw*WORLD_PAD), py = Math.round(th*WORLD_PAD);
  let c = document.createElement('canvas'); c.width = tw + 2*px; c.height = th + 2*py;
  const x = c.getContext('2d');
  for(let ix = -1; ix <= 1; ix++) for(let iy = -1; iy <= 1; iy++){
    x.save(); x.translate(px + tw/2 + ix*tw, py + th/2 + iy*th); x.scale(ix ? -1 : 1, iy ? -1 : 1);
    x.drawImage(img, -tw/2, -th/2, tw, th); x.restore();
  }
  const [w0, h0] = [c.width, c.height];
  const resize = (src, w, h) => { const o = document.createElement('canvas'); o.width = w; o.height = h; const g = o.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, w, h); return o; };
  for(let i = 0; i < 3; i++) c = resize(c, Math.max(4, c.width >> 1), Math.max(4, c.height >> 1));   // shrink…
  for(let i = 0; i < 3; i++) c = resize(c, c.width*2, c.height*2);                                    // …and grow back = blur
  c = resize(c, w0, h0);
  const g = c.getContext('2d'); g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, 0, w0, h0);            // slightly darker than the sharp photo
  return c;
}
function paintBackdrop(canvas, scene, img){
  const draw = () => {
    const src = backdropCache[scene] || (backdropCache[scene] = makeBackdrop(img, SCENES[scene]));
    canvas.width = src.width; canvas.height = src.height; canvas.getContext('2d').drawImage(src, 0, 0);
  };
  if(img.complete && img.naturalWidth) draw(); else img.addEventListener('load', draw, {once:true});
}

function viewerHTML(scene, cards, allOn){
  const s = SCENES[scene], total = 1 + 2*WORLD_PAD, off = WORLD_PAD/total*100, size = 100/total;   // where the photo sits inside the world, in %
  const sorted = [...cards].sort((a, b) => areaOf(b) - areaOf(a));   // small parts on top
  const lights = sorted.filter(c => c.lit).map(c => highlightLayer(c, allOn)).join('');
  const parts = sorted.filter(c => !c.lit).map(c => highlightLayer(c, allOn)).join('');
  // your own picture of each gauge (assets/gauges/<class>.png, same frame as the cluster photo): black becomes transparent, tap = it grows
  const visuals = sorted.filter(c => !c.lit && c.mask).map(c => `<img class="hl-img gauge-vis" data-id="${c.id}" data-src="assets/gauges/${c.class}.png" alt="" aria-hidden="true" draggable="false" style="left:0;top:0;width:100%;height:100%;transform-origin:${((c.box[0]+c.box[1])/2).toFixed(2)}% ${((c.box[2]+c.box[3])/2).toFixed(2)}%">`).join('');
  const layers = (parts ? `<div class="mask-group">${parts}</div>` : '') + visuals + lights;   // the yellow masks are invisible (0%): they only tell the app where a tap lands   // yellow parts form ONE layer at 50%, so overlapping parts never stack darker
  const dots = s.sides ? `<div class="side-dots" aria-hidden="true">${s.sides.map(() => '<i></i>').join('')}</div>` : '';
  return `<div class="viewer" data-scene="${scene}">
      <div class="world">
        <canvas class="pad"></canvas>
        <div class="photo" style="left:${off}%;top:${off}%;width:${size}%;height:${size}%;--feather:${EDGE_FEATHER}%"><img class="base" src="${s.image}" alt="${s.title}" draggable="false"/>${layers}</div>
      </div>
      <div class="fov"></div><div class="fov-dark"></div>
      <div class="hud"></div><div class="sel-pill"></div>${dots}<div class="look-hint">${s.sides ? '←  Desliza para cambiar de lado  →' : '↔↕ Arrastra para mirar alrededor'}</div>
    </div>
    <button class="fab" data-action="menu" aria-label="Menú">☰</button>`;
}

let viewerCtl = null;
function mountViewer(onTap, getPrefer){
  const el = document.querySelector('.viewer'); if(!el) return null;
  const world = el.querySelector('.world'), photo = el.querySelector('.photo'), scene = el.dataset.scene, sc = SCENES[scene], hint = el.querySelector('.look-hint');
  const dots = [...el.querySelectorAll('.side-dots i')];
  paintBackdrop(el.querySelector('.pad'), scene, el.querySelector('.base'));
  const sides = sc.sides || null; let side = sides ? Math.floor(sides.length/2) : 0;   // start on the middle side
  let vw = 0, vh = 0, W = 0, H = 0, pw = 0, ph = 0, x = 0, y = 0, cx = .5, cy = .5, raf = 0;   // W,H = whole world · pw,ph = the sharp photo inside it
  // pan limits per axis: while the photo fills the screen you can drag across it (+ a thin margin);
  // once it is smaller than the screen on an axis it simply stays centred on that axis
  const axis = (v, view, o, size, m) => { const lo = o-m, hi = o+size+m; return hi-lo >= view ? Math.min(-lo, Math.max(view-hi, v)) : view/2-(o+size/2); };
  const clampX = v => axis(v, vw, pw*WORLD_PAD, pw, pw*PAN_MARGIN), clampY = v => axis(v, vh, ph*WORLD_PAD, ph, ph*PAN_MARGIN);
  const clamp = () => { x = clampX(x); y = clampY(y); };
  const apply = () => { world.style.transform = `translate3d(${x}px,${y}px,0)`; };
  const syncCenter = () => { cx = (vw/2-x)/W; cy = (vh/2-y)/H; };
  // panorama: where the world sits when side i is centred (the photo's vertical middle always stays centred)
  const sideX = i => clampX(vw/2 - (pw*WORLD_PAD + sides[i]*pw)), sideY = () => clampY(vh/2 - (ph*WORLD_PAD + ph/2));
  const nearestSide = px => sides.reduce((best, _, i) => Math.abs(sideX(i)-px) < Math.abs(sideX(best)-px) ? i : best, 0);
  function setSide(i){
    side = i; dots.forEach((d, k) => d.classList.toggle('on', k === i));
    document.dispatchEvent(new CustomEvent('viewerside', {detail:i}));
  }
  function glideTo(tx, ty, ms){   // smooth move (ease-out)
    cancelAnimationFrame(raf);
    const x0 = x, y0 = y, t0 = performance.now();
    const step = n => {
      const k = Math.min(1, (n-t0)/ms), e = 1-Math.pow(1-k, 3);
      x = x0+(tx-x0)*e; y = y0+(ty-y0)*e; apply();
      if(k < 1) raf = requestAnimationFrame(step); else syncCenter();
    };
    raf = requestAnimationFrame(step);
  }
  function layout(){
    vw = el.clientWidth; vh = el.clientHeight; if(!vw || !vh) return;
    const kNear = Math.max(vh*PHOTO_ZOOM.h/sc.h, vw*PHOTO_ZOOM.w/sc.w);                                   // photo fills the screen
    const kFar  = Math.min(kNear, Math.max(Math.min(vw/sc.w, vh/sc.h), vw/(sc.w*(1+2*WORLD_PAD)), vh/(sc.h*(1+2*WORLD_PAD))));   // whole photo in view, but never more than the blurred extension can cover
    const k = kNear*Math.pow(kFar/kNear, zoomOut); pw = sc.w*k; ph = sc.h*k;
    W = pw*(1+2*WORLD_PAD); H = ph*(1+2*WORLD_PAD);
    world.style.width = W+'px'; world.style.height = H+'px';
    if(sides){ x = sideX(side); y = sideY(); apply(); syncCenter(); }
    else { x = vw/2-cx*W; y = vh/2-cy*H; clamp(); apply(); syncCenter(); }
  }
  layout(); new ResizeObserver(layout).observe(el);
  if(sides) setSide(side);

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
    if(sides){   // panorama: sideways only, never past the first / last side
      x = Math.min(sideX(0), Math.max(sideX(sides.length-1), x+dx)); apply(); vx = dx/dt*16;
    } else { x += dx; y += dy; clamp(); apply(); vx = dx/dt*16; vy = dy/dt*16; }
    lx = e.clientX; ly = e.clientY; lt = now;
  });
  const cancel = e => { if(e.pointerId === down){ down = null; cancelAnimationFrame(raf); if(sides){ const i = nearestSide(x); setSide(i); glideTo(sideX(i), sideY(), 280); } else syncCenter(); dragSignal(false); } };   // browser took the touch away (long-press menu, system gesture): not a tap
  const end = e => {
    if(e.pointerId !== down) return;
    down = null;
    if(moved) dragSignal(false);
    if(!moved){   // a tap — measured against the sharp photo, so masks/boxes stay exactly where they were drawn
      const r = photo.getBoundingClientRect();
      if(sides){ const i = nearestSide(x); if(Math.abs(sideX(i)-x) > 1){ setSide(i); glideTo(sideX(i), sideY(), 220); } }   // a tap that stopped a slide: finish settling
      onTap(hitTest(scene, (e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height, r.width, getPrefer ? getPrefer() : undefined), e);
      return;
    }
    if(sides){   // let go: settle on the side nearest to where a flick would carry the photo
      const i = nearestSide(x + (performance.now()-lt < 80 ? vx*12 : 0));
      setSide(i); glideTo(sideX(i), sideY(), 380); return;
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

  viewerCtl = { relayout: layout,
    goToSide(i){ setSide(i); glideTo(sideX(i), sideY(), 420); },
    lookAt(p){   // smoothly bring a part into view: the nearest side (panorama) or centred (free look)
      if(sides){
        const mid = (p.box[0]+p.box[1])/200, i = sides.reduce((best, f, k) => Math.abs(f-mid) < Math.abs(sides[best]-mid) ? k : best, 0);
        setSide(i); glideTo(sideX(i), sideY(), 420); return;
      }
      const ox = pw*WORLD_PAD, oy = ph*WORLD_PAD;
      glideTo(clampX(vw/2-(ox+(p.box[0]+p.box[1])/200*pw)), clampY(vh/2-(oy+(p.box[2]+p.box[3])/200*ph)), 450);
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

const ICON = {book:'▤', play:'▶', home:'⌂', cards:'🃏'};
const setBodyCam = on => document.body.classList.toggle('cam', on);

function renderHome(){
  app.innerHTML = `<section class="home">
    <button class="big-btn review" data-action="review">Reseña</button>
    <button class="big-btn exam" data-action="exam">Examen</button>
    <button class="big-btn flash" data-action="flash">Flashcards</button>
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
// The explanation pops up as a CARD: exactly the Examen card (white, red / yellow / blue border, cycling each time).
// No buttons: tap anywhere to close it.
let infoCount = 0;
function sideNameOf(p){
  const sc = SCENES[p.scene]; if(!sc.sides) return sc.title;
  const mid = (p.box[0]+p.box[1])/200, i = sc.sides.reduce((best, f, k) => Math.abs(f-mid) < Math.abs(sc.sides[best]-mid) ? k : best, 0);
  return sc.sideNames[i];
}
function infoCard(p, closeAction = 'closeExplanation'){
  closePops();
  const o = document.createElement('div'); o.className = 'explain-overlay info';
  o.innerHTML = `<div class="cloud-backdrop" data-action="${closeAction}"></div>
    <div class="q-card info c${infoCount++ % 3}"><div class="q-tag">${esc(sideNameOf(p).toUpperCase())}</div><div class="q-name">${esc(p.name)}</div><div class="q-help">${esc(p.explanation)}</div><div class="q-close">Toca para cerrar</div></div>`;
  o._born = performance.now(); document.body.appendChild(o);
}

// Draws a photo full-screen. hud = text in the little top-left pill.
const gaugeCache = {};
function gaugeCutout(url){   // black → transparent (soft edge), the picture itself is not touched
  return gaugeCache[url] || (gaugeCache[url] = new Promise((ok, no) => {
    const im = new Image();
    im.onload = () => {
      try{
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
        const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
        for(let i = 0; i < p.length; i += 4){ const m = Math.max(p[i], p[i+1], p[i+2]); p[i+3] = Math.max(0, Math.min(255, (m - 8) * 16)); }
        g.putImageData(d, 0, 0); ok(c.toDataURL('image/png'));
      }catch(e){ ok(url + '#blend'); }   // opened as a file (not through a server): fall back to a screen blend
    };
    im.onerror = () => no(); im.src = url;
  }));
}
function prepGaugeVisuals(){
  document.querySelectorAll('.gauge-vis').forEach(img => {
    gaugeCutout(img.dataset.src).then(src => { if(src.endsWith('#blend')){ src = src.slice(0, -6); img.classList.add('blend'); } img.src = src; img.classList.add('ready'); }, () => img.remove());   // no file in assets/gauges → nothing is drawn
  });
}
function showScene(scene, {hud = '', allOn = false, onTap = () => {}, getPrefer} = {}){   // allOn: every lit indicator stays on
  removeQCard();
  setBodyCam(true);
  app.innerHTML = viewerHTML(scene, cardsForScene(scene), allOn);
  $('.hud').innerHTML = hud;
  prepGaugeVisuals();
  return mountViewer(onTap, getPrefer);
}

function setZoomOut(t){
  zoomOut = Math.min(1, Math.max(0, t));
  if(viewerCtl && document.querySelector('.viewer')) viewerCtl.relayout();
}
const zoomRowHTML = () => document.querySelector('.viewer') ? `<div class="zoom-row">
      <label class="zoom-title" for="zoomSlider">🔍 Zoom</label>
      <input id="zoomSlider" class="zoom-slider" type="range" min="0" max="100" step="1" value="${Math.round(zoomOut*100)}" aria-label="Alejar la foto"/>
      <div class="zoom-ends"><span>Cerca</span><span>Lejos</span></div>
    </div>` : '';

function menuPopup(){
  play('pageForward');
  const inExam = state.screen === 'exam', inReview = state.screen === 'review', inFlash = state.screen === 'flash';
  popup(`<div class="mini-tag">INSTRUMENT CLUSTER</div><h2>Menú</h2>
    ${zoomRowHTML()}
    ${inExam ? `<div class="pop-stat"><span class="progress-pill">${state.examIndex+1}/${state.exam.length}</span><span class="hearts">${heartsText()}</span></div>` : ''}
    <div class="pop-col">
      <button class="${inReview ? 'yellow-btn' : 'secondary-btn'}" data-action="review">${ICON.book} Reseña</button>
      <button class="${inExam ? 'yellow-btn' : 'secondary-btn'}" data-action="exam">${ICON.play} Examen</button>
      <button class="${inFlash ? 'yellow-btn' : 'secondary-btn'}" data-action="flash">${ICON.cards} Flashcards</button>
      <button class="secondary-btn" data-action="mistakes">Review all the mistakes</button>
      <button class="secondary-btn" data-action="home">${ICON.home} Inicio</button>
      <button class="secondary-btn" data-action="closeExplanation">Seguir mirando</button>
    </div>`);
}

function home(){ removeQCard(); window.flashLeave && flashLeave(); setBodyCam(false); state.screen = 'home'; renderHome(); }

const CAM_SCREENS = ['review', 'exam', 'results', 'mistakes'];
function render(){
  window.flashLeave && flashLeave();
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
  infoCard(p);
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
  CARDS.filter(c => !c.studyOnly).forEach(c => (byClass[c.class] = byClass[c.class] || []).push(c));
  return shuffle(Object.keys(byClass)).map(cls => ({cls, name:PART_CLASSES[cls] || byClass[cls][0].name, card:byClass[cls][rand(byClass[cls].length)]}));
}
const currentPart = () => state.exam[state.examIndex];   // {cls, name, card}: card = the photo/mask shown this time

// white eye: it shuts, the Examen is built underneath (pink overlay), the eye opens, THEN 3 · 2 · 1 · GO
let eyeEl = null;
function eyeClose(then){
  eyeEl?.remove(); eyeEl = document.createElement('div'); eyeEl.id = 'eye'; eyeEl.innerHTML = '<i class="t"></i><i class="b"></i>';
  document.body.appendChild(eyeEl); void eyeEl.offsetWidth; eyeEl.classList.add('shut');
  setTimeout(then, 700);
}
function eyeOpen(then){
  if(!eyeEl){ then(); return; }
  eyeEl.classList.remove('shut'); eyeEl.classList.add('opening');
  setTimeout(() => { eyeEl?.remove(); eyeEl = null; then(); }, 1100);
}
function startExam({eye = false} = {}){
  const go = () => {
    Object.assign(state, {exam:buildExam(), examIndex:0, score:0, hearts:MAX_HEARTS, mistakes:[], selected:null, answerLocked:true, screen:'exam'});
    renderExam({intro:true, viaEye:eye});
  };
  if(!eye){ go(); return; }
  closePops();
  eyeClose(() => { window.flashLeave && flashLeave(); window.closeClusterIntro && closeClusterIntro(); removeQCard(); go(); });
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
function beginIntro(onDone, viaEye = false){
  introTimers.forEach(clearTimeout); introTimers = []; introEl?.remove();
  introEl = document.createElement('div'); introEl.className = 'intro-scrim';   // the pink overlay is there BEFORE the eye opens
  document.body.appendChild(introEl);
  const mine = introEl;
  const run = () => {
    if(introEl !== mine) return;   // left the Examen meanwhile
    play('countdown');
    introAt(() => fnfWord('¡Preparados!', 'ready'), CD.ready);
    introAt(() => fnfWord('Listos', 'set'), CD.set);
    introAt(() => fnfWord('¡GO!', 'go'), CD.go);
    introAt(() => endIntro(onDone), CD.end);
  };
  if(viaEye) eyeOpen(run); else run();   // eye finished opening → 3 · 2 · 1 · GO
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
  el.innerHTML = `<div class="q-tag">${n+1}/${state.exam.length} · FIND THIS PART</div><div class="q-name">${esc(q.name)}</div><div class="q-help">Desliza para ver los 3 lados.<br>Toca la luz para agrandarla un poco y tócala otra vez para confirmar.</div>`;
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

function renderExam({intro = false, viaEye = false} = {}){
  const q = currentPart(); state.selected = null;
  showScene(q.card.scene, {
    hud: examHud(),
    allOn: true,
    getPrefer: () => state.selected || undefined,
    onTap: hit => {
      if(state.answerLocked) return;
      if(!hit){ setSelected(null); return; }
      if(state.selected === hit.id){ hit.class === q.cls ? answerExam() : wrongExam(); }   // second tap = final answer · same class = correct
      else { setSelected(hit.id); play('pop'); }                                           // first tap = it grows a little
    },
  });
  $('.look-hint')?.remove();   // the little name card takes the hint's place
  if(intro){
    state.answerLocked = true;
    beginIntro(() => { state.answerLocked = false; shimmerNow(); showQCard(); }, viaEye);   // after 3, 2, 1, GO!: every mask shimmers and the card slides up
  } else showQCard();
}

function setSelected(id){
  state.selected = id;
  document.querySelectorAll('.world .hl-img,.world .hl-box').forEach(h => h.classList.toggle('focus', Number(h.dataset.id) === id));   // the others stay lit; the picked one grows a little
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
  popup(`<div class="mini-tag">REVIEW</div><h2>Mistakes</h2><p>Toca una tarjeta para ver la luz resaltada.</p>
    <div class="pop-list">${state.mistakes.map(p => `<button class="mistake-card" data-action="mistakeOpen" data-id="${p.id}"><span class="mistake-icon">☁️</span><span class="mistake-name">${esc(p.name)}</span><small>${esc(SCENES[p.scene].title)}</small></button>`).join('')}</div>${buttons}`);
}

function openMistake(id){
  const p = state.mistakes.find(m => m.id === id); if(!p) return;
  closePops();
  if($('.viewer')?.dataset.scene !== p.scene) showScene(p.scene, {hud:'<span class="h">MISTAKES</span>'});   // mistake is on another photo
  document.querySelectorAll('.world .hl-img,.world .hl-box').forEach(h => h.classList.toggle('on', Number(h.dataset.id) === p.id));
  viewerCtl?.lookAt(p);
  infoCard(p, 'mistakes');   // tap anywhere to go back to the list
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


document.addEventListener('input', e => { if(e.target.classList && e.target.classList.contains('zoom-slider')) setZoomOut(e.target.value/100); });

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if(!el) return;
  // The "click" that finishes the very tap that opened a popup lands on the popup's backdrop and used to close it
  // again instantly (the sheet flashed and vanished). Clicks in the first moments of a popup's life are ignored.
  const ov = el.closest('.explain-overlay'); if(ov && performance.now() - (ov._born || 0) < 400) return;
  switch(el.dataset.action){
    case 'menu':             menuPopup(); break;
    case 'closeExplanation': closePops(); break;
    case 'home':             closePops(); window.closeClusterIntro && closeClusterIntro(); home(); play('pageBack'); break;
    case 'review': {
      const already = state.screen === 'review';
      closePops(); if(already) break;
      state.screen = 'review'; state.sceneIndex = 0; render(); play('pageForward');
      window.showClusterIntro && showClusterIntro();   // pink explanation overlay (flash.js)
      break; }
    case 'flash':            closePops(); window.enterFlash && enterFlash(); break;
    case 'nextReview':       closePops(); state.sceneIndex = (state.sceneIndex+1) % ACTIVE_SCENES.length; render(); play('next'); break;
    case 'exam': {
      if(['review', 'flash', 'exam'].includes(state.screen)){ startExam({eye:true}); break; }   // Reseña / menu / flashcards → Examen: the white eye
      closePops(); window.flashLeave && flashLeave(); window.closeClusterIntro && closeClusterIntro(); startExam(); break;
    }
    case 'mistakes':
      if(state.screen === 'mistakes' && $('.viewer')) showMistakeList();
      else { closePops(); state.screen = 'mistakes'; render(); }
      break;
    case 'mistakeOpen':      openMistake(Number(el.dataset.id)); break;
  }
});

renderHome();
