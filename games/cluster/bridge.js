/* Sigamos integration bridge for the Instrument Cluster game (Cluster card).
   Loaded by index.html AFTER app.js and flash.js, so home(), startExam(), state etc. exist.
   The game's own files are untouched (its own eye, pink Reseña overlay and 3-2-1-GO keep working).

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

  /* every "Inicio" button in the game goes through home(): after it, go back to Sigamos */
  var origHome = window.home;
  window.home = function () { origHome.apply(this, arguments); tell({ sigamos: "exit" }); };

  /* ---- Developer box: Win all / Lose all (Examen only; Reseña and Flashcards have no score) ---- */
  var armed = "off", dv = params.get("dev");
  if (dv === "win" || dv === "lose") armed = dv;

  function autoFinish(kind) {
    if (state.screen !== "exam" || !state.exam.length) return;
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
    state.screen = "results"; render();
  }

  var origStart = window.startExam;
  window.startExam = function (opts) {
    origStart.apply(this, arguments);
    if (armed !== "off") {
      setTimeout(function () { autoFinish(armed); }, 300);
      if (opts && opts.eye) setTimeout(function () { autoFinish(armed); }, 1100);   // the game's own eye builds the Examen ~0.7 s later
    }
  };

  addEventListener("message", function (e) {
    if (e.source !== parentWin || !e.data || e.data.sigamos !== "dev") return;
    armed = (e.data.mode === "win" || e.data.mode === "lose") ? e.data.mode : "off";
    if (armed !== "off") autoFinish(armed);
  });

  /* ---- open straight into Reseña / Examen (clicks the game's own buttons) ---- */
  var mode = params.get("mode");
  if (mode === "review" || mode === "quiz") {
    var b = document.querySelector('.big-btn.' + (mode === "quiz" ? "exam" : "review"));
    if (b) b.click();
  }
})();
