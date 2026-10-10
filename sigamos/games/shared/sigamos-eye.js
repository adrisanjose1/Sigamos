/* =====================================================================
   SIGAMOS EYE  -  shared by games/kia (Interior) and games/senales (Señales)
   ---------------------------------------------------------------------
   1) THE EYE: two white lids (top + bottom) that close / open from the middle like an eye.
        open  -> door-slide.wav        close -> door-close.wav   (assets/intro-audio)
        The page starts with the eye SHUT, then it opens.  Every time you leave something or
        enter something (Examen, Reseña, Inicio) the eye shuts, the screen changes underneath,
        the eye opens again.  Under the shut eye the pink dim is already there, so when the
        eye opens you see pink, and then the 3-2-1-GO (Examen) or the "how it works" card (Reseña).
   2) THE TUTORIAL: the pink "how it works" card (4 / 3 short scenes, then "Listo?") from
        intro-overlay.txt.  Hands are the intro's own hand-click.gif / hand-swipe.gif.
   The games' own code is never edited: each game's bridge.js calls this file.

   API (window.SigamosEye)
     isOpen()            true when the eye is open and nothing is moving
     go(work)            open eye: shut -> work() -> open.   already shut: just work().
     close(cb) / open(cb)
     afterOpen(fn)       run fn once the eye is fully open (now, if it already is)
     boot(ms)            first opening of the page (call once, from bridge.js)
     pinkScrim()         pink dim that waits under the shut eye; returns the element
     cancelPending()     forget everything waiting for the eye (pink dim, tutorial, queued countdowns)
     tutorial(cfg)       the "how it works" card   cfg = {scenes:[...], onDone}
     hand(kind, x, y)    <img> for a tap / swipe hand whose fingertip sits at x,y
   ===================================================================== */
