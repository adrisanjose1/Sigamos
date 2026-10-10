/*
  KIA SOUL 2015 — photographic flashcard app
  Language: Mexican Spanish UI, English component names.
  Photos: assets/base/   Masks: assets/masks/   Sounds: assets/sounds/

  Sections: 1 data · 2 hit-testing · 3 viewer · 4 sounds · 5 popups · 6 reseña · 7 examen · 8 mistakes · 9 wiring
*/

/* ================= 1. DATA ================= */

const SCENES = {
  wheel:   {image:'assets/base/wheel.jpg',   w:800,  h:600,  title:'Steering Wheel Area'},
  console: {image:'assets/base/console.jpg', w:800,  h:600,  title:'Center Stack'},
  shifter: {image:'assets/base/shifter.jpg', w:800,  h:600,  title:'Gear Shifter Console'},
  cabin:   {image:'assets/base/cabin.jpg',   w:800,  h:600,  title:'Full Cabin'},
  dash:    {image:'assets/base/dash.jpg',    w:1600, h:1200, title:'Driver Dashboard'},
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
  // steering wheel & controls
  'steering-wheel':            'Steering Wheel',
  'airbag-horn-pad':           'Airbag Module & Horn Pad',
  'tilt-telescopic-lever':     'Tilt & Telescopic Steering Lever',
  'left-spoke-panel':          'Left Spoke Panel',
  'right-spoke-panel':         'Right Spoke Panel',
  'audio-control-pad':         'Audio Control Pad',
  'cruise-control-pad':        'Cruise Control Pad',
  'hands-free-buttons':        'Hands-Free Buttons',
  'trip-drive-mode-buttons':   'Trip / Drive Mode Buttons',
  'turn-signal-stalk':         'Turn Signal Stalk',
  'wiper-stalk':               'Wiper / Washer Stalk',
  'ignition':                  'Ignition Key Cylinder',
  // dashboard & center stack
  'instrument-cluster':        'Instrument Cluster',
  'dash-tweeter':              'Dash Tweeter',
  'hazard-button':             'Hazard Warning Button',
  'center-dashboard-module':   'Center Dashboard Module',
  'infotainment-display':      'Infotainment Display',
  'volume-knob':               'Volume Knob',
  'tune-knob':                 'Tune Knob',
  'audio-panel':               'Audio Panel',
  'setup-panel':               'Setup Panel',
  'climate-controls-panel':    'Climate Controls Panel',
  'climate-control-dial':      'Climate Control Dial',
  'climate-button':            'Climate Button',
  'ac-button':                 'A/C Button',
  'fan-speed-buttons':         'Fan Speed Buttons',
  'defog-defrost-controls':    'Defog / Defrost Controls',
  'recirculation-button':      'Recirculation Button',
  'mode-button':               'Mode Button',
  'passenger-airbag-indicator':'Passenger Airbag Indicator Panel',
  'dimmer-esc-switches':       'Dimmer / ESC Off Switches',
  'fuse-panel-cover':          'Fuse Panel Cover',
  // shifter & console
  'gear-shift-lever':          'Gear Shift Lever',
  'gear-position-display':     'Gear Position Display',
  'shift-boot':                'Shift Boot',
  'shifter-base':              'Shifter Base',
  'charger-port-panel':        'Charger Port Panel',
  'parking-brake':             'Parking Brake Handle',
  'cup-holders':               'Cup Holders',
  'armrest':                   'Armrest',
  // doors, mirrors, seats, pedals
  'master-door-switch-panel':  'Master Door Switch Panel',
  'passenger-window-control':  'Passenger Window Control',
  'passenger-door-handle':     'Passenger Door Handle',
  'door-speaker':              'Door Speaker',
  'passenger-side-mirror':     'Passenger Side Mirror',
  'driver-seat':               'Driver Seat',
  'passenger-seat':            'Passenger Seat',
  'brake-pedal':               'Brake Pedal',
  'accelerator-pedal':         'Accelerator Pedal',
  // other
  'my-beautiful-wife':         'My Beautiful Wife',
};

