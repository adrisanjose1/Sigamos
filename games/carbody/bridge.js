/* Sigamos integration bridge for the Car Body game (Car Body card).
   Loaded by index.html AFTER app.js, so home(), startExam(), state etc. exist.
   The game's own files are untouched (its own eye, Reseña "how it works" and 3-2-1-GO keep working).

   URL params set by the Sigamos intro page:
     ?mode=review | quiz     open straight into Reseña / Examen
     &uni=1                  "Música universal" (this game has no music of its own, nothing to switch off)
     &dev=win | lose         Developer box armed: every Examen finishes by itself
   Messages from the intro page:  { sigamos: "dev", mode: "win" | "lose" | "off" }
   Messages to the intro page:    { sigamos: "exit" }                                                 */
(function () {
  var params = new URLSearchParams(location.search);
  var parentWin = window.parent !== window ? window.parent : null;
  var tell = function (msg) { try { if (parentWin) parentWin.postMessage(msg, "*"); } catch (e) {} };

  /* every "Inicio" button goes through the game's eye and then home(): after it, go back to Sigamos */
  var origHome = window.home;
  window.home = function () { origHome.apply(this, arguments); tell({ sigamos: "exit" }); };

  /* ---- Developer box: Win all / Lose all (Examen only; Reseña has no score) ---- */
  var armed = "off", dv = params.get("dev");
  if (dv === "win" || dv === "lose") armed = dv;

  function autoFinish(kind) {
    if (state.screen !== "exam" || !state.exam.length) return;
    clearOverlays();                                      // pink dim, queued 3-2-1, question card, pop-ups
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
    state.screen = "results"; render();
  }

  var origStart = window.startExam;
  window.startExam = function () {
    origStart.apply(this, arguments);
    if (armed !== "off") setTimeout(function () { autoFinish(armed); }, 300);
  };

  addEventListener("message", function (e) {
    if (e.source !== parentWin || !e.data || e.data.sigamos !== "dev") return;
    armed = (e.data.mode === "win" || e.data.mode === "lose") ? e.data.mode : "off";
    if (armed !== "off") autoFinish(armed);
  });

  /* ---- open straight into Reseña / Examen ----
     The game starts with its eye SHUT and opens it on the home screen. Going through the home screen first would show
     it for a moment, so Reseña / Examen are built right away under the shut eye (what the game's own buttons do), and
     the part that normally comes after the eye has opened (the how-it-works card, the 3-2-1-GO) runs once it has. */
  var mode = params.get("mode");
  if (mode === "review" || mode === "quiz") {
    var afterEye = function (fn) {
      var tries = 0;
      (function poll() { if (!eye.classList.contains("busy") || ++tries > 60) fn(); else setTimeout(poll, 100); })();
    };
    clearOverlays();
    if (mode === "review") {
      var first = !CarIntro.seen();
      state.screen = "review"; state.sceneIndex = 0; render();
      if (first) { CarIntro.mount(); afterEye(function () { CarIntro.start(); }); }
    } else {
      startExam();
      afterEye(function () { if (pendingCountdown) pendingCountdown(); });
    }
  }
})();
