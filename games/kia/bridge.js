/* Sigamos integration bridge for the Kia Soul game (Interior card).
   Loaded by index.html AFTER app.js, so home(), startExam(), state etc. exist. app.js is untouched.
   games/shared/sigamos-eye.js (loaded in <head>) gives it the Eye + the Reseña "how it works" card.

   URL params set by the Sigamos intro page:
     ?mode=review | quiz     open straight into Reseña / Examen
     &uni=1                  "Música universal" (the Kia game has no music of its own, nothing to switch off)
     &dev=win | lose         Developer box armed: every Examen finishes by itself
   Messages from the intro page:  { sigamos: "dev", mode: "win" | "lose" | "off" }
   Messages to the intro page:    { sigamos: "exit" }

   THE EYE  (see sigamos-eye.js)
     page opens        eye shut -> opens                       (door-slide)
     Examen            eye shuts (door-close) -> pink dim under it -> eye opens -> ¡Preparados! / Listos / ¡GO!
     Reseña            eye shuts -> pink dim -> eye opens -> "how it works" card -> Listo? -> normal
     Inicio / exit     eye shuts, then Sigamos takes over                                                    */
(function () {
  var params = new URLSearchParams(location.search);
  var parentWin = window.parent !== window ? window.parent : null;
  var tell = function (msg) { try { if (parentWin) parentWin.postMessage(msg, "*"); } catch (e) {} };
  var Eye = window.SigamosEye;
  var SHOW_TUTORIAL = true;       // false = no "how it works" card
  var SHOW_ONCE = false;          // true  = the card only shows the very first time Reseña is opened (this browser)

  /* ---- no eye file? then behave exactly like before ---- */
  if (!Eye) Eye = { go: function (f) { f(); }, close: function (f) { f && f(); }, open: function () {}, isOpen: function () { return false; },
                    afterOpen: function (f) { f(); }, boot: function () {}, pinkScrim: function () { return document.createElement("i"); },
                    cancelPending: function () {}, tutorial: function () {}, hand: function () { return ""; } };

  var lastScreen = null;          // which kind of screen the eye last switched to ("review" | "exam" | "home" ...)

  /* ---- 3, 2, 1, GO! waits for the eye: the pink dim is already there, the countdown starts once the eye is open ---- */
  var origBegin = window.beginIntro;
  window.beginIntro = function () {
    var self = this, args = arguments;
    if (Eye.isOpen()) return origBegin.apply(self, args);
    var pre = Eye.pinkScrim();
    Eye.afterOpen(function () {
      origBegin.apply(self, args);
      if (typeof introEl !== "undefined" && introEl) introEl.style.animation = "none";   // the game's own dim takes over without fading in again
      pre.remove();
    });
  };

  /* ---- every "Inicio" button in the game goes through home(): eye shuts, then back to Sigamos ---- */
  var origHome = window.home;
  window.home = function () {
    var self = this, args = arguments;
    Eye.close(function () {
      Eye.cancelPending();
      lastScreen = "home";
      origHome.apply(self, args);
      tell({ sigamos: "exit" });
      if (!parentWin) Eye.open();           // opened on its own (no Sigamos around): just show the game's home again
    });
  };

  /* ---- Reseña: entering it from the menu / results / mistakes (or at page start) = eye + "how it works" ---- */
  var origRender = window.render;
  window.render = function () {
    var self = this, args = arguments, scr = state.screen, entering = scr === "review" && lastScreen !== "review";
    var run = function () {
      lastScreen = scr;
      origRender.apply(self, args);
      if (entering) reviewTutorial();
    };
    if (entering) Eye.go(run); else run();
  };

  /* ---- Examen: eye shuts, new Examen is built under it ---- */
  var armed = "off", dv = params.get("dev");
  if (dv === "win" || dv === "lose") armed = dv;

  var origStart = window.startExam;
  window.startExam = function () {
    var self = this, args = arguments;
    Eye.go(function () {
      lastScreen = "exam";
      origStart.apply(self, args);
      if (armed !== "off") setTimeout(function () { autoFinish(armed); }, 300);
    });
  };

  /* ---- Developer box: Win all / Lose all (Examen only; Reseña has no score) ---- */
  function autoFinish(kind) {
    if (state.screen !== "exam" || !state.exam.length) return;
    Eye.cancelPending();
    introTimers.forEach(clearTimeout); introTimers = []; if (introEl) { introEl.remove(); introEl = null; }
    removeQCard(); closePops();
    var total = state.exam.length, right = total;
    state.mistakes = [];
    if (kind === "lose") {
      var lo = Math.ceil(total * 0.10), hi = Math.max(lo, Math.floor(total * 0.20));
      right = lo + Math.floor(Math.random() * (hi - lo + 1));
      shuffle(state.exam).slice(0, total - right).forEach(function (p) {
        if (!state.mistakes.some(function (m) { return m.class === p.card.class; })) state.mistakes.push(p.card);
      });
    }
    state.score = right; state.examIndex = total - 1; state.answerLocked = true;
    state.hearts = kind === "lose" ? 0 : MAX_HEARTS;
    state.screen = "results"; lastScreen = "results"; render();
  }

  addEventListener("message", function (e) {
    if (e.source !== parentWin || !e.data || e.data.sigamos !== "dev") return;
    armed = (e.data.mode === "win" || e.data.mode === "lose") ? e.data.mode : "off";
    if (armed !== "off") autoFinish(armed);
  });

  /* =====================================================================
     RESEÑA "HOW IT WORKS" CARD  (from intro-overlay.txt, made for this game's real parts)
       1 Tap   a part lights up and its name + explanation pop in
       2 Drag  the photo slides around (the game's "Arrastra para mirar alrededor")
       3 Zoom  the photo zooms out and back while a hand drags the menu's zoom slider
       4 Menu  ☰ is tapped, the menu opens, "Examen" flashes
     ===================================================================== */
  var css = document.createElement("style");
  css.textContent = [
    ".sg-ph.sg-mask{opacity:0}.sg-scene.on .sg-ph.sg-mask{animation:sgFade .5s 1s both}",
    ".sg-fab{position:absolute;left:266px;top:14px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.92);color:#7a6570;font-size:1.4rem;",
    "  display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.25)}",
    ".sg-menu{position:absolute;left:50%;top:50%;width:210px;margin:-78px 0 0 -105px;background:#fff;border-radius:22px;padding:12px 14px 14px;text-align:center;",
    "  box-shadow:0 14px 30px rgba(20,25,35,.4);opacity:0;transform:scale(.6)}",
    ".sg-scene.on .sg-menu{animation:sgCardPop .4s 1.25s cubic-bezier(.2,1.25,.4,1) both}",
    ".sg-menu h4{margin:0 0 8px;color:#ef5f86;font-size:1.3rem;line-height:1}",
    ".sg-menu p{margin:5px 0 0;padding:8px 0;border-radius:14px;background:#f5ecef;color:#7a6570;font-weight:800;font-size:.9rem}",
    ".sg-scene.on .sg-menu p.fl{animation:sgFlash .55s 2.3s ease-in-out 4 alternate both}",
    "@keyframes sgFlash{from{background:#f5ecef}to{background:#ffd94f;color:#4e3f25}}",
    ".sg-zrow{position:absolute;left:14px;right:14px;bottom:10px;height:78px;background:#fff6f9;border:2px solid #ffd2df;border-radius:18px;padding:8px 14px;text-align:left}",
    ".sg-zrow b{display:block;color:#db5b7c;font-size:.95rem;line-height:1.1}",
    ".sg-track{position:absolute;left:18px;right:18px;top:38px;height:6px;border-radius:3px;background:#ffc7d6}",
    ".sg-knob{position:absolute;left:0;top:-9px;width:24px;height:24px;margin-left:-12px;border-radius:50%;background:#ef5f86;box-shadow:0 2px 6px rgba(0,0,0,.3);transition:left 1.6s ease-in-out}",
    ".sg-ends{position:absolute;left:14px;right:14px;bottom:5px;display:flex;justify-content:space-between;font-size:.76rem;font-weight:800;color:#b58a98}"
  ].join("\n");
  document.head.appendChild(css);

  function reviewTutorial() {
    if (!SHOW_TUTORIAL) return;
    if (SHOW_ONCE) { try { if (localStorage.getItem("sigamos.kia.tutorial")) return; localStorage.setItem("sigamos.kia.tutorial", "1"); } catch (e) {} }
    var H = Eye.hand, ph = function (src, st, cls, id) { return '<img class="sg-ph ' + (cls || "") + '" ' + (id ? 'id="' + id + '" ' : "") + 'src="' + src + '" alt="" draggable="false" style="' + st + '">'; };
    var wheel = state && SCENES && SCENES.wheel ? SCENES.wheel.image : "assets/base/wheel.jpg";
    var cabin = SCENES && SCENES.cabin ? SCENES.cabin.image : "assets/base/cabin.jpg";
    var steer = (typeof CARDS !== "undefined" && CARDS.find(function (c) { return c.scene === "wheel" && c.class === "steering-wheel"; })) || null;
    var steerMask = steer && steer.mask ? steer.mask : "assets/masks/steering-wheel.png";
    var steerName = steer ? steer.name : "Steering Wheel";
    var steerTxt = steer ? steer.explanation : "Te ayuda a dirigir el carro hacia la izquierda o la derecha.";

    Eye.tutorial({
      scenes: [
        { cap: "Toca una parte para ver qué significa", ms: 5600,
          html: '<div class="sg-win">' + ph(wheel, "left:-47px;top:0;width:440px;height:330px") + ph(steerMask, "left:-47px;top:0;width:440px;height:330px", "sg-mask") + '</div>' +
                '<i class="sg-ripple" style="left:163px;top:106px"></i>' + H("tap", 163, 106) +
                '<div class="sg-pop"><b>' + steerName + '</b><span>' + steerTxt + '</span></div>' },
        { cap: "Arrastra para mirar alrededor de la foto", ms: 4600,
          html: '<div class="sg-win">' + ph(cabin, "left:-137px;top:-60px;width:600px;height:450px;transition:left 1.1s ease-in-out", "", "sgPan") + '</div>' +
                '<div class="sg-dots"><i></i><i class="on"></i><i></i></div>' + H("swipe", 163, 255, "animation-duration:4.4s"),
          run: function (se, T) {
            var pan = se.querySelector("#sgPan"), hand = se.querySelector(".sg-swipe"), dots = se.querySelectorAll(".sg-dots i");
            function dot(i) { dots.forEach(function (d, k) { d.classList.toggle("on", k === i); }); }
            pan.style.transition = "none"; pan.style.left = "-137px"; hand.style.left = "163px"; dot(1); void pan.offsetWidth; pan.style.transition = "";
            T(function () { pan.style.left = "-270px"; hand.style.left = "90px"; dot(2); }, 600);
            T(function () { pan.style.left = "-4px"; hand.style.left = "236px"; dot(0); }, 1700);
            T(function () { pan.style.left = "-137px"; hand.style.left = "163px"; dot(1); }, 2900);
          } },
        { cap: "Con el zoom del menú acercas o alejas la foto", ms: 4800,
          html: '<div class="sg-win" style="bottom:98px">' + ph(cabin, "left:-100px;top:-60px;width:520px;height:390px;filter:blur(9px) brightness(.8)") +
                '<div id="sgZoom" style="position:absolute;inset:0;transform:scale(1);transition:transform 1.6s ease-in-out">' + ph(cabin, "left:-77px;top:-63px;width:480px;height:360px") + '</div></div>' +
                '<div class="sg-zrow"><b>🔍 Zoom</b><div class="sg-track"><i class="sg-knob" id="sgKnob"></i></div><div class="sg-ends"><span>Cerca</span><span>Lejos</span></div></div>' +
                H("swipe", 48, 281, "transition:left 1.6s ease-in-out;animation-duration:4.6s"),
          run: function (se, T) {
            var z = se.querySelector("#sgZoom"), k = se.querySelector("#sgKnob"), hand = se.querySelector(".sg-swipe");
            z.style.transition = k.style.transition = hand.style.transition = "none"; z.style.transform = "scale(1)"; k.style.left = "0"; hand.style.left = "48px"; void z.offsetWidth;
            z.style.transition = "transform 1.6s ease-in-out"; k.style.transition = "left 1.6s ease-in-out"; hand.style.transition = "left 1.6s ease-in-out";
            T(function () { z.style.transform = "scale(.6)"; k.style.left = "100%"; hand.style.left = "278px"; }, 700);
            T(function () { z.style.transform = "scale(1)"; k.style.left = "0"; hand.style.left = "48px"; }, 2700);
          } },
        { cap: "En el menú ☰ también entras al Examen", ms: 4600,
          html: '<div class="sg-win" style="background:#1c2430">' + ph(cabin, "left:-137px;top:-30px;width:600px;height:450px;filter:brightness(.7)") +
                '<div class="sg-fab">☰</div></div>' +
                '<i class="sg-ripple" style="left:288px;top:36px"></i>' + H("tap", 288, 36) +
                '<div class="sg-menu"><h4>Menú</h4><p>▤ Reseña</p><p class="fl">▶ Examen</p><p>⌂ Inicio</p></div>' }
      ]
    });
  }

  /* ---- open straight into Reseña / Examen (clicks the game's own buttons) ---- */
  var mode = params.get("mode");
  if (mode === "review" || mode === "quiz") {
    var b = document.querySelector('.big-btn.' + (mode === "quiz" ? "exam" : "review"));
    if (b) b.click();
  }

  Eye.boot(parentWin ? 450 : 200);       /* the eye opens: the first thing you see */
})();