/*
  One entry per card.  class = key from PART_CLASSES.  box = [left%, right%, top%, bottom%] over its photo.
  mask = file name (no folder, no .png) inside assets/masks/.  Parts without a mask
  fall back to a yellow box until you add one.
*/
const RAW_CARDS = [
  // --- wheel ---
  {id:1, scene:'wheel', class:'steering-wheel', mask:'steering-wheel',        name:'Steering Wheel',                   explanation:TXT.steering, box:[33.12, 62.38, 7.33, 57]},
  {id:2, scene:'wheel', class:'fuse-panel-cover', mask:'fuse-panel-cover',      name:'Fuse Panel Cover',                 explanation:'Cubre los fusibles que protegen los circuitos eléctricos del carro.', box:[4.62, 20.5, 60, 79]},
  {id:3, scene:'wheel', class:'brake-pedal', mask:'brake-pedal',           name:'Brake Pedal',                      explanation:'Al presionarlo, el carro disminuye la velocidad o se detiene.', box:[13.25, 22, 87.67, 97.5]},
  {id:4, scene:'wheel', class:'dimmer-esc-switches', mask:'dimmer-esc-switches',   name:'Dimmer / ESC Off Switches',        explanation:'Ajustan el brillo del tablero o desactivan el control de estabilidad.', box:[13.25, 19.62, 48.33, 55.67]},
  {id:5, scene:'wheel', class:'accelerator-pedal', mask:'accelerator-pedal',     name:'Accelerator Pedal',                explanation:'Al presionarlo, el motor aumenta la fuerza para avanzar más rápido.', box:[22, 29.25, 82.17, 100]},
  {id:34, scene:'wheel', class:'turn-signal-stalk', mask:'light-turn-signal-stalk', name:'Light & Turn Signal Stalk',      explanation:'Sirve para prender las luces y para avisar con las direccionales cuando vas a dar vuelta.', box:[26.75,33.88,29.33,41.0]},
  {id:35, scene:'wheel', class:'gear-shift-lever', mask:'gear-shift-lever',      name:'Gear Shift Lever',                 explanation:TXT.gear,     box:[62.12,77.0,51.33,71.5]},
  {id:36, scene:'wheel', class:'passenger-side-mirror', mask:'passenger-side-mirror', name:'Passenger Side Mirror',            explanation:'Te deja ver lo que viene al lado y atrás del carro, del lado del pasajero.', box:[80.5,92.62,9.67,20.33]},
  {id:37, scene:'wheel', class:'driver-seat', mask:'driver-seat',           name:'Driver Seat',                      explanation:TXT.seat,     box:[40.38,100.0,19.67,100.0]},
  {id:38, scene:'wheel', class:'airbag-horn-pad', mask:'airbag-horn-pad',       name:'Airbag Module & Horn Pad',         explanation:'Al presionarlo suena el claxon. Además, guarda la bolsa de aire que te protege en un choque.', box:[40.5,55.38,25.5,46.5]},
  {id:39, scene:'wheel', class:'tilt-telescopic-lever', mask:'tilt-telescopic-lever', name:'Tilt & Telescopic Steering Lever', explanation:'Al soltarla puedes subir, bajar o acercar el volante para manejar más cómodo.', box:[28.5,36.88,50.33,54.5]},
  {id:40, scene:'wheel', class:'passenger-door-handle', mask:'interior-door-handle',  name:'Interior Passenger Door Handle',   explanation:'Se jala para abrir la puerta del pasajero desde adentro.', box:[89.25,98.75,32.33,39.5]},
  {id:69, scene:'wheel', class:'passenger-window-control', mask:'side-window-control-passenger', name:'Passenger Window Control', explanation:'Botón en la puerta del pasajero para subir o bajar su ventana.', box:[69.88, 80.62, 27.33, 30.83]},

  // --- cabin ---
  {id:19, scene:'cabin', class:'parking-brake', mask:'cabin-parking-brake',   name:'Parking Brake Handle',             explanation:'Mantiene el carro detenido cuando está estacionado.', box:[22.88,39.25,70.5,89.67]},
  {id:70, scene:'cabin', class:'climate-controls-panel', mask:'cabin-climate-controls-panel', name:'Climate Controls Panel', explanation:'Panel con la perilla y los botones para ajustar la temperatura, el ventilador y el aire acondicionado.', box:[53.75, 67.25, 34.67, 43.33]},
  {id:21, scene:'cabin', class:'ignition', mask:'cabin-ignition',        name:'Ignition Key Cylinder',            explanation:'Aquí se inserta la llave para encender el motor.', box:[40.75,44.25,32.67,45.17]},
  {id:22, scene:'cabin', class:'cup-holders', mask:'cabin-cupholders',      name:'Center Console & Cup Holders',     explanation:'Espacio de almacenamiento y sostiene vasos o botellas.', box:[24.88, 47, 82, 100]},
  {id:41, scene:'cabin', class:'hazard-button', mask:'cabin-hazard-button',   name:'Hazard Warning Button',            explanation:TXT.hazard,   box:[65.12, 69.62, 7.33, 13]},
  {id:42, scene:'cabin', class:'armrest', mask:'cabin-armrest',         name:'Armrest',                          explanation:'Te da un lugar cómodo para apoyar el brazo mientras manejas.', box:[0.0,22.62,70.5,100.0]},
  {id:43, scene:'cabin', class:'center-dashboard-module', mask:'cabin-center-dashboard-module', name:'Center Dashboard Module',  explanation:'Panel central del tablero donde están la pantalla, el radio y los controles del clima.', box:[50.75,80.25,14.33,49.83]},
  {id:44, scene:'cabin', class:'driver-seat', mask:'cabin-driver-seat',     name:'Driver Seat',                      explanation:TXT.seat,     box:[0, 39.62, 51.5, 85.17]},
  {id:45, scene:'cabin', class:'gear-shift-lever', mask:'cabin-gear-stick',      name:'Gear Stick',                       explanation:TXT.gear,     box:[44.0,57.62,50.0,74.67]},
  {id:46, scene:'cabin', class:'master-door-switch-panel', mask:'cabin-master-door-switch-panel', name:'Master Door Switch Panel', explanation:'Desde aquí el conductor controla las ventanas y los seguros de las puertas.', box:[0, 21, 33.17, 41.5]},
  {id:47, scene:'cabin', class:'passenger-airbag-indicator', mask:'cabin-passenger-indicator', name:'Passenger Indicator',          explanation:'Luz que avisa el estado de la bolsa de aire del pasajero.', box:[53.88,65.88,41.17,47.67]},
  {id:48, scene:'cabin', class:'steering-wheel', mask:'cabin-steering-wheel',  name:'Steering Wheel',                   explanation:TXT.steering, box:[18.75, 42.38, 1, 41.17]},
  {id:49, scene:'cabin', class:'wiper-stalk', mask:'cabin-wiper-stalk',     name:'Wiper Stalk',                      explanation:TXT.wiper,    box:[41.0,47.25,19.83,29.17]},

  // --- console (Center Stack) ---
  {id:6, scene:'console', class:'mode-button', mask:'console-mode-button', name:'Mode Button', explanation:'Elige hacia dónde sale el aire: a la cara, a los pies, al parabrisas o combinaciones.', box:[62.25,68.12,52,58.5]},
  {id:7, scene:'console', class:'defog-defrost-controls', mask:'console-defog-defrost-controls', name:'Defog / Defrost Controls', explanation:'Desempañan los vidrios: el botón de enfrente manda aire al parabrisas y el de atrás calienta el vidrio trasero para quitar la humedad o el hielo.', box:[36,46.25,53.33,71.17]},
  {id:8, scene:'console', class:'tune-knob', mask:'console-tune-knob', name:'Tune Knob', explanation:'Gira para buscar estaciones o moverte por los menús del radio, y al presionarla seleccionas.', box:[69.38, 74.12, 35.67, 42.67]},
  {id:9, scene:'console', class:'recirculation-button', mask:'console-recirculation-button', name:'Recirculation Button', explanation:'Hace que el aire circule dentro del carro en lugar de meter aire de afuera. Sirve para enfriar más rápido o evitar polvo y olores.', box:[58.38, 63.12, 59.17, 66.67]},
  {id:10, scene:'console', class:'fan-speed-buttons', mask:'console-fan-speed-buttons', name:'Fan Speed Buttons', explanation:'Suben o bajan la fuerza del ventilador, o sea, qué tan fuerte sale el aire.', box:[24.5, 36.38, 54.17, 72.33]},
  {id:12, scene:'console', class:'climate-control-dial', mask:'console-climate-control-dial', name:'Climate Control Dial', explanation:'Gira para subir o bajar la temperatura. En AUTO el carro ajusta el aire solo y en OFF se apaga el clima.', box:[44.62,59.38,50.33,72]},
  {id:13, scene:'console', class:'climate-button', mask:'console-climate-button', name:'Climate Button', explanation:'Muestra en la pantalla la información y los ajustes del clima.', box:[62.88,68.12,58.17,65.33]},
  {id:14, scene:'console', class:'ac-button', mask:'console-ac-button', name:'A/C Button', explanation:'Enciende o apaga el aire acondicionado para enfriar y quitar la humedad del aire.', box:[56,62.88,52,59]},
  {id:15, scene:'console', class:'infotainment-display', mask:'console-infotainment-display', name:'Infotainment Display', explanation:'Pantalla central donde ves el radio, la hora, el teléfono y las opciones de conexión del carro.', box:[24.88, 63.25, 2.17, 40.83]},
  {id:50, scene:'console', class:'volume-knob', mask:'console-volume-knob', name:'Volume Knob', explanation:'Gira para subir o bajar el volumen y al presionarla enciende o apaga el audio.', box:[9.12,18.75,30.5,42.5]},
  {id:51, scene:'console', class:'audio-panel', mask:'console-audio-panel', name:'Audio Panel', explanation:'Botones para cambiar la fuente de audio y saltar de estación o de canción.', box:[0.88, 16.88, 0, 27.17]},
  {id:52, scene:'console', class:'setup-panel', mask:'console-setup-panel', name:'Setup Panel', explanation:'Botones de acceso rápido a las apps, el teléfono y los ajustes del sistema de audio.', box:[65.88,73.62,14.5,34.5]},
  {id:53, scene:'console', class:'passenger-airbag-indicator', mask:'console-passenger-airbag-indicator-panel', name:'Passenger Airbag Indicator Panel', explanation:TXT.airbag, box:[27.5,67.38,70,87.17]},

  // --- shifter (Gear Shifter Console) ---
  {id:16, scene:'shifter', class:'gear-position-display', mask:'shifter-gear-position-display', name:'Gear Position Display', explanation:'Muestra en qué posición está la palanca: P (estacionar), R (reversa), N (neutral) o D (manejar).', box:[36.75,56,53.17,79.17]},
  {id:17, scene:'shifter', class:'charger-port-panel', mask:'shifter-charger-port', name:'Charger Port Panel', explanation:'Aquí conectas el cargador del celular u otros accesorios, en la toma de 12 voltios o en el puerto para cargar.', box:[15.38, 36.5, 22.17, 38.83]},
  {id:18, scene:'shifter', class:'gear-shift-lever', mask:'shifter-shift-lever', name:'Shift Lever', explanation:TXT.gear, box:[38.38,66.38,16,78.67]},
  {id:54, scene:'shifter', class:'passenger-airbag-indicator', mask:'shifter-passenger-airbag-indicator-panel', name:'Passenger Airbag Indicator Panel', explanation:TXT.airbag, box:[7.75, 44.12, 0, 12.33]},
  {id:55, scene:'shifter', class:'door-speaker', mask:'shifter-door-speaker', name:'Door Speaker', explanation:'Bocina integrada en la puerta que reproduce el sonido del sistema de audio.', box:[70, 83.38, 6.83, 27.83]},
  {id:56, scene:'shifter', class:'shift-boot', mask:'shifter-shift-boot', name:'Shift Boot', explanation:'Es la funda que cubre la base de la palanca y evita que entre polvo o suciedad al mecanismo.', box:[38.38, 66.38, 38, 78.83]},
  {id:57, scene:'shifter', class:'shifter-base', mask:'shifter-shifter-base', name:'Shifter Base', explanation:'Es el marco que rodea la palanca y la sostiene en su lugar en la consola central.', box:[33, 70.38, 37.33, 84]},
  {id:58, scene:'shifter', class:'passenger-seat', mask:'shifter-passenger-seat', name:'Passenger Seat', explanation:'Es el asiento donde viaja el copiloto. Se puede ajustar para ir más cómodo.', box:[81, 100, 26.33, 86.5]},
  {id:72, scene:'shifter', class:'cup-holders', mask:'side-cup-holders-Shifter', name:'Cup Holders', explanation:'Espacios en la consola central para colocar vasos o botellas mientras manejas.', box:[65.38, 96.38, 78.83, 100]},  

  // --- dash (Driver Dashboard) ---
  {id:24, scene:'dash', class:'cruise-control-pad', mask:'dash-cruise-control-pad', name:'Cruise Control Pad', explanation:'Botones del volante para activar el control de crucero y fijar la velocidad, así no tienes que mantener el pie en el acelerador.', box:[52.88, 59.88, 58.67, 67.67]},
  {id:25, scene:'dash', class:'hazard-button', mask:'dash-hazard-button', name:'Hazard Warning Button', explanation:TXT.hazard, box:[73.12,77.38,32.17,37.67]},
  {id:26, scene:'dash', class:'center-dashboard-module', mask:'dash-center-dashboard-module', name:'Center Dashboard Module', explanation:'Panel central del tablero donde están la pantalla, el radio y los controles del clima.', box:[61.88, 90.75, 39.67, 68.67]},
  {id:27, scene:'dash', class:'instrument-cluster', mask:'dash-instrument-cluster', name:'Instrument Cluster', explanation:'Aquí ves información como velocidad, combustible y luces de advertencia.', box:[24.38, 58, 37, 57]},
  {id:28, scene:'dash', class:'audio-control-pad', mask:'dash-audio-control-pad', name:'Audio Control Pad', explanation:'Botones en el volante para subir o bajar el volumen y cambiar de estación o de canción sin soltar el volante.', box:[20.62, 29, 67.67, 77.67]},
  {id:33, scene:'dash', class:'dash-tweeter', mask:'dash-dash-tweeter', name:'Dash Tweeter', explanation:'Bocina pequeña en lo alto del tablero que reproduce los sonidos agudos del sistema de audio.', box:[9.12,22.38,35.67,40.33]},
  {id:59, scene:'dash', class:'master-door-switch-panel', mask:'dash-master-door-switch-panel', name:'Master Door Switch Panel', explanation:'Desde aquí el conductor controla las ventanas y los seguros de las puertas.', box:[0, 12.12, 79.17, 100]},
  {id:60, scene:'dash', class:'hands-free-buttons', mask:'dash-hands-free-buttons', name:'Hands-Free Buttons', explanation:'Botones del volante para contestar o colgar llamadas y usar el control por voz sin quitar las manos del volante.', box:[27.62,36.88,77,87.67]},
  {id:61, scene:'dash', class:'left-spoke-panel', mask:'dash-left-spoke-panel', name:'Left Spoke Panel', explanation:'Es el lado izquierdo del volante, con los controles de audio y de llamadas al alcance del pulgar.', box:[16.5, 37, 60.5, 88]},
  {id:62, scene:'dash', class:'right-spoke-panel', mask:'dash-right-spoke-panel', name:'Right Spoke Panel', explanation:'Es el lado derecho del volante, donde están los botones del control de crucero y de la computadora de viaje.', box:[48.75, 63.25, 55.67, 81.33]},
  {id:63, scene:'dash', class:'trip-drive-mode-buttons', mask:'dash-trip-drive-mode-buttons', name:'Trip / Drive Mode Buttons', explanation:'Sirven para cambiar la información de viaje que muestra el tablero y para elegir el modo de manejo.', box:[51.25,57.5,68.67,81.33]},
  {id:67, scene:'dash', class:'gear-shift-lever', mask:'dash-gear-lever', name:'Gear Shift Lever', explanation:TXT.gear, box:[71.75, 89, 75.83, 100]},
  {id:71, scene:'dash', class:'my-beautiful-wife', mask:'dash-my-beautiful-wife', name:'My Beautiful Wife', explanation:'Escribe aquí tu descripción.', box:[25.88,65,79.17,100]},

  // --- dash (more) ---
  {id:29, scene:'dash', class:'turn-signal-stalk', mask:'turn-signal-dash', name:'Turn Signal Stalk', explanation:'Indica a los demás que vas a dar vuelta o cambiar de carril.', box:[19.25,32.94,56.75,60.42]},
  {id:30, scene:'dash', class:'my-beautiful-wife', mask:'dash-my-beautiful-wife', name:'My Beautiful Wife', explanation:'Protege al conductor en ciertas colisiones.', box:[25.88,65,79.17,100]},
  {id:31, scene:'dash', class:'wiper-stalk', mask:'window-wiper-dash', name:'Wiper / Washer Stalk', explanation:TXT.wiper, box:[54.56,61.56,53.0,56.83]},
];
const ALL_CARDS = RAW_CARDS.map(c => c.mask ? {...c, mask:`assets/masks/${c.mask}.png`} : c);

