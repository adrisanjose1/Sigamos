/* Sigamos integration bridge for the Dirección game (the Listening Exam).
   Loaded by index.html AFTER the game's own script, so start(), goHome() etc. exist.
   The game's own code is untouched. It has its own "how it works" tutorial and its own 3-2-1-GO,
   so it does NOT use the Eye (only Interior and Señales do).

   URL params set by the Sigamos intro page:
     ?mode=review | quiz     start Reseña / Examen
     &uni=1                  "Música universal": the game's own background loop is off, the music chosen
                             in Ajustes keeps playing (outside this iframe)
     &dev=win | lose         Developer box armed: every run finishes by itself
   Messages from the intro page:  { sigamos: "dev", mode: "win" | "lose" | "off" }
   Messages to the intro page:    { sigamos: "exit" | "duck" | "unduck" }                              */
(function () {
  var params = new URLSearchParams(location.search);
  var parentWin = window.parent !== window ? window.parent : null;
  var tell = function (msg) { try { if (parentWin) parentWin.postMessage(msg, "*"); } catch (e) {} };

  /* ---- back to Sigamos: every "Inicio" / "Not Yet" / menu "Inicio" goes through goHome() ---- */
  var origGoHome = window.goHome;
  window.goHome = function () { origGoHome.apply(this, arguments); tell({ sigamos: "exit" }); };

  /* ---- Música universal ---- */
  if (params.get("uni") === "1") {
    Sound.startBackgroundMusic = function () {};
    [["startSadMusic", "duck"], ["stopSadMusic", "unduck"]].forEach(function (p) {
      var orig = Sound[p[0]];
      Sound[p[0]] = function () { tell({ sigamos: p[1] }); return orig.apply(this, arguments); };
    });
  }

  /* ---- Developer box: Win all / Lose all ----
     Fills in the game's own score variables, then calls its own finishing function, so the result
     screens behave exactly as after a real run. Reseña finishes the deck ("Ready to Test?" pop-up). */
  var armed = "off", done = false;
  var dv = params.get("dev");
  if (dv === "win" || dv === "lose") armed = dv;

  function autoFinish(kind) {
    if (!document.getElementById("deckStack") || !sessionCards.length) return;
    cleanupRun();
    done = true; wrong = false; answered = true;
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
      runMistakes.push({ n: c.n, chosen: "", voice: (typeof getVoice === "function" ? getVoice() : "adri") });
    });
    finishStackEnding();
  }

  var origRender = window.renderStudy;
  window.renderStudy = function () { if (done) return; return origRender.apply(this, arguments); };

  var origStart = window.start;
  window.start = function () {
    done = false;
    origStart.apply(this, arguments);
    if (armed !== "off") setTimeout(function () { autoFinish(armed); }, 300);
  };

  addEventListener("message", function (e) {
    if (e.source !== parentWin || !e.data || e.data.sigamos !== "dev") return;
    armed = (e.data.mode === "win" || e.data.mode === "lose") ? e.data.mode : "off";
    if (armed !== "off") autoFinish(armed);
  });

  /* ---- open straight into Reseña / Examen ---- */
  var mode = params.get("mode");
  if (mode === "review" || mode === "quiz") start(mode);
})();