(function () {
  "use strict";
  if (window.SigamosEye) return;

  var AUDIO = "../../assets/intro-audio/";
  var IMG   = "../../assets/intro-images/";
  var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var OPEN_MS = 900, SHUT_MS = 720;            // lid travel time (ms)  - keep in sync with the CSS below
  var LID_H = 64.5, RISE = 14;                 // lid height and how far the lid edge arches up in the middle (% of screen)

  /* ---------- lid shapes: the inner edge is an arch, so the eye opens widest in the middle ---------- */
  function lidPoly(top) {
    var k = RISE / LID_H * 100, pts = [], i, x, y;
    if (top) {                                  // bottom edge of the top lid: sides low, middle high
      pts.push("0% 0%", "100% 0%");
      for (i = 20; i >= 0; i--) { x = i * 5; y = 100 - k * (1 - Math.pow((x - 50) / 50, 2)); pts.push(x + "% " + y.toFixed(2) + "%"); }
    } else {                                    // top edge of the bottom lid: sides high, middle low
      for (i = 0; i <= 20; i++) { x = i * 5; y = k * (1 - Math.pow((x - 50) / 50, 2)); pts.push(x + "% " + y.toFixed(2) + "%"); }
      pts.push("100% 100%", "0% 100%");
    }
    return "polygon(" + pts.join(",") + ")";
  }

  var css = [
    ".sg-eye{position:fixed;inset:0;z-index:2000;pointer-events:none;overflow:hidden}",
    ".sg-eye.on{pointer-events:auto}",
    ".sg-lid{position:absolute;left:-1%;width:102%;height:" + LID_H + "%;background:#fff;will-change:transform;",
    "  transition:transform " + OPEN_MS + "ms cubic-bezier(.66,0,.3,1)}",
    ".sg-lid.top{top:0;transform:translateY(-101%);clip-path:" + lidPoly(true) + "}",
    ".sg-lid.bot{bottom:0;transform:translateY(101%);clip-path:" + lidPoly(false) + "}",
    ".sg-eye.shut .sg-lid{transform:none;transition-duration:" + SHUT_MS + "ms;transition-timing-function:cubic-bezier(.5,0,.3,1)}",
    ".sg-eye.rm .sg-lid{transition:none;opacity:0}.sg-eye.rm.shut .sg-lid{opacity:1}",
    /* pink dim that waits under the shut eye (same tint as the games' own 3-2-1 dim) */
    ".sg-pre{position:fixed;inset:0;z-index:90;background:rgba(255,140,156,.5)}",

    /* ---------- the "how it works" card (intro-overlay.txt) ---------- */
    ".sg-scrim{position:fixed;inset:0;background:rgba(255,140,156,.5);z-index:95;display:flex;align-items:center;justify-content:center;padding:16px;",
    "  transition:opacity .35s;font-family:'Baloo 2',system-ui,sans-serif}",
    ".sg-scrim.bye{opacity:0;pointer-events:none}",
    ".sg-card{position:relative;width:min(340px,88vw);height:410px;background:#fff;border:7px solid #ff6f92;border-radius:32px;overflow:hidden;",
    "  box-shadow:0 18px 40px rgba(130,55,85,.28);opacity:0;transform:scale(.8);transition:opacity .4s,transform .4s}",
    ".sg-card.in{animation:sgPop .4s cubic-bezier(.34,1.56,.64,1) both}",
    ".sg-card.gone{animation:none;opacity:0;transform:scale(.8);pointer-events:none}",
    "@keyframes sgPop{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}",
    ".sg-scene{position:absolute;inset:0 0 66px 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;",
    "  opacity:0;transform:scale(.92);transition:opacity .35s,transform .35s;pointer-events:none;overflow:hidden}",
    ".sg-scene.on{opacity:1;transform:none}",
    ".sg-cap{position:absolute;left:0;right:0;bottom:0;height:66px;display:flex;align-items:center;justify-content:center;padding:0 18px;",
    "  text-align:center;font-weight:800;color:#6d4a58;opacity:0;line-height:1.15}",
    ".sg-cap.show{animation:sgCapIn .5s .15s both}",
    "@keyframes sgCapIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    ".sg-ripple{position:absolute;width:26px;height:26px;margin:-13px;border:4px solid #ff6f92;border-radius:50%;opacity:0}",
    ".sg-scene.on .sg-ripple{animation:sgRipple .8s var(--rd,.55s) ease-out 2}",
    "@keyframes sgRipple{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(4.5)}}",
    ".sg-tap{position:absolute;width:110px;height:110px;margin:-39px 0 0 -53px;opacity:0;pointer-events:none;z-index:5}",   /* fingertip sits on left/top */
    ".sg-scene.on .sg-tap{animation:sgTapFade 1.7s var(--td,.3s) both}",
    "@keyframes sgTapFade{0%{opacity:0}12%{opacity:1}85%{opacity:1}100%{opacity:0}}",
    ".sg-swipe{position:absolute;width:110px;height:110px;margin:-21px 0 0 -34px;opacity:0;pointer-events:none;z-index:5;transition:left 1.1s ease-in-out,top 1.1s ease-in-out}",
    ".sg-scene.on .sg-swipe{animation:sgSwipeFade 4s .2s both}",
    "@keyframes sgSwipeFade{0%{opacity:0}8%{opacity:1}92%{opacity:1}100%{opacity:0}}",
    ".sg-pop{background:#fff;border:5px solid #ff4757;border-radius:18px;padding:7px 10px 8px;text-align:center;opacity:0;transform:scale(.6);",
    "  position:absolute;left:27px;right:27px;bottom:12px;z-index:4}",
    ".sg-scene.on .sg-pop{animation:sgCardPop .45s 1.25s cubic-bezier(.2,1.25,.4,1) both}",
    "@keyframes sgCardPop{to{opacity:1;transform:none}}",
    ".sg-pop b{display:block;opacity:0;color:#ef5f86;font-size:1.05rem;line-height:1.1}.sg-pop span{display:block;opacity:0;color:#6d4a58;font-size:.82rem;font-weight:700;line-height:1.15;margin-top:2px}",
    ".sg-scene.on .sg-pop b{animation:sgFade .4s 1.55s both}.sg-scene.on .sg-pop span{animation:sgFade .6s 2.2s both}",
    "@keyframes sgFade{from{opacity:0}to{opacity:1}}",
    ".sg-listo-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none}",
    ".sg-listo-wrap.show{opacity:1;pointer-events:auto}",
    ".sg-listo{border:0;background:none;cursor:pointer;font-family:'Luckiest Guy',cursive;font-size:clamp(4rem,22vw,6.5rem);color:#fff8ec;",
    "  -webkit-text-stroke:3px #ff5f5f;paint-order:stroke fill;text-shadow:3px 4px 0 #ff8a6b,6px 7px 0 #ff5f5f;transform:rotate(-4deg);padding:0 8px}",
    ".sg-listo-wrap.show .sg-listo{animation:sgListoPop .6s cubic-bezier(.34,1.56,.64,1) both,sgListoBob 1.6s .6s ease-in-out infinite alternate}",
    "@keyframes sgListoPop{from{opacity:0;transform:rotate(-4deg) scale(.2)}}",
    "@keyframes sgListoBob{to{transform:rotate(-4deg) scale(1.07)}}",
    ".sg-listo-tap{position:absolute;left:50%;top:56%;width:110px;height:110px;margin-left:-30px;opacity:0;pointer-events:none}",
    ".sg-listo-wrap.show .sg-listo-tap{animation:sgFade .4s 1.1s both}",
    ".sg-skip{position:absolute;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));border:0;background:rgba(255,255,255,.75);border-radius:14px;",
    "  padding:8px 14px;font:800 1rem 'Baloo 2',system-ui,sans-serif;color:#ed5f83;cursor:pointer}",
    /* small building blocks the scenes use */
    ".sg-win{position:absolute;inset:0;overflow:hidden}",
    ".sg-win img.sg-ph{position:absolute;display:block;max-width:none;user-select:none;-webkit-user-drag:none}",
    ".sg-dots{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:7px;z-index:3}",
    ".sg-dots i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.7);box-shadow:0 0 0 1px rgba(0,0,0,.25);transition:background .3s,transform .3s}",
    ".sg-dots i.on{background:#ff6f92;transform:scale(1.35)}",
    "@media (prefers-reduced-motion:reduce){.sg-card.in{animation:none;opacity:1;transform:none}.sg-scene,.sg-cap{transition:none}}"
  ].join("\n");

  var styleEl = document.createElement("style"); styleEl.textContent = css; (document.head || document.documentElement).appendChild(styleEl);

  /* ---------- the eye ---------- */
  var el = null, st = "shut", waiting = [], pending = [], booted = false;
  function snd(name) { try { var a = new Audio(AUDIO + name); a.volume = 1; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  function build() {
    el = document.createElement("div"); el.className = "sg-eye shut on" + (RM ? " rm" : "");
    el.innerHTML = '<i class="sg-lid top"></i><i class="sg-lid bot"></i>';
    document.documentElement.appendChild(el);   // straight under <html>: works even while this script is still in <head>
  }
  build();                                      // the page is covered from the very first paint

  function flush() { var q = waiting; waiting = []; q.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }
  function open(cb) {
    if (st === "open") { cb && cb(); return; }
    if (st !== "shut") { if (cb) waiting.push(cb); return; }
    st = "opening"; if (cb) waiting.push(cb);
    snd("door-slide.wav");
    void el.offsetWidth; el.classList.remove("shut");
    setTimeout(function () { st = "open"; el.classList.remove("on"); flush(); }, RM ? 60 : OPEN_MS + 40);
  }
  function close(cb) {
    if (st !== "open") { cb && cb(); return; }
    st = "closing"; el.classList.add("on", "shut");
    snd("door-close.wav");
    setTimeout(function () { st = "shut"; cb && cb(); }, RM ? 60 : SHUT_MS + 40);
  }
  function go(work) {
    if (st === "open") close(function () { work(); open(); });
    else work();                              // already under the eye (page start) or mid-move: just do it
  }
  function afterOpen(fn) { if (st === "open") fn(); else waiting.push(fn); }
  function boot(ms) {
    if (booted) return; booted = true;
    setTimeout(function () { open(); }, ms == null ? 450 : ms);
    setTimeout(function () { if (st === "shut") open(); }, 6000);   // never leave the screen white
  }

  /* ---------- things waiting under the eye ---------- */
  function pinkScrim() {
    var d = document.createElement("div"); d.className = "sg-pre"; document.body.appendChild(d); pending.push(d); return d;
  }
  var tut = null;                             // the tutorial that is on screen: {scrim, timers}
  function cancelPending() {
    waiting = []; pending.forEach(function (d) { d.remove(); }); pending = [];
    if (tut) { tut.timers.forEach(clearTimeout); tut.scrim.remove(); tut = null; }
  }

  /* ---------- hands ---------- */
  function hand(kind, x, y, extra) {
    return '<img class="' + (kind === "swipe" ? "sg-swipe" : "sg-tap") + '" src="' + IMG + (kind === "swipe" ? "hand-swipe.gif" : "hand-click.gif") +
      '" alt="" style="left:' + x + 'px;top:' + y + 'px;' + (extra || "") + '">';
  }

  /* ---------- the "how it works" card ----------
     cfg.scenes = [{html, cap, ms, run(sceneEl)}]   html = the inside of one scene (326 x 330 px)
     The pink dim appears at once (under the shut eye); the card pops in when the eye has opened. */
  function tutorial(cfg) {
    cancelPending();
    var scrim = document.createElement("div"); scrim.className = "sg-scrim";
    scrim.innerHTML = '<div class="sg-card">' +
      cfg.scenes.map(function (s, i) { return '<div class="sg-scene" id="sgs' + i + '">' + s.html + '</div>'; }).join("") +
      '<div class="sg-cap"></div></div>' +
      '<div class="sg-listo-wrap"><button class="sg-listo" type="button">Listo?</button><img class="sg-listo-tap" src="' + IMG + 'hand-click.gif" alt=""></div>' +
      '<button class="sg-skip" type="button">Skip ›</button>';
    document.body.appendChild(scrim);
    var t = { scrim: scrim, timers: [] }; tut = t;
    var card = scrim.querySelector(".sg-card"), cap = scrim.querySelector(".sg-cap"), listo = scrim.querySelector(".sg-listo-wrap");
    function T(fn, ms) { t.timers.push(setTimeout(fn, ms)); }
    function showListo() {
      t.timers.forEach(clearTimeout); t.timers = [];
      scrim.querySelectorAll(".sg-scene").forEach(function (e) { e.classList.remove("on"); });
      card.classList.add("gone"); listo.classList.add("show");
      var sk = scrim.querySelector(".sg-skip"); if (sk) sk.remove();
    }
    function done() {
      t.timers.forEach(clearTimeout); scrim.classList.add("bye");
      setTimeout(function () { scrim.remove(); }, 380);
      if (tut === t) tut = null;
      cfg.onDone && cfg.onDone();
    }
    scrim.querySelector(".sg-skip").onclick = showListo;
    scrim.querySelector(".sg-listo").onclick = done;
    afterOpen(function () {
      if (tut !== t) return;
      card.classList.add("in");
      var at = 350;
      cfg.scenes.forEach(function (sc, i) {
        T(function () {
          scrim.querySelectorAll(".sg-scene").forEach(function (e) { e.classList.remove("on"); });
          var se = scrim.querySelector("#sgs" + i); se.classList.add("on");
          cap.classList.remove("show"); void cap.offsetWidth; cap.textContent = sc.cap; cap.classList.add("show");
          sc.run && sc.run(se, T);
        }, at);
        at += sc.ms;
      });
      T(showListo, at);
    });
    return t;
  }

  window.SigamosEye = {
    isOpen: function () { return st === "open"; },
    go: go, open: open, close: close, afterOpen: afterOpen, boot: boot,
    pinkScrim: pinkScrim, cancelPending: cancelPending, tutorial: tutorial, hand: hand,
    img: IMG
  };
})();