// Photos in the game, in the order Reseña walks through them. All six photos are in.
const ACTIVE_SCENES = ['wheel', 'cabin', 'console', 'shifter', 'dash'];
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
const PAN_MARGIN = 0.02;   // how far past the photo's edge you can drag when the photo fills the screen (fraction of the photo)
const WORLD_PAD  = 0.6;    // blurred extension on EACH side (fraction of the photo). Needs to be big enough for the furthest zoom-out.
let zoomOut = (() => { try { return Math.min(1, Math.max(0, parseFloat(localStorage.getItem('kiaZoomOut')) || 0)); } catch(e){ return 0; } })();   // 0 = photo fills the screen · 1 = zoomed out as far as it goes (menu slider)
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
  const layers = [...cards].sort((a, b) => areaOf(b) - areaOf(a)).map(c => highlightLayer(c, allOn)).join('');   // small parts on top
  return `<div class="viewer" data-scene="${scene}">
      <div class="world">
        <canvas class="pad"></canvas>
        <div class="photo" style="left:${off}%;top:${off}%;width:${size}%;height:${size}%;--feather:${EDGE_FEATHER}%"><img class="base" src="${s.image}" alt="${s.title}" draggable="false"/>${layers}</div>
      </div>
      <div class="fov"></div><div class="fov-dark"></div>
      <div class="hud"></div><div class="sel-pill"></div><div class="look-hint">↔↕ Arrastra para mirar alrededor</div>
    </div>
    <button class="fab" data-action="menu" aria-label="Menú">☰</button>`;
}

