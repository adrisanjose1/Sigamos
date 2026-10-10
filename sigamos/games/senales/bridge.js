/* Sigamos integration bridge for the Señales game.
   Loaded by index.html AFTER the game's own script, so start(), goHome() etc. exist.
   It only talks to the game through its existing functions; the game's own code is untouched.

   URL params set by the Sigamos intro page:
     ?mode=review | quiz     start Reseña / Examen
     &uni=1                  "Música universal": the game's own background loop is off, the
                             music chosen in Ajustes keeps playing (outside this iframe)
     &dev=win | lose         Developer box armed: every run finishes by itself (see autoFinish)
   Messages from the intro page:  { sigamos: "dev", mode: "win" | "lose" | "off" }
   Messages to the intro page:    { sigamos: "exit" | "duck" | "unduck" }

   THE EYE  (games/shared/sigamos-eye.js, loaded in <head>)
     page opens        eye shut -> opens                       (door-slide)
     Examen            eye shuts (door-close) -> pink dim under it -> eye opens -> ¡Preparados! / Listos / ¡GO!
     Reseña            eye shuts -> pink dim -> eye opens -> "how it works" card -> Listo? -> normal
     Inicio / exit     eye shuts, then Sigamos takes over                                                    */
(function () {
  var params = new URLSearchParams(location.search);
  var parentWin = window.parent !== window ? window.parent : null;
  var tell = function (msg) { try { if (parentWin) parentWin.postMessage(msg, "*"); } catch (e) { /* not embedded */ } };
  var Eye = window.SigamosEye;
  var SHOW_TUTORIAL = true;       // false = no "how it works" card
  var SHOW_ONCE = false;          // true  = the card only shows the very first time Reseña is opened (this browser)
  if (!Eye) Eye = { go: function (f) { f(); }, close: function (f) { f && f(); }, open: function () {}, isOpen: function () { return false; },
                    afterOpen: function (f) { f(); }, boot: function () {}, pinkScrim: function () { return document.createElement("i"); },
                    cancelPending: function () {}, tutorial: function () {}, hand: function () { return ""; } };

  /* ---- back to Sigamos: every "← Inicio" / "Home" / "Volver a Sigamos" goes through goHome() ---- */
  var origGoHome = window.goHome;
  window.goHome = function () {
    var self = this, args = arguments;
    Eye.close(function () {                                /* the eye shuts first, then Sigamos takes over */
      Eye.cancelPending();
      origGoHome.apply(self, args);
      tell({ sigamos: "exit" });
      if (!parentWin) Eye.open();
    });
  };

  /* anything waiting under the eye (pink dim, queued 3-2-1, tutorial) goes when the game cleans up a run */
  var origCleanup = window.cleanupRun;
  window.cleanupRun = function () { Eye.cancelPending(); return origCleanup.apply(this, arguments); };

  /* 3, 2, 1, GO! waits for the eye: the pink dim is already there, the countdown starts once the eye is open */
  var origBegin = window.beginIntro;
  window.beginIntro = function () {
    var self = this, args = arguments;
    if (Eye.isOpen()) return origBegin.apply(self, args);
    var pre = Eye.pinkScrim();
    Eye.afterOpen(function () {
      origBegin.apply(self, args);
      if (typeof introEl !== "undefined" && introEl) introEl.style.animation = "none";
      pre.remove();
    });
  };

  /* ---- Música universal ---- */
  if (params.get("uni") === "1") {
    Sound.startBackgroundMusic = function () {};          /* the game's own loop never starts */
    /* the game hushes its background music while the letter / "try again" song plays: do the same to ours */
    [["startLetterMusic", "duck"], ["startSadMusic", "duck"], ["stopLetterMusic", "unduck"], ["stopSadMusic", "unduck"]]
      .forEach(function (p) {
        var orig = Sound[p[0]];
        Sound[p[0]] = function () { tell({ sigamos: p[1] }); return orig.apply(this, arguments); };
      });
  }

  /* ---- Developer box: Win all / Lose all ----
     armed = "win" | "lose" | "off". While armed, every run that starts finishes by itself, and a run
     already on screen finishes the moment the box is switched on.
       Reseña    (no score)  -> finishes the whole deck, the normal "Ready to Test?" pop-up appears
       Examen    win         -> every card right = 100%
                 lose        -> a random 10-20% of the cards right; the rest are recorded as mistakes
       Challenge same scores, through the game's own result pop-up
     It fills in the game's own score variables and then calls the game's own finishing functions,
     so the results screens, unlocks and mistake list behave exactly as after a real run. */
  var armed = "off", done = false;
  var dv = params.get("dev");
  if (dv === "win" || dv === "lose") armed = dv;

  function autoFinish(kind) {
    if (!document.getElementById("deckStack") || !sessionCards.length) return;   /* no run on screen */
    cleanupRun();                                          /* stops the countdown / Dudu intro, timers, pop-ups */
    done = true; wrong = false;
    var total = sessionCards.length;
    currentIndex = total - 1;
    if (currentMode === "review") { finishStackEnding(); return; }
    var right = total;
    if (kind === "lose") {
      var lo = Math.ceil(total * 0.10), hi = Math.floor(total * 0.20);
      if (hi < lo) hi = lo;
      right = lo + Math.floor(Math.random() * (hi - lo + 1));
    }
    runAnswered = total; runCorrect = right; runMistakes = [];
    sessionCards.slice().sort(function () { return Math.random() - 0.5; }).slice(0, total - right).forEach(function (c) {
      var opts = c.auto ? autoChoices(c) : (c.choices || []);
      recordMistake(c, opts.find(function (o) { return o !== c.es; }) || "");
    });
    if (currentMode === "challenge") { stopChallengeTimer(); showChallengeResult("done"); return; }
    finishStackEnding();
  }

  /* a finished run must not be redrawn by a card animation that was still waiting to fire */
  var origRender = window.renderStudy;
  window.renderStudy = function () { if (done) return; return origRender.apply(this, arguments); };

  var origStart = window.start;
  window.start = function (m) {
    var self = this, args = arguments;
    Eye.go(function () {                                   /* eye shuts, the new run is built under it, eye opens */
      done = false;
      origStart.apply(self, args);
      if (m === "review") reviewTutorial();
      if (armed !== "off") setTimeout(function () { autoFinish(armed); }, 300);
    });
  };

  addEventListener("message", function (e) {
    if (e.source !== parentWin || !e.data || e.data.sigamos !== "dev") return;
    armed = (e.data.mode === "win" || e.data.mode === "lose") ? e.data.mode : "off";
    if (armed !== "off") autoFinish(armed);
  });


  /* =====================================================================
     RESEÑA "HOW IT WORKS" CARD  (from intro-overlay.txt, made for this game)
       1 Mira   a card with the sign, Spanish and English
       2 Toca   a hand taps "Siguiente ♥", the card tumbles away, the next one comes up
       3 Examen a hand picks the right answer, it turns yellow
     ===================================================================== */
  var css = document.createElement("style");
  css.textContent = [
    ".sg-sc{position:absolute;left:50%;top:14px;width:176px;margin-left:-88px;background:#fff;border:6px solid #42b6ff;border-radius:22px;padding:8px 8px 6px;text-align:center;",
    "  box-shadow:0 8px 18px rgba(130,55,85,.2);transition:transform .7s cubic-bezier(.5,0,.8,.4),opacity .5s}",
    ".sg-sc img{display:block;margin:0 auto;width:112px;height:112px;object-fit:contain}",
    ".sg-sc b{display:block;color:#40333a;font-size:1rem;line-height:1.05;margin-top:2px}.sg-sc span{display:block;color:#8d7680;font-weight:700;font-size:.82rem;line-height:1.1}",
    ".sg-sc.c2{border-color:#ffd94f}.sg-sc.out{transform:translateY(260px) rotate(14deg);opacity:0}",
    ".sg-sc.pop{opacity:0;transform:scale(.6)}.sg-scene.on .sg-sc.pop{animation:sgCardPop .45s .35s cubic-bezier(.2,1.25,.4,1) both}",
    ".sg-sc.sml{width:150px;margin-left:-75px;top:8px;padding:6px}.sg-sc.sml img{width:64px;height:64px}.sg-sc.sml b{font-size:.8rem;margin-top:0}",
    ".sg-btn{position:absolute;left:50%;bottom:16px;width:150px;margin-left:-75px;padding:11px 0;border-radius:999px;background:#ffd94f;color:#4e3f25;font-weight:900;font-size:1.1rem;text-align:center;",
    "  box-shadow:0 7px 16px rgba(255,217,79,.35);transition:transform .15s}",
    ".sg-btn.press{transform:scale(.92)}",
    ".sg-opts{position:absolute;left:14px;right:14px;top:140px;display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".sg-o{background:#fff;border:3px solid #ffd2df;border-radius:14px;padding:7px 6px;font-weight:800;font-size:.72rem;color:#40333a;text-align:center;line-height:1.05;max-height:62px;overflow:hidden;transition:background .25s,border-color .25s}",
    ".sg-o.ok{background:#fff5b8;border-color:#ffd13d}"
  ].join("\n");
  document.head.appendChild(css);

  function reviewTutorial() {
    if (!SHOW_TUTORIAL || !sessionCards || !sessionCards.length) return;
    if (SHOW_ONCE) { try { if (localStorage.getItem("sigamos.senales.tutorial")) return; localStorage.setItem("sigamos.senales.tutorial", "1"); } catch (e) {} }
    var H = Eye.hand, n = sessionCards.length;
    var a = sessionCards[0], b = sessionCards[1 % n], c = sessionCards[2 % n], d = sessionCards[3 % n], e = sessionCards[4 % n];
    var esc = window.esc || function (x) { return String(x); };
    var card = function (k, cls) { return '<div class="sg-sc ' + (cls || "") + '"><img src="' + k.image + '" alt=""><b>' + esc(k.es) + '</b><span>' + esc(k.en) + '</span></div>'; };
    var opts = [b, a, d, e];            /* the right answer is the 2nd pill */
    Eye.tutorial({
      scenes: [
        { cap: "Cada tarjeta muestra la señal en español y en inglés", ms: 4200,
          html: card(a, "pop") + '<div class="sg-btn" style="opacity:.55">Siguiente ♥</div>' },
        { cap: "Toca Siguiente ♥ para ver la próxima señal", ms: 4800,
          html: card(b, "c2") + card(a, "") + '<div class="sg-btn" id="sgBtn">Siguiente ♥</div>' +
                '<i class="sg-ripple" style="left:163px;top:300px;--rd:.75s"></i>' + H("tap", 163, 300, "--td:.5s"),
          run: function (se, T) {
            var top = se.querySelectorAll(".sg-sc")[1], btn = se.querySelector("#sgBtn");
            top.classList.remove("out"); btn.classList.remove("press");
            T(function () { btn.classList.add("press"); }, 1000);
            T(function () { btn.classList.remove("press"); top.classList.add("out"); }, 1150);
          } },
        { cap: "Al terminar, el Examen te pone a prueba: elige la respuesta correcta", ms: 4800,
          html: card(c, "sml").replace("<b>" + esc(c.es) + "</b><span>" + esc(c.en) + "</span>", "<b>Elige una respuesta</b>") +
                '<div class="sg-opts">' + opts.map(function (o, i) { return '<div class="sg-o' + (i === 1 ? ' pick' : '') + '">' + "ABCD".charAt(i) + ". " + esc(i === 1 ? c.es : o.es) + '</div>'; }).join("") + '</div>' +
                '<i class="sg-ripple" style="left:243px;top:186px;--rd:1.05s"></i>' + H("tap", 243, 186, "--td:.8s"),
          run: function (se, T) {
            var p = se.querySelector(".sg-o.pick"); p.classList.remove("ok");
            T(function () { p.classList.add("ok"); }, 1500);
          } }
      ]
    });
  }

  /* ---- open straight into Reseña / Examen ---- */
  var mode = params.get("mode");
  if (mode === "review" || mode === "quiz") start(mode);

  Eye.boot(parentWin ? 450 : 200);       /* the eye opens: the first thing you see */
})();