let viewerCtl = null;
function mountViewer(onTap, getPrefer){
  const el = document.querySelector('.viewer'); if(!el) return null;
  const world = el.querySelector('.world'), photo = el.querySelector('.photo'), scene = el.dataset.scene, sc = SCENES[scene], hint = el.querySelector('.look-hint');
  paintBackdrop(el.querySelector('.pad'), scene, el.querySelector('.base'));
  let vw = 0, vh = 0, W = 0, H = 0, pw = 0, ph = 0, x = 0, y = 0, cx = .5, cy = .5, raf = 0;   // W,H = whole world · pw,ph = the sharp photo inside it
  // pan limits per axis: while the photo fills the screen you can drag across it (+ a thin margin);
  // once it is smaller than the screen on an axis it simply stays centred on that axis
  const axis = (v, view, o, size, m) => { const lo = o-m, hi = o+size+m; return hi-lo >= view ? Math.min(-lo, Math.max(view-hi, v)) : view/2-(o+size/2); };
  const clampX = v => axis(v, vw, pw*WORLD_PAD, pw, pw*PAN_MARGIN), clampY = v => axis(v, vh, ph*WORLD_PAD, ph, ph*PAN_MARGIN);
  const clamp = () => { x = clampX(x); y = clampY(y); };
  const apply = () => { world.style.transform = `translate3d(${x}px,${y}px,0)`; };
  const syncCenter = () => { cx = (vw/2-x)/W; cy = (vh/2-y)/H; };
  function layout(){
    vw = el.clientWidth; vh = el.clientHeight; if(!vw || !vh) return;
    const kNear = Math.max(vh*PHOTO_ZOOM.h/sc.h, vw*PHOTO_ZOOM.w/sc.w);                                   // photo fills the screen
    const kFar  = Math.min(kNear, Math.max(Math.min(vw/sc.w, vh/sc.h), vw/(sc.w*(1+2*WORLD_PAD)), vh/(sc.h*(1+2*WORLD_PAD))));   // whole photo in view, but never more than the blurred extension can cover
    const k = kNear*Math.pow(kFar/kNear, zoomOut); pw = sc.w*k; ph = sc.h*k;
    W = pw*(1+2*WORLD_PAD); H = ph*(1+2*WORLD_PAD);
    world.style.width = W+'px'; world.style.height = H+'px';
    x = vw/2-cx*W; y = vh/2-cy*H; clamp(); apply(); syncCenter();
  }
  layout(); new ResizeObserver(layout).observe(el);

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

  viewerCtl = { relayout: layout, lookAt(p){   // smoothly pan so a part is centred
    cancelAnimationFrame(raf);
    const ox = pw*WORLD_PAD, oy = ph*WORLD_PAD;
    const tx = vw/2-(ox+(p.box[0]+p.box[1])/200*pw), ty = vh/2-(oy+(p.box[2]+p.box[3])/200*ph), x0 = x, y0 = y, t0 = performance.now();
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
  setBodyCam(true);
  app.innerHTML = viewerHTML(scene, cardsForScene(scene), allOn);
  $('.hud').innerHTML = hud;
  return mountViewer(onTap, getPrefer);
}

function setZoomOut(t){
  zoomOut = Math.min(1, Math.max(0, t));
  try { localStorage.setItem('kiaZoomOut', String(zoomOut)); } catch(e){}
  if(viewerCtl && document.querySelector('.viewer')) viewerCtl.relayout();
}
const zoomRowHTML = () => document.querySelector('.viewer') ? `<div class="zoom-row">
      <label class="zoom-title" for="zoomSlider">🔍 Zoom</label>
      <input id="zoomSlider" class="zoom-slider" type="range" min="0" max="100" step="1" value="${Math.round(zoomOut*100)}" aria-label="Alejar la foto"/>
      <div class="zoom-ends"><span>Cerca</span><span>Lejos</span></div>
    </div>` : '';

function menuPopup(){
  play('pageForward');
  const inExam = state.screen === 'exam', inReview = state.screen === 'review';
  popup(`<div class="mini-tag">KIA SOUL 2015</div><h2>Menú</h2>
    ${zoomRowHTML()}
    ${inExam ? `<div class="pop-stat"><span class="progress-pill">${state.examIndex+1}/${state.exam.length}</span><span class="hearts">${heartsText()}</span></div>` : ''}
    <div class="pop-col">
      <button class="${inReview ? 'yellow-btn' : 'secondary-btn'}" data-action="review">${ICON.book} Reseña</button>
      <button class="${inExam ? 'yellow-btn' : 'secondary-btn'}" data-action="exam">${ICON.play} Examen</button>
      <button class="secondary-btn" data-action="mistakes">Review all the mistakes</button>
      <button class="secondary-btn" data-action="home">${ICON.home} Inicio</button>
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
function beginIntro(onDone){
  introTimers.forEach(clearTimeout); introTimers = []; introEl?.remove();
  introEl = document.createElement('div'); introEl.className = 'intro-scrim';
  document.body.appendChild(introEl);
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
    beginIntro(() => { state.answerLocked = false; shimmerNow(); showQCard(); });   // after 3, 2, 1, GO!: every mask shimmers and the card slides up
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

document.addEventListener('input', e => { if(e.target.classList && e.target.classList.contains('zoom-slider')) setZoomOut(e.target.value/100); });

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]'); if(!el) return;
  // The "click" that finishes the very tap that opened a popup lands on the popup's backdrop and used to close it
  // again instantly (the sheet flashed and vanished). Clicks in the first moments of a popup's life are ignored.
  const ov = el.closest('.explain-overlay'); if(ov && performance.now() - (ov._born || 0) < 400) return;
  switch(el.dataset.action){
    case 'menu':             menuPopup(); break;
    case 'closeExplanation': closePops(); break;
    case 'home':             closePops(); home(); play('pageBack'); break;
    case 'review':           closePops(); state.screen = 'review'; state.sceneIndex = 0; render(); play('pageForward'); break;
    case 'nextReview':       closePops(); state.sceneIndex = (state.sceneIndex+1) % ACTIVE_SCENES.length; render(); play('next'); break;
    case 'exam':             closePops(); startExam(); break;
    case 'mistakes':
      if(state.screen === 'mistakes' && $('.viewer')) showMistakeList();
      else { closePops(); state.screen = 'mistakes'; render(); }
      break;
    case 'mistakeOpen':      openMistake(Number(el.dataset.id)); break;
  }
});

renderHome();
