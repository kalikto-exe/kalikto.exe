/**
 * main.js — [ ARCHITECT // DEPLOY_CORE ] v4.6
 * Deep Slate Electric HUD | Live Guest Environment Matrix | Network Diagnostic
 *
 * Systems:
 *  A.  Supabase client (local bypass guard)
 *  B.  Canvas engine — mobile/desktop frame path, bidirectional scroll, adaptive rAF
 *  C.  Global form-focus guard — pauses canvas on any input focus → zero typing lag
 *  D.  Custom rAF smooth scroll — replaces scroll-behavior; keeps canvas in sync
 *  E.  Performance Optimizer — real FPS/frame-time monitor, adaptive throttle 1x→3x
 *  F.  Preloader — rapid asset-cache log stream, 18 lines × 120ms = 2860ms < 3s
 *  G.  Post-boot HUD verification handshake (0.5s delay, 14ms/char typewriter)
 *  H.  Mumbai (IST) clock — Asia/Kolkata timezone, 1s tick
 *  I.  Node matrix — platform, browser, battery API, screen res, session, frame idx
 *  J.  FPS mini-graph — rolling 30-point line chart on canvas element
 *  K.  Pointer indicator — coarse vs fine pointer detection badge
 *  L.  Live Guest Environment Matrix (NEW v4.6):
 *        - Dynamic OS prompt: guest@macos_kernel | windows_subsystem | linux_core
 *        - SSL/HTTPS protocol detection
 *        - Time-of-day greeting: MORNING / AFTERNOON / EVENING / MIDNIGHT_SURVEILLANCE
 *        - Input type: HARDWARE_POINTER_CONNECTED or MULTI_TOUCH_INTERFACE_ACTIVE
 *        - Real-time session uptime with centisecond precision: 00:00:04.12
 *  M.  Project directory — 4 sectors, 25 cards, JS-rendered
 *  N.  Project terminal panel — 3-block typewriter: IDENTIFICATION / OPERATIONAL_LOGIC
 *        / ENGINE_DEPS
 *  O.  Password entropy evaluator — Shannon + charset bits, real-time
 *  P.  Data Breach Simulator — domain lookup, 14.3B record animation, threat report
 *  Q.  Live Automatic Network Diagnostic (NEW v4.6):
 *        Reads navigator.connection (rtt, downlink, effectiveType, type, saveData),
 *        SSL/protocol detection, HEAD-fetch RTT fallback for non-Chromium browsers.
 *        100% automated — no user input required.
 *  R.  Instagram credential handshake — 4-line typewriter (~1s), then opens URL
 *  S.  Mobile hamburger nav
 *  T.  Session tracker + dock live metrics
 *  U.  Dock nav active-link highlight on scroll
 *  V.  Scroll-to-top
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     A. SUPABASE CLIENT
  ═══════════════════════════════════════════════════════════════ */
  var SUPABASE_URL = 'https://esxyvaqrjikagdwwhfci.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_Vwc8op_QZJhA1Ahdg6jELA_rIyOSH3q';
  var _host    = window.location.hostname;
  var _isLocal = (
    window.location.protocol === 'file:' ||
    _host === 'localhost' || _host === '127.0.0.1' || _host === ''
  );
  try { window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
  catch (e) { /* silent — not used in current spec */ }

  /* Shared session start timestamp — referenced by L, T */
  var _sessionStart = Date.now();


  /* ═══════════════════════════════════════════════════════════════
     B. CANVAS ENGINE
     Mobile < 768px → vertical folder. Desktop → horizontal folder.
     Bidirectional: scrollY maps to frame index.
     rAF-batched passive scroll listener → zero pile-up.
  ═══════════════════════════════════════════════════════════════ */
  var FRAME_COUNT  = 241;
  var FRAME_PREFIX = 'img_';
  var FRAME_EXT    = '.jpg';

  var _isMobile  = window.innerWidth < 768;
  var _framePath = _isMobile
    ? './assets/mobile-frames/vertical/'
    : './assets/desktop-frames/horizontal/';


  var _canvas       = document.getElementById('animation-canvas');
  var _ctx          = _canvas ? _canvas.getContext('2d') : null;
  var _frames       = new Array(FRAME_COUNT);
  var _currentFrame = 0;
  var _rafPending   = false;
  var _formFocused  = false;   /* C. guard flag */

  /* E. Performance optimizer state */
  var _fpsFrameCnt    = 0;
  var _fpsLast        = performance.now();
  var _currentFps     = 60;
  var _frameTime      = 16.67;
  var _canvasThrottle = 1;
  var _scrollCount    = 0;

  /* J. FPS graph */
  var _fpsGraphData = new Array(30).fill(60);
  var _fpsGraphEl   = null;
  var _fpsGraphCtx  = null;

  var _bootDone = false;

  function pad5(n) { var s = String(n); while (s.length < 5) s = '0' + s; return s; }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function resizeCanvas() {
    if (!_canvas) return;
    var dpr = window.devicePixelRatio || 1;
    _canvas.width  = window.innerWidth  * dpr;
    _canvas.height = window.innerHeight * dpr;
    _canvas.style.width  = window.innerWidth  + 'px';
    _canvas.style.height = window.innerHeight + 'px';
    if (_ctx) { _ctx.setTransform(1,0,0,1,0,0); _ctx.scale(dpr,dpr); }
  }

  function drawFrame(index) {
    if (!_ctx) return;
    var img = _frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    var cw = window.innerWidth, ch = window.innerHeight;
    var sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w  = img.naturalWidth * sc, h = img.naturalHeight * sc;
    _ctx.clearRect(0, 0, cw, ch);
    _ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function updateCanvasFrame() {
    _rafPending = false;
    if (_formFocused) return;  /* C. form-focus guard */

    _scrollCount++;
    if (_scrollCount % _canvasThrottle !== 0) return; /* E. adaptive throttle */

    var scrollY   = window.scrollY || window.pageYOffset;
    var maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    var progress  = Math.min(scrollY / maxScroll, 1);
    var idx       = Math.min(Math.floor(progress * (FRAME_COUNT - 1)), FRAME_COUNT - 1);

    if (idx !== _currentFrame) {
      _currentFrame = idx;
      drawFrame(idx);
    }

    /* Update frame index readout in node matrix */
    var nf = document.getElementById('node-frame');
    if (nf) nf.textContent = idx + ' / ' + (FRAME_COUNT - 1);
  }

  function onScroll() {
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(updateCanvasFrame);
  }

  function preloadFrames() {
    resizeCanvas();
    for (var i = 0; i < FRAME_COUNT; i++) {
      (function (idx) {
        var img = new Image();
        img.decoding = 'async';
        img.onload   = function () { if (idx === 0) drawFrame(0); };
        img.onerror  = function () {
          /* Fallback stays within the same device-appropriate folder path */
          if (!img._fb) {
            img._fb = true;
            img.src = _framePath + FRAME_PREFIX + pad5(idx + 1) + FRAME_EXT;
          }
        };
        img.src = _framePath + FRAME_PREFIX + pad5(idx + 1) + FRAME_EXT;
        _frames[idx] = img;
      }(i));
    }
    var ns = document.getElementById('node-src');
    if (ns) ns.textContent = _isMobile ? 'VERTICAL // 241 FRAMES' : 'HORIZONTAL // 241 FRAMES';
  }

  function initCanvas() {
    preloadFrames();
    window.addEventListener('scroll', onScroll, { passive: true });
    var _rsz;
    window.addEventListener('resize', function () {
      clearTimeout(_rsz);
      _rsz = setTimeout(function () { resizeCanvas(); drawFrame(_currentFrame); }, 150);
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     C. GLOBAL FORM-FOCUS GUARD
     The exact millisecond any input/textarea/select gains focus,
     canvas scroll updates pause. Resumes instantly on blur.
  ═══════════════════════════════════════════════════════════════ */
  function initFormFocusGuard() {
    document.addEventListener('focusin', function (e) {
      var t = e.target ? e.target.tagName : '';
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') _formFocused = true;
    });
    document.addEventListener('focusout', function (e) {
      var t = e.target ? e.target.tagName : '';
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') _formFocused = false;
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     D. CUSTOM rAF SMOOTH SCROLL
     Each intermediate scrollTo triggers passive 'scroll' → canvas update.
     Prevents canvas desync that would occur with CSS scroll-behavior.
  ═══════════════════════════════════════════════════════════════ */
  function smoothScrollTo(targetY, duration) {
    var startY = window.scrollY || window.pageYOffset;
    var startT = performance.now();
    var dist   = targetY - startY;
    if (Math.abs(dist) < 2) return;
    (function tick(now) {
      var t     = Math.min((now - startT) / duration, 1);
      var eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
      window.scrollTo(0, Math.round(startY + dist * eased));
      if (t < 1) requestAnimationFrame(tick);
    }(performance.now()));
  }

  function initNavLinks() {
    var mobileNavH = 54;
    document.querySelectorAll('[data-scroll]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var href = el.getAttribute('href');
        if (!href || href[0] !== '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var offset = _isMobile ? mobileNavH + 8 : 8;
        smoothScrollTo(
          Math.max(0, target.getBoundingClientRect().top + (window.scrollY||0) - offset),
          820
        );
        var mLinks = document.getElementById('mobile-nav-links');
        var mBtn   = document.getElementById('mobile-hamburger');
        if (mLinks) mLinks.classList.remove('open');
        if (mBtn)   { mBtn.classList.remove('open'); mBtn.setAttribute('aria-expanded','false'); }
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     E. PERFORMANCE OPTIMIZER
     Measures real FPS and frame-time each second.
     Adapts _canvasThrottle: 1x (≥50fps), 2x (28-50fps), 3x (<28fps).
  ═══════════════════════════════════════════════════════════════ */
  function startPerfMonitor() {
    _fpsGraphEl = document.getElementById('fps-graph');
    if (_fpsGraphEl) {
      var dpr = window.devicePixelRatio || 1;
      _fpsGraphEl.width  = (_fpsGraphEl.offsetWidth || 200) * dpr;
      _fpsGraphEl.height = 42 * dpr;
      _fpsGraphCtx = _fpsGraphEl.getContext('2d');
      if (_fpsGraphCtx) _fpsGraphCtx.scale(dpr, dpr);
    }

    var perfDevEl = document.getElementById('perf-device');
    if (perfDevEl) perfDevEl.textContent = _isMobile ? 'MOBILE // REDUCED_RENDER' : 'DESKTOP // FULL_RENDER';

    (function rafLoop(now) {
      _fpsFrameCnt++;
      var elapsed = now - _fpsLast;
      _frameTime  = elapsed;
      if (elapsed >= 1000) {
        _currentFps  = Math.round((_fpsFrameCnt * 1000) / elapsed);
        _fpsFrameCnt = 0;
        _fpsLast     = now;

        _fpsGraphData.push(_currentFps);
        if (_fpsGraphData.length > 30) _fpsGraphData.shift();

        var mode, skip, statusTxt, isCyan;
        if (_currentFps >= 50) {
          _canvasThrottle = 1; mode = 'HIGH'; skip = '1x (EVERY FRAME)';
          statusTxt = 'NOMINAL'; isCyan = true;
        } else if (_currentFps >= 28) {
          _canvasThrottle = 2; mode = 'MEDIUM'; skip = '2x (EVERY 2ND)';
          statusTxt = 'THROTTLED'; isCyan = false;
        } else {
          _canvasThrottle = 3; mode = 'ECO'; skip = '3x (EVERY 3RD)';
          statusTxt = 'LOW-POWER MODE'; isCyan = false;
        }

        var el; var setTxt = function (id, txt) { el = document.getElementById(id); if (el) el.textContent = txt; };
        setTxt('perf-fps', _currentFps + ' fps');
        setTxt('perf-ft', _frameTime.toFixed(1) + ' ms');
        el = document.getElementById('perf-mode');
        if (el) { el.textContent = mode; el.className = 'perf-val' + (isCyan ? ' cyan' : ''); }
        setTxt('perf-skip', skip);
        el = document.getElementById('perf-status');
        if (el) { el.textContent = statusTxt; el.className = 'perf-val' + (isCyan ? ' cyan' : ''); }

        var dFps = document.getElementById('dock-fps');
        if (dFps) dFps.textContent = _currentFps;

        drawFpsGraph();
      }
      requestAnimationFrame(rafLoop);
    }(performance.now()));
  }

  function drawFpsGraph() {
    if (!_fpsGraphCtx || !_fpsGraphEl) return;
    var w = _fpsGraphEl.offsetWidth || 200, h = 42;
    _fpsGraphCtx.clearRect(0, 0, w, h);
    _fpsGraphCtx.strokeStyle = 'rgba(0,212,255,0.1)';
    _fpsGraphCtx.lineWidth = 0.5;
    _fpsGraphCtx.beginPath(); _fpsGraphCtx.moveTo(0,0); _fpsGraphCtx.lineTo(w,0); _fpsGraphCtx.stroke();
    if (_fpsGraphData.length < 2) return;
    _fpsGraphCtx.strokeStyle = '#00D4FF';
    _fpsGraphCtx.lineWidth = 1.5;
    _fpsGraphCtx.shadowColor = '#00D4FF'; _fpsGraphCtx.shadowBlur = 4;
    _fpsGraphCtx.beginPath();
    for (var i = 0; i < _fpsGraphData.length; i++) {
      var x = (i / (_fpsGraphData.length - 1)) * w;
      var y = h - Math.min(_fpsGraphData[i] / 65, 1) * h;
      if (i === 0) _fpsGraphCtx.moveTo(x, y);
      else         _fpsGraphCtx.lineTo(x, y);
    }
    _fpsGraphCtx.stroke();
    _fpsGraphCtx.shadowBlur = 0;
  }


  /* ═══════════════════════════════════════════════════════════════
     F. PRELOADER — rapid asset-cache log stream
  ═══════════════════════════════════════════════════════════════ */
  /* v4.8: Kernel initialization logs — no image/jpg references */
  var BOOT_LOGS = [
    '[ INIT     ] : LOADING SYSTEM CORE...                      OK',
    '[ KERNEL   ] : MOUNTING PROCESS TABLE...                   OK',
    '[ SUBSYS   ] : INITIALIZING NETWORK STACK...               OK',
    '[ SUBSYS   ] : MOUNTING ENGINES...                         OK',
    '[ DRIVER   ] : LOADING CANVAS_RENDERER_DRIVER...           OK',
    '[ DRIVER   ] : FRAME_SEQUENCE_BUFFER (241 frames)...       OK',
    '[ THREAD   ] : SPAWNING WORKER_POOL (8 threads)...         OK',
    '[ CRYPTO   ] : LOADING ENTROPY_POOL...                     OK',
    '[ NET      ] : RESOLVING REMOTE_ENDPOINT...                OK',
    '[ SECMOD   ] : VALIDATING CERT_CHAIN...                    OK',
    '[ SECMOD   ] : TLS_1.3 HANDSHAKE COMPLETE...               OK',
    '[ FS       ] : MOUNTING VIRTUAL_FS...                      OK',
    '[ FS       ] : LOADING STYLE_ASSETS...                     OK',
    '[ WIDGET   ] : INITIALIZING WIDGET_MATRIX...               OK',
    '[ PERF     ] : FPS_MONITOR ATTACHED...                     OK',
    '[ PERF     ] : ADAPTIVE_THROTTLE ARMED...                  OK',
    '[ RUNTIME  ] : ALL SUBSYSTEMS NOMINAL...                   OK',
    '[ SYS_READY] : KALIKTO_SYSTEMS ONLINE // BOOT COMPLETE',
  ];

  function runPreloader(onComplete) {
    var logEl = document.getElementById('loader-log');
    var barEl = document.getElementById('loader-bar');
    var curEl = document.getElementById('loader-cursor');
    if (!logEl) { if (onComplete) onComplete(); return; }

    var STEP_MS_MIN = 150;
    var STEP_MS_MAX = 250;
    var idx = 0;
    var barDur = BOOT_LOGS.length * 200;
    var barStart = performance.now();

    (function animBar(now) {
      var t = Math.min((now - barStart) / barDur, 1);
      var e = 1 - Math.pow(1 - t, 2);
      if (barEl) barEl.style.width = Math.round(e * 100) + '%';
      if (t < 1) requestAnimationFrame(animBar);
    }(performance.now()));

    /* Recursive setTimeout with random 150–250ms per line — rhythmic feel */
    function printLine() {
      if (idx >= BOOT_LOGS.length) {
        if (curEl) curEl.style.display = 'none';
        setTimeout(onComplete || function () {}, 300);
        return;
      }
      var sp = document.createElement('span');
      var raw  = BOOT_LOGS[idx];
      sp.className   = 'loader__log-line' + (raw.includes('SYS_READY') ? ' loader__log-line--cyan' : '');
      sp.textContent = raw;
      logEl.appendChild(sp);
      logEl.appendChild(document.createElement('br'));
      /* Auto-scroll: rAF guarantees DOM is painted before we measure scrollHeight */
      requestAnimationFrame(function () {
        var wrap = logEl.parentElement;
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
      });
      idx++;
      setTimeout(printLine, STEP_MS_MIN + Math.floor(Math.random() * (STEP_MS_MAX - STEP_MS_MIN + 1)));
    }
    printLine();
  }

  function revealInterface() {
    if (_bootDone) return;
    _bootDone = true;
    var loader = document.getElementById('loader');
    var mainUi = document.getElementById('main-ui');
    if (loader) loader.classList.add('fade-out');
    if (mainUi) mainUi.classList.add('visible');
    setTimeout(function () { if (loader) loader.style.display = 'none'; }, 450);
    /* G. 0.5s post-boot HUD verification */
    setTimeout(runHudVerification, 550);
    /* Hero terminal login sequence starts after HUD verify settles (~1.2s) */
    setTimeout(initHeroTerminal, 1200);
  }


  /* ═══════════════════════════════════════════════════════════════
     G. POST-BOOT HUD VERIFICATION — 0.5s after reveal, 14ms/char typewriter
  ═══════════════════════════════════════════════════════════════ */
  function runHudVerification() {
    var el = document.getElementById('hero-hud-verify');
    if (!el) return;
    var MSG = '[ SYSTEM_CORE: INITIALIZED ] // [ HARDWARE_HANDSHAKE: SECURE ]';
    el.textContent = ''; el.classList.add('active');
    var idx = 0;
    (function tick() {
      if (idx >= MSG.length) {
        setTimeout(function () {
          el.style.transition = 'opacity 0.6s ease';
          el.style.opacity    = '0';
          setTimeout(function () { el.classList.remove('active'); el.style.opacity = ''; }, 700);
        }, 2000);
        return;
      }
      el.textContent += MSG[idx++];
      setTimeout(tick, 14);
    }());
  }


  /* ═══════════════════════════════════════════════════════════════
     G2. HERO TERMINAL LOGIN SEQUENCE (v4.7)
     Kalikto mainframe terminal — 5-line boot handshake typed at 14ms/char.
     Each line auto-scrolls the container to bottom the instant it's added.
     On completion, hero-actions CTA buttons fade in (opacity 0→1).
  ═══════════════════════════════════════════════════════════════ */
  var HERO_TERM_LINES = [
    { t: '[>] REGISTERED_DEV : SMIT MEHTA',                      c: 'ht-log-line--white' },
    { t: '[>] RUNTIME_ENV    : SYSTEM_LOGIC // SCRIPT_ENGINES',  c: 'ht-log-line--cyan'  },
    { t: '[>] STATUS         : OPERATIONAL // ONLINE',           c: 'ht-log-line--green' },
  ];



  function initHeroTerminal() {
    var logEl    = document.getElementById('hero-term-log');
    var cursorEl = document.getElementById('hero-term-cursor');
    if (!logEl) return;
    var li = 0;
    (function nextLine() {
      if (li >= HERO_TERM_LINES.length) {
        /* All lines typed — set done flag for readout fade-in, hide cursor, reveal buttons */
        window._heroTermDone = true;
        if (cursorEl) cursorEl.style.display = 'none';
        var actions = document.getElementById('hero-actions');
        if (actions) actions.style.opacity = '1';
        return;
      }
      var spec   = HERO_TERM_LINES[li];
      var lineEl = document.createElement('span');
      lineEl.className = 'ht-log-line ' + spec.c;
      logEl.appendChild(lineEl);
      logEl.appendChild(document.createElement('br'));
      li++;
      /* Auto-scroll: force scroll to bottom the exact millisecond line element is added */
      logEl.scrollTop = logEl.scrollHeight;
      var text = spec.t, ci = 0;
      (function tick() {
        if (ci >= text.length) {
          /* Auto-scroll on line completion */
          logEl.scrollTop = logEl.scrollHeight;
          setTimeout(nextLine, 160); /* 160ms pause between lines */
          return;
        }
        lineEl.textContent = text.substr(0, ci + 1);
        /* Auto-scroll during typing */
        logEl.scrollTop = logEl.scrollHeight;
        ci++;
        setTimeout(tick, 14);
      }());
    }());
  }


  /* ═══════════════════════════════════════════════════════════════
     G3. LIVE GUEST PROMPT + VISITOR TELEMETRY (v4.9)
     Hostname: static brand node path — kalikto@core_node:~ $
     Populates 3 visitor readout fields:
       [ PROTOCOL ]  : TLS_1.3 // HTTPS_SECURE or HTTP // UNSECURED_CHANNEL
       [ INPUT_MODE ] : HARDWARE_POINTER_CONNECTED or MULTI_TOUCH_INTERFACE_ACTIVE
       [ SYS_UPTIME ] : live counter at centisecond precision (50ms DOM update)
     Readout fades in 400ms after terminal sequence completes.
  ═══════════════════════════════════════════════════════════════ */
  function initGuestPrompt() {
    /* 1. Brand node hostname — static, consistent across all platforms */
    var hostEl = document.getElementById('gp-text');
    if (hostEl) hostEl.textContent = 'kalikto@core_node:~ $';


    /* 2. Protocol detection */
    var protoEl = document.getElementById('gpr-protocol');
    if (protoEl) {
      var isHttps = window.location.protocol === 'https:';
      protoEl.textContent = isHttps
        ? 'TLS_1.3 // HTTPS_SECURE'
        : 'HTTP // UNSECURED_CHANNEL';
      protoEl.style.color = isHttps ? 'var(--green)' : 'var(--red)';
    }

    /* 3. Input mode detection */
    var inputEl = document.getElementById('gpr-input');
    if (inputEl) {
      var isTouch = window.matchMedia('(pointer: coarse)').matches;
      inputEl.textContent = isTouch
        ? 'MULTI_TOUCH_INTERFACE_ACTIVE'
        : 'HARDWARE_POINTER_CONNECTED';
    }

    /* 4. Live SYS_UPTIME counter — centisecond precision, 50ms DOM refresh */
    var uptimeEl = document.getElementById('gpr-uptime');
    if (uptimeEl) {
      setInterval(function () {
        var e  = Date.now() - _sessionStart;
        var cs = Math.floor((e % 1000) / 10);
        var ss = Math.floor(e / 1000) % 60;
        var mm = Math.floor(e / 60000) % 60;
        var hh = Math.floor(e / 3600000);
        uptimeEl.textContent = pad2(hh) + ':' + pad2(mm) + ':' + pad2(ss) + '.' + pad2(cs);
      }, 50);
    }

    /* 5. Fade in readout 700ms after hero terminal sequence finishes.
       heroTerminalDone flag is set in initHeroTerminal on completion. */
    var readoutEl = document.getElementById('gp-readout');
    if (readoutEl) {
      /* Poll for hero terminal completion (flag set by initHeroTerminal) */
      var poll = setInterval(function () {
        if (window._heroTermDone) {
          clearInterval(poll);
          setTimeout(function () { readoutEl.classList.add('visible'); }, 400);
        }
      }, 80);
      /* Fallback: show after 4s regardless */
      setTimeout(function () { readoutEl.classList.add('visible'); }, 4000);
    }
  }


  /* ═══════════════════════════════════════════════════════════════
     H. MUMBAI (IST) CLOCK — Asia/Kolkata, 1-second tick
  ═══════════════════════════════════════════════════════════════ */
  function startMumbaiClock() {
    var nodeEl = document.getElementById('node-clock');
    var dockEl = document.getElementById('dock-clock');
    function tick() {
      var now;
      try { now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })); }
      catch (e) { now = new Date(); }
      var hh = pad2(now.getHours()), mm = pad2(now.getMinutes()), ss = pad2(now.getSeconds());
      if (nodeEl) nodeEl.textContent = hh + ':' + mm + ':' + ss + ' IST';
      if (dockEl) dockEl.textContent = hh + ':' + mm + ':' + ss;
    }
    tick(); setInterval(tick, 1000);
  }


  /* ═══════════════════════════════════════════════════════════════
     I. NODE MATRIX — OS, browser, battery, screen res
  ═══════════════════════════════════════════════════════════════ */
  function detectPlatform() {
    var ua = navigator.userAgent;
    if (/iPhone/.test(ua))           return 'iOS // IPHONE MOBILE';
    if (/iPad/.test(ua))             return 'iPadOS // TABLET';
    if (/Android.*Mobile/.test(ua)) return 'ANDROID // MOBILE HANDSET';
    if (/Android/.test(ua))         return 'ANDROID // TABLET';
    if (/Windows NT/.test(ua))      return 'WINDOWS x64 // NT ' + ((/Windows NT (\d+\.\d+)/.exec(ua)||['','?'])[1]);
    if (/Macintosh/.test(ua))       return 'MACOS // APPLE ' + (/ARM/.test(ua) ? 'SILICON' : 'INTEL x64');
    if (/CrOS/.test(ua))            return 'CHROME_OS // UNIX';
    if (/Linux/.test(ua))           return 'LINUX // UNIX BASED';
    return 'PLATFORM: UNRESOLVED';
  }

  function detectBrowser() {
    var ua = navigator.userAgent, v;
    if (/Edg\//.test(ua))                              { v = (ua.match(/Edg\/([0-9.]+)/)||[])[1]||'?';      return 'EDGE // v' + v; }
    if (/Chrome\//.test(ua) && !/Chromium/.test(ua))   { v = (ua.match(/Chrome\/([0-9.]+)/)||[])[1]||'?';  return 'CHROME // v' + v; }
    if (/Firefox\//.test(ua))                          { v = (ua.match(/Firefox\/([0-9.]+)/)||[])[1]||'?'; return 'FIREFOX // v' + v; }
    if (/Safari\//.test(ua) && !/Chrome/.test(ua))     { v = (ua.match(/Version\/([0-9.]+)/)||[])[1]||'?'; return 'SAFARI // v' + v; }
    return 'BROWSER_UNKNOWN';
  }

  function initNodeMatrix() {
    var platEl = document.getElementById('node-platform');
    var brwEl  = document.getElementById('node-browser');
    var resEl  = document.getElementById('node-res');
    if (platEl) platEl.textContent = detectPlatform();
    if (brwEl)  brwEl.textContent  = detectBrowser();
    if (resEl)  resEl.textContent  = window.screen.width + 'x' + window.screen.height + ' // ' + (window.devicePixelRatio||1) + 'x DPR';
  }

  function initBattery() {
    var nodeEl = document.getElementById('node-battery');
    var dockEl = document.getElementById('dock-battery');
    if (!navigator.getBattery) {
      if (nodeEl) nodeEl.textContent = 'API_UNAVAILABLE';
      if (dockEl) dockEl.textContent = 'N/A';
      return;
    }
    function render(bat) {
      var lvl    = Math.round(bat.level * 100);
      var mobile = _isMobile || window.matchMedia('(pointer: coarse)').matches;
      var txt    = mobile && !bat.charging
        ? 'DRAINAGE_ACTIVE // ' + lvl + '% REMAINING'
        : lvl + '% // ' + (bat.charging ? 'CHARGING' : 'DISCHARGING');
      if (nodeEl) nodeEl.textContent = txt;
      if (dockEl) dockEl.textContent = lvl + '%';
    }
    navigator.getBattery().then(function (bat) {
      render(bat);
      bat.addEventListener('chargingchange', function () { render(bat); });
      bat.addEventListener('levelchange',    function () { render(bat); });
    }).catch(function () {
      if (nodeEl) nodeEl.textContent = 'PERMISSION_DENIED';
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     K. POINTER INDICATOR BADGE
  ═══════════════════════════════════════════════════════════════ */
  function initPointerIndicator() {
    var badge  = document.getElementById('pointer-indicator');
    var nodeEl = document.getElementById('node-pointer');
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    var status = coarse
      ? '[ DYNAMIC MULTI-TOUCH INTERFACE ENGAGED ]'
      : '[ INTEGRATED TRACKPAD ACTIVE ]';
    /* Update the silent data-log layer only — no visual badge popup on touch */
    if (nodeEl) nodeEl.textContent = status;

    /* One-time desktop first-move flash only (pointer devices, not touch) */
    if (!coarse && badge) {
      function flash(text) {
        badge.textContent = text;
        badge.classList.add('visible');
        clearTimeout(badge._tid);
        badge._tid = setTimeout(function () { badge.classList.remove('visible'); }, 2600);
      }
      var _first = true;
      window.addEventListener('pointermove', function () {
        if (!_first) return; _first = false;
        flash('[ INTEGRATED TRACKPAD ACTIVE ] // CURSOR_DETECTED');
      }, { passive: true });
    }
    /* Touch devices: badge is fully suppressed — value lives in nodeEl only */
  }


  /* ═══════════════════════════════════════════════════════════════
     L. LIVE GUEST ENVIRONMENT MATRIX (NEW v4.6)
     Reads browser headers to populate 5 dynamic shell-style lines.
     Session uptime updates every 50ms (centisecond precision, 20fps DOM).
  ═══════════════════════════════════════════════════════════════ */
  function initGuestMatrix() {
    var ua = navigator.userAgent;

    /* Dynamic OS prompt */
    var osPrompt;
    if (/iPhone|iPod/.test(ua))       osPrompt = 'guest@darwin_mobile:~ $';
    else if (/iPad/.test(ua))          osPrompt = 'guest@darwin_tablet:~ $';
    else if (/Macintosh/.test(ua))     osPrompt = 'guest@macos_kernel:~ $';
    else if (/Windows/.test(ua))       osPrompt = 'guest@windows_subsystem:~ $';
    else if (/Android.*Mobile/.test(ua)) osPrompt = 'guest@android_mobile:~ $';
    else if (/Android/.test(ua))       osPrompt = 'guest@android_tablet:~ $';
    else if (/CrOS/.test(ua))          osPrompt = 'guest@chromeos_kernel:~ $';
    else if (/Linux/.test(ua))         osPrompt = 'guest@linux_core:~ $';
    else                               osPrompt = 'guest@unknown_core:~ $';

    /* Connection protocol — reads window.location.protocol */
    var isHttps   = window.location.protocol === 'https:';
    var protocol  = isHttps ? 'TLS_1.3 // HTTPS_VERIFIED' : 'HTTP // UNSECURED_CHANNEL';

    /* Time-of-day greeting — uses visitor's local browser clock */
    var h = new Date().getHours();
    var greeting;
    if      (h >= 5  && h < 12) greeting = 'GOOD_MORNING_OPERATOR';
    else if (h >= 12 && h < 17) greeting = 'GOOD_AFTERNOON_OPERATOR';
    else if (h >= 17 && h < 21) greeting = 'GOOD_EVENING_OPERATOR';
    else                        greeting = 'MIDNIGHT_SURVEILLANCE_MODE';

    /* Input type — CSS media query API */
    var inputMode = window.matchMedia('(pointer: coarse)').matches
      ? 'MULTI_TOUCH_INTERFACE_ACTIVE'
      : 'HARDWARE_POINTER_CONNECTED';

    /* Populate static fields */
    var el;
    el = document.getElementById('gm-prompt');   if (el) el.textContent = osPrompt;
    el = document.getElementById('gm-protocol'); if (el) el.textContent = protocol;
    el = document.getElementById('gm-greeting'); if (el) el.textContent = greeting;
    el = document.getElementById('gm-input');    if (el) el.textContent = inputMode;

    /* Colour the protocol field based on HTTPS status */
    el = document.getElementById('gm-protocol');
    if (el) el.style.color = isHttps ? 'var(--green)' : 'var(--red)';

    /* Real-time session uptime — centisecond precision, updates every 50ms */
    var uptimeEl = document.getElementById('gm-uptime');
    if (uptimeEl) {
      setInterval(function () {
        var e  = Date.now() - _sessionStart;
        var cs = Math.floor((e % 1000) / 10); /* centiseconds 00–99 */
        var ss = Math.floor(e / 1000) % 60;
        var mm = Math.floor(e / 60000) % 60;
        var hh = Math.floor(e / 3600000);
        uptimeEl.textContent = pad2(hh) + ':' + pad2(mm) + ':' + pad2(ss) + '.' + pad2(cs);
      }, 50);
    }
  }


  /* ═══════════════════════════════════════════════════════════════
     M. PROJECT DATA — 4 sectors, 25 projects
  ═══════════════════════════════════════════════════════════════ */
  var SECTORS = [
    {
      id: 1, ref: 'SECTOR 01', name: 'AUTOMATION & FILE-SYSTEM DAEMONS',
      projects: [
        { id: 1, ref:'ENGINE_01', name:'Automated Directory Custodian',
          brief:'MIME-type file organizer script',
          identification:'Autonomous file-system management daemon that categorises and relocates files based on MIME-type signatures and extension metadata. Produces timestamped audit logs after each sweep.',
          logic:'Scans a target directory using Python pathlib and mimetypes, classifies each file into typed subdirectories (images/, docs/, archives/, code/), moves duplicates to a quarantine bin, and appends structured operation records to a rolling audit file.',
          deps:['Python 3.10','pathlib','mimetypes','shutil','logging','os'] },
        { id: 2, ref:'ENGINE_02', name:'Bulk Asset Cryptographic Timestamper',
          brief:'Metadata-driven file renamer',
          identification:'Batch processing utility that extracts embedded metadata timestamps from file headers and renames assets using a canonical chronological naming convention to ensure archival integrity.',
          logic:'Parses EXIF and filesystem metadata using Pillow and mutagen, builds a normalised timestamp string (YYYYMMDD_HHMMSS), performs atomic rename operations via os.rename with collision-safe numbering, and emits a JSON diff log of all changes.',
          deps:['Python 3.10','Pillow','mutagen','os','json','datetime'] },
        { id: 3, ref:'ENGINE_03', name:'Automated Local Backup Scheduler',
          brief:'Cron-driven encrypted archiver',
          identification:'Scheduled backup daemon that compresses and AES-encrypts critical directories on a configurable cron schedule, verifying archive integrity with SHA-256 checksums before finalising.',
          logic:'Reads a YAML schedule config, triggers tarball creation with tarfile, pipes through cryptography.fernet for encryption, verifies the resulting archive against a pre-computed hash, and pushes confirmation alerts to a log file.',
          deps:['Python 3.10','cron','tarfile','cryptography','hashlib','PyYAML'] },
        { id: 4, ref:'ENGINE_04', name:'Log File Rotation & Parsing Engine',
          brief:'Regex-driven error filter utility',
          identification:'Log management daemon that rotates oversized log files, compresses historical archives, and extracts critical error and warning events using configurable regex pattern libraries.',
          logic:'Monitors log file sizes via inotify polling, triggers rotation at configurable thresholds, gzip-compresses rotated archives, then applies a regex catalogue to extracted lines and outputs a structured error digest.',
          deps:['Python 3.10','re','gzip','logging.handlers','watchdog','inotify'] },
        { id: 5, ref:'ENGINE_05', name:'Automated Configuration File Sync',
          brief:'Environment state mirroring daemon',
          identification:'Environment synchronisation daemon that mirrors dotfiles and application configuration states across multiple managed hosts via SSH, logging deltas after each sync pass.',
          logic:'Reads a host inventory YAML, establishes SSH connections using paramiko, diffs remote config files against a canonical local template using difflib, pushes updates for divergent configs, and records a structured diff log.',
          deps:['Python 3.10','paramiko','difflib','PyYAML','hashlib','os'] },
        { id: 6, ref:'ENGINE_06', name:'Broken Symbolic Link Repair Daemon',
          brief:'File-system shortpath validator',
          identification:'Filesystem integrity daemon that recursively walks directory trees to identify dangling symbolic links, reporting broken paths and optionally repairing them against a known-good target mapping.',
          logic:'Uses os.walk and os.readlink to traverse the target tree, evaluates each symlink with os.path.exists, logs all dangling references to a structured JSON report, and applies remapping rules from a user-supplied JSON config.',
          deps:['Python 3.10','os','json','pathlib','logging','argparse'] },
      ]
    },
    {
      id: 2, ref: 'SECTOR 02', name: 'CYBERSECURITY & INFRASTRUCTURE INTEGRITY',
      projects: [
        { id: 7, ref:'ENGINE_07', name:'Dynamic Password Strength Evaluator',
          brief:'Real-time entropy string calculator',
          identification:'Credential security analysis module that computes Shannon entropy and charset pool breadth to deliver tiered strength ratings with actionable remediation guidance in real time.',
          logic:'Calculates available charset pool (lowercase 26, uppercase 26, digits 10, symbols 32) and multiplies by password length to estimate bit-entropy, then maps to a five-tier risk scale and returns specific character-class deficiency hints.',
          deps:['Python 3.10','math','string','re','argparse'] },
        { id: 8, ref:'ENGINE_08', name:'Local Network Port Recon Scanner',
          brief:'Native TCP/IP socket network prober',
          identification:'Fast TCP port reconnaissance tool that probes a configurable IP range and port set using non-blocking socket connections, producing a structured JSON reachability report.',
          logic:'Opens non-blocking TCP sockets via Python socket library, iterates target IPs and ports with configurable concurrency through ThreadPoolExecutor, and aggregates open/closed/filtered results into a timestamped JSON report.',
          deps:['Python 3.10','socket','concurrent.futures','json','ipaddress'] },
        { id: 9, ref:'ENGINE_09', name:'Automated Hash Verification Utility',
          brief:'SHA-256 integrity checker',
          identification:'File integrity verification engine that computes SHA-256 checksums for a target directory tree and cross-references results against a stored baseline manifest to detect tampering or corruption.',
          logic:'Walks the target tree with os.walk, computes SHA-256 digests using hashlib with chunked reading for memory efficiency, diffs against a baseline JSON manifest, and outputs a delta report listing added, removed, and modified files.',
          deps:['Python 3.10','hashlib','json','os','pathlib','argparse'] },
        { id:10, ref:'ENGINE_10', name:'SSH Brute-Force Log Sentinel',
          brief:'Auth log failure parser and IP flagger',
          identification:'SSH intrusion detection utility that continuously parses /var/log/auth.log for failed login events, flags IPs exceeding a configurable threshold, and triggers iptables block rules automatically.',
          logic:'Tails the auth log using a file-handle seek loop, extracts source IPs from "Failed password" lines via regex, maintains a per-IP counter dict, and on threshold breach executes iptables -A INPUT -s <ip> -j DROP.',
          deps:['Python 3.10','re','subprocess','collections','time','argparse'] },
        { id:11, ref:'ENGINE_11', name:'System Privilege Escalation Auditing Script',
          brief:'Linux permission vulnerability auditor',
          identification:'Linux privilege escalation audit tool that scans for common misconfiguration patterns including SUID/SGID binaries, world-writable files, and sudo misconfigurations, producing a severity-ranked report.',
          logic:'Runs a series of targeted find commands for SUID binaries, world-writable directories, and setcap executables via subprocess.run, parses sudo -l output, and aggregates findings into a severity-classified Markdown report.',
          deps:['Python 3.10','subprocess','os','stat','pathlib','argparse'] },
        { id:12, ref:'ENGINE_12', name:'Directory Security Tripwire Engine',
          brief:'Cryptographic snapshot folder guard',
          identification:'Filesystem tripwire that takes a cryptographic snapshot of a monitored directory, stores a signed baseline manifest, and alerts on any subsequent file addition, removal, or modification.',
          logic:'On baseline mode, walks the target directory and writes SHA-256 digests with metadata to a HMAC-signed JSON manifest. On watch mode, recomputes at configurable intervals and diffs against baseline, emitting alerts for all discrepancies.',
          deps:['Python 3.10','hashlib','hmac','json','os','pathlib','schedule'] },
      ]
    },
    {
      id: 3, ref: 'SECTOR 03', name: 'WEB SCRAPERS & API AUTOMATION',
      projects: [
        { id:13, ref:'ENGINE_13', name:'Documentation Scraper Engine',
          brief:'HTML data collector to Markdown compiler',
          identification:'Targeted documentation scraper that recursively crawls a specified site, extracts structured content from HTML using CSS selector rules, and compiles the output into clean Markdown files.',
          logic:'Uses requests and BeautifulSoup4 to crawl page trees following internal anchor links up to a configurable depth, applies CSS selector rules to extract content nodes, and writes cleaned Markdown with proper heading hierarchy.',
          deps:['Python 3.10','requests','BeautifulSoup4','markdownify','urllib.parse'] },
        { id:14, ref:'ENGINE_14', name:'System Telemetry API Endpoint',
          brief:'Lightweight FastAPI local resource distributor',
          identification:'Lightweight REST API server that exposes real-time local system telemetry (CPU, RAM, disk, network) as structured JSON endpoints for consumption by monitoring dashboards or remote scripts.',
          logic:'Wraps psutil system calls in FastAPI route handlers, serialises metrics as Pydantic models, and serves them on localhost with configurable CORS and optional bearer token authentication.',
          deps:['Python 3.10','FastAPI','psutil','Pydantic','uvicorn','httpx'] },
        { id:15, ref:'ENGINE_15', name:'Automated Social Portal Tunnel',
          brief:'Handshake connection animator script',
          identification:'Automated browser interaction script that navigates social platform login flows using Playwright, handles 2FA prompts via a TOTP library, and captures session cookies for downstream automation tasks.',
          logic:'Launches a headless Chromium instance via Playwright, fills credential fields, handles reCAPTCHA delay logic, reads TOTP codes from a secrets file using pyotp, and exports the authenticated session state as a serialised cookie jar.',
          deps:['Python 3.10','Playwright','pyotp','json','asyncio'] },
        { id:16, ref:'ENGINE_16', name:'API Exchange Rate Tracker',
          brief:'Morning JSON dataset parsing utility',
          identification:'Scheduled exchange rate ingestion daemon that fetches daily FX rate datasets from a public API each morning, parses the JSON payload, and appends normalised records to a local time-series SQLite database.',
          logic:'Triggers via cron at 07:00 local time, calls the ExchangeRate-API v6 endpoint with requests, validates the response schema, converts rates relative to a base currency, and inserts normalised rows into an SQLite table with upsert logic.',
          deps:['Python 3.10','requests','sqlite3','json','datetime','cron'] },
        { id:17, ref:'ENGINE_17', name:'Portfolio Commit Ticker Engine',
          brief:'Live GitHub public metadata fetcher',
          identification:'GitHub activity aggregator that polls the public Events API for a target account, extracts commit metadata, and streams a live ticker of recent push events to a terminal or web surface.',
          logic:'Polls GET /users/:username/events every 60 seconds using requests with ETag caching headers, filters PushEvent payloads, extracts repository name and commit message summaries, and emits formatted ticker strings via stdout or a WebSocket broadcast.',
          deps:['Python 3.10','requests','json','datetime','websockets','asyncio'] },
        { id:18, ref:'ENGINE_18', name:'Public IP Geolocation Status Logger',
          brief:'Gateway validation and network boundary tracker',
          identification:'Periodic public IP resolution daemon that queries geolocation APIs to determine the current egress IP, country, ISP, and AS number, logging changes to a structured history file.',
          logic:'Queries ipapi.co and ip-api.com on a timed loop, compares the current egress IP against the last recorded value, and on change appends a full geolocation record (city, region, ISP, ASN, lat/lon) with a UTC timestamp to a JSONL history log.',
          deps:['Python 3.10','requests','json','datetime','schedule'] },
      ]
    },
    {
      id: 4, ref: 'SECTOR 04', name: 'DIAGNOSTICS & UTILITIES',
      projects: [
        { id:19, ref:'ENGINE_19', name:'Peripheral Interface Detection Module',
          brief:'Pointer vs. multi-touch screen analyzer',
          identification:'Browser-based peripheral detection utility that distinguishes between fine-pointer devices (mouse, trackpad) and coarse-pointer touch interfaces using CSS media query APIs, and adapts UI interaction modes accordingly.',
          logic:'Queries window.matchMedia("(pointer: coarse)") and (hover: none) on load and orientation change, emits classification events, and applies dataset attribute flags to the root element for CSS-driven UI adaptation.',
          deps:['JavaScript (ES6)','CSS Media Queries','PointerEvent API'] },
        { id:20, ref:'ENGINE_20', name:'Mobile Battery Drainage Diagnostics',
          brief:'Power level responsive framework logic',
          identification:'Mobile-focused battery monitoring module that uses the navigator.getBattery API to track charge level, charging state, and discharge rate, adapting UI render weight in response to power levels.',
          logic:'Resolves navigator.getBattery(), attaches chargingchange and levelchange event listeners, maps battery level to three performance tiers (NORMAL > 40%, REDUCED 15-40%, ECO < 15%), and emits tier-change events that reduce animation frequency.',
          deps:['JavaScript (ES6)','Battery Status API','PointerEvent API'] },
        { id:21, ref:'ENGINE_21', name:'Automated System Theme Sync',
          brief:'Diurnal clock-driven visual layout swapper',
          identification:'Clock-driven theme synchronisation module that automatically switches between a dark operational mode (18:00–06:00 IST) and a lighter analysis mode (06:00–18:00 IST), overrideable by user preference.',
          logic:'Reads the current Mumbai time on page load and on an hourly check interval, compares hour against thresholds, and toggles a data-theme attribute on the document root. Respects a stored localStorage override flag.',
          deps:['JavaScript (ES6)','Date API','localStorage','CSS Custom Properties'] },
        { id:22, ref:'ENGINE_22', name:'Storage Allocation Space Guard',
          brief:'Disk limit capacity monitoring module',
          identification:'Disk capacity monitoring daemon that tracks used and available space across mounted volumes, emits warnings on threshold breach, and logs capacity snapshots to a time-series SQLite database.',
          logic:'Uses psutil.disk_usage to poll each mounted partition from a config list, compares used-percent against warning (80%) and critical (90%) thresholds, pushes alerts to stdout and a log file, and inserts snapshots into SQLite every 15 minutes.',
          deps:['Python 3.10','psutil','sqlite3','schedule','logging'] },
        { id:23, ref:'ENGINE_23', name:'Process Monitor & Overload Guardian',
          brief:'Runaway background processing killer script',
          identification:'Process watchdog that continuously monitors system CPU and memory consumption per process, automatically terminating or throttling processes that exceed configurable resource thresholds.',
          logic:'Iterates psutil.process_iter with cpu_percent and memory_percent attributes, identifies processes exceeding configured thresholds over a sliding window of 5 consecutive samples, sends SIGTERM then SIGKILL after a grace period, and writes a kill log.',
          deps:['Python 3.10','psutil','signal','os','collections.deque','logging'] },
        { id:24, ref:'ENGINE_24', name:'Network Ping Latency Grapher',
          brief:'Server link connection stability tracker',
          identification:'Network latency visualisation tool that continuously pings a set of target hosts, records round-trip times, and renders a rolling line graph to visualise link stability over a configurable time window.',
          logic:'Uses subprocess.run with ping -c 1 for each target host on a timed loop, parses the RTT from stdout via regex, maintains a deque of the last N samples, and renders either an ASCII sparkline in the terminal or a Matplotlib rolling plot.',
          deps:['Python 3.10','subprocess','re','collections.deque','matplotlib'] },
        { id:25, ref:'ENGINE_25', name:'Command Shortcut Workspace Launcher',
          brief:'Keyboard macro-driven infrastructure execution',
          identification:'Keyboard macro engine that maps configurable shortcut sequences to workspace launch commands (opening project terminals, SSH sessions, browser tabs, and editor windows) to eliminate repetitive startup procedures.',
          logic:'Uses pynput.keyboard to listen for hotkey combinations defined in a YAML config, matches detected key sequences against the combo catalogue, and dispatches the corresponding subprocess command or webbrowser.open call.',
          deps:['Python 3.10','pynput','subprocess','webbrowser','PyYAML'] },
      ]
    },
  ];


  /* M (continued). PROJECT DIRECTORY RENDERER */
  function renderProjects() {
    var container = document.getElementById('project-directory');
    if (!container) return;
    SECTORS.forEach(function (sector) {
      var block  = document.createElement('div');
      block.className = 'sector-block';
      var header = document.createElement('div');
      header.className = 'sector-header';
      header.innerHTML =
        '<span class="sector-ref">' + sector.ref + '</span>' +
        '<span class="sector-name">' + sector.name + '</span>';
      block.appendChild(header);
      var grid = document.createElement('div');
      grid.className = 'project-grid';
      sector.projects.forEach(function (proj) {
        var card = document.createElement('div');
        card.className = 'proj-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'View project: ' + proj.name);
        card.innerHTML =
          '<span class="proj-ref">' + proj.ref + '</span>' +
          '<span class="proj-name">' + proj.name + '</span>' +
          '<span class="proj-brief">' + proj.brief + '</span>' +
          '<span class="proj-action">[ ACCESS TERMINAL BRIEF ]</span>';
        card.addEventListener('click', function () { openProjectPanel(proj); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectPanel(proj); }
        });
        grid.appendChild(card);
      });
      block.appendChild(grid);
      container.appendChild(block);
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     N. PROJECT TERMINAL PANEL
     3-block typewriter: [ IDENTIFICATION ] / [ OPERATIONAL_LOGIC ] / [ ENGINE_DEPS ]
  ═══════════════════════════════════════════════════════════════ */
  function buildPanelLog(proj) {
    var hash = Math.random().toString(16).substr(2,8).toUpperCase();
    var sector = String(Math.ceil(proj.id / 6)).padStart(2,'0');
    var lines = [
      { t:'[ SYSTEM_LOG ] ACCESSING ' + proj.ref + '...', c:'plog-line--cyan' },
      { t:'', c:'plog-line--dim' },
      { t:'[ IDENTIFICATION ]', c:'plog-line--cyan' },
      { t:'NAME   : ' + proj.name.toUpperCase(), c:'plog-line--white' },
      { t:'REF    : ' + proj.ref + ' // SECTOR ' + sector, c:'plog-line--white' },
      { t:'HASH   : ' + hash, c:'plog-line--dim' },
      { t:'STATUS : OPERATIONAL // BUILD STABLE', c:'plog-line--white' },
      { t:'', c:'plog-line--dim' },
      { t:'[ OPERATIONAL_LOGIC ]', c:'plog-line--cyan' },
      { t:proj.identification, c:'plog-line--white', wrap:true },
      { t:'', c:'plog-line--dim' },
      { t:proj.logic, c:'plog-line--dim', wrap:true },
      { t:'', c:'plog-line--dim' },
      { t:'[ ENGINE_DEPS ]', c:'plog-line--cyan' },
    ].concat(proj.deps.map(function (d) {
      return { t:'\u25b6 ' + d, c:'plog-line--white' };
    })).concat([
      { t:'', c:'plog-line--dim' },
      { t:'[ ACCESS GRANTED ] // TERMINAL_BRIEF COMPLETE', c:'plog-line--cyan' },
    ]);
    return lines;
  }

  function typeLogLines(container, lines, idx, cb) {
    if (idx >= lines.length) { if (cb) cb(); return; }
    var spec = lines[idx];
    var el   = document.createElement('span');
    el.className = 'plog-line ' + (spec.c || 'plog-line--white');
    container.appendChild(el);
    container.appendChild(document.createElement('br'));
    var text = spec.t; var ci = 0;
    (function tick() {
      if (ci >= text.length) {
        setTimeout(function () { typeLogLines(container, lines, idx + 1, cb); }, spec.wrap ? 55 : 38);
        return;
      }
      el.textContent = text.substr(0, ci + 1);
      ci++;
      setTimeout(tick, spec.wrap ? 4 : 9);
    }());
  }

  function openProjectPanel(proj) {
    var panel    = document.getElementById('project-panel');
    var logEl    = document.getElementById('panel-log');
    var detailEl = document.getElementById('panel-detail');
    if (!panel || !logEl || !detailEl) return;
    document.getElementById('panel-ref').textContent   = proj.ref + ' // TERMINAL BRIEF';
    document.getElementById('panel-title').textContent = proj.name;
    document.getElementById('panel-desc').textContent  = proj.identification;
    var tagWrap = document.getElementById('panel-tags');
    tagWrap.innerHTML = '';
    (proj.deps || []).forEach(function (dep) {
      var sp = document.createElement('span');
      sp.className = 'panel-tag'; sp.textContent = dep;
      tagWrap.appendChild(sp);
    });
    logEl.innerHTML = '';
    detailEl.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    /* Push a history entry so the hardware back button can intercept cleanly */
    history.pushState({ projectOpen: true }, '');
    typeLogLines(logEl, buildPanelLog(proj), 0, function () {
      setTimeout(function () { detailEl.classList.add('visible'); }, 140);
    });
  }

  function closeProjectPanel() {
    var panel = document.getElementById('project-panel');
    if (!panel) return;
    /* Pure frontend view-state toggle — panel slides out, body scroll restored */
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    /* Reset panel scroll so next open always starts at the top */
    panel.scrollTop = 0;
  }

  function initProjectPanel() {
    var back = document.getElementById('panel-back');
    /* UI button: close panel AND pop the history state we pushed on open,
       so the browser’s forward/back stack stays in sync */
    if (back) back.addEventListener('click', function () {
      closeProjectPanel();
      /* Only go back if we actually pushed a projectOpen state */
      if (history.state && history.state.projectOpen) history.back();
    });

    /* Keyboard: Escape closes without touching history (power-user shortcut) */
    document.addEventListener('keydown', function (e) {
      var p = document.getElementById('project-panel');
      if (e.key === 'Escape' && p && p.classList.contains('open')) {
        closeProjectPanel();
        if (history.state && history.state.projectOpen) history.back();
      }
    });

    /* Hardware / browser back button: popstate fires when the pushed state
       is popped. If the panel is still open, intercept and close it cleanly
       instead of navigating away from the site. */
    window.addEventListener('popstate', function (e) {
      var p = document.getElementById('project-panel');
      if (p && p.classList.contains('open')) {
        /* Back pressed while panel is visible — close it, stay on site */
        closeProjectPanel();
        /* Prevent any further default back navigation */
        e.stopImmediatePropagation();
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     O. PASSWORD ENTROPY EVALUATOR
  ═══════════════════════════════════════════════════════════════ */
  function charsetBits(str) {
    var s = 0;
    if (/[a-z]/.test(str))          s += 26;
    if (/[A-Z]/.test(str))          s += 26;
    if (/[0-9]/.test(str))          s += 10;
    if (/[^a-zA-Z0-9]/.test(str))  s += 32;
    return Math.log2(s || 1);
  }

  function ratePassword(pass) {
    if (!pass.length) return { label:'AWAITING INPUT \u2014 SCANNER STANDING BY', pct:0, col:'rgba(232,236,244,0.3)', hints:[] };
    var bits  = pass.length * charsetBits(pass);
    var score = Math.min(100, Math.round((bits / 128) * 100));
    var label, col;
    if      (score < 18) { label = 'CRITICAL WEAKNESS \u2014 ENTROPY: ' + score + '%'; col = '#ff3b30'; }
    else if (score < 36) { label = 'LOW ENTROPY \u2014 ' + score + '% \u2014 HIGH RISK'; col = '#ff9f0a'; }
    else if (score < 55) { label = 'MODERATE STRENGTH \u2014 ' + score + '%'; col = '#ffd60a'; }
    else if (score < 78) { label = 'STRONG CREDENTIAL \u2014 ' + score + '% \u2014 SECURE'; col = '#30d158'; }
    else                 { label = 'MAXIMUM ENTROPY \u2014 ' + score + '% \u2014 HARDENED'; col = '#00ff88'; }
    var hints = [];
    if (pass.length < 12)            hints.push('// INCREASE LENGTH TO 12+ CHARS');
    if (!/[A-Z]/.test(pass))         hints.push('// ADD UPPERCASE CHARACTERS');
    if (!/[0-9]/.test(pass))         hints.push('// INJECT NUMERIC TOKENS');
    if (!/[^a-zA-Z0-9]/.test(pass)) hints.push('// INCLUDE SPECIAL SYMBOLS');
    return { label:label, pct:score, col:col, hints:hints };
  }

  function initPasswordEvaluator() {
    var input  = document.getElementById('pass-input');
    var output = document.getElementById('pass-output');
    var bar    = document.getElementById('pass-bar');
    var hints  = document.getElementById('pass-hints');
    var toggle = document.getElementById('pass-toggle');
    if (!input) return;
    input.addEventListener('input', function () {
      var r = ratePassword(input.value);
      if (output) { output.textContent = r.label; output.style.color = r.col; }
      if (bar)    { bar.style.width = r.pct + '%'; bar.style.background = r.col; }
      if (hints)  hints.textContent = r.hints.join('  ');
    });
    if (toggle) toggle.addEventListener('click', function () {
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     P. DATA BREACH SIMULATOR
  ═══════════════════════════════════════════════════════════════ */
  var BREACH_MAP = {
    'gmail.com':      { tier:'CONSUMER STANDARD',  risk:4, label:'HIGH',     breaches:['LinkedIn (Sep 2021) — 700M records','RockYou2021 Compilation — 8.4B entries','Adobe Inc. (Oct 2013) — 153M records','Canva (May 2019) — 137M records'] },
    'yahoo.com':      { tier:'LEGACY CONSUMER',    risk:5, label:'CRITICAL',  breaches:['Yahoo! (Aug 2013) — 3.0B records','Yahoo! (Sep 2016) — 500M records','LinkedIn (Sep 2021) — 700M records','Dropbox (Jul 2012) — 68M records'] },
    'hotmail.com':    { tier:'LEGACY CONSUMER',    risk:4, label:'HIGH',     breaches:['LinkedIn (Sep 2021) — 700M records','Microsoft Corp (Mar 2021) — 30K records','Adobe Inc. (Oct 2013) — 153M records','Dropbox (Jul 2012) — 68M records'] },
    'outlook.com':    { tier:'CONSUMER STANDARD',  risk:3, label:'MODERATE', breaches:['LinkedIn (Sep 2021) — 700M records','Microsoft Corp (Mar 2021) — 30K records','Canva (May 2019) — 137M records'] },
    'live.com':       { tier:'CONSUMER STANDARD',  risk:3, label:'MODERATE', breaches:['LinkedIn (Sep 2021) — 700M records','Adobe Inc. (Oct 2013) — 153M records'] },
    'icloud.com':     { tier:'PREMIUM CONSUMER',   risk:2, label:'LOW-MOD',  breaches:['Apple iCloud (Sep 2014) — Celebrity exposure event','LinkedIn (Sep 2021) — 700M records'] },
    'protonmail.com': { tier:'ENCRYPTED CONSUMER', risk:1, label:'LOW',      breaches:['No verified major breaches on public record.'] },
    'proton.me':      { tier:'ENCRYPTED CONSUMER', risk:1, label:'LOW',      breaches:['No verified major breaches on public record.'] },
    'tutanota.com':   { tier:'ENCRYPTED CONSUMER', risk:1, label:'LOW',      breaches:['No verified major breaches on public record.'] },
  };

  var RISK_BARS = ['□□□□□','■□□□□','■■□□□','■■■□□','■■■■□','■■■■■'];
  var RISK_COLS = ['','#00ff88','#ffd60a','#ff9f0a','#ff9f0a','#ff3b30'];

  function appendBreachLine(parent, text, cls, col) {
    var sp = document.createElement('span');
    sp.className = 'breach-status-line ' + cls;
    sp.textContent = text;
    if (col) sp.style.color = col;
    parent.appendChild(sp);
    parent.appendChild(document.createElement('br'));
  }

  function runBreachScan(email) {
    var output = document.getElementById('breach-output');
    if (!output) return;
    var domain = (email.split('@')[1] || '').toLowerCase().trim();
    if (!domain) {
      output.innerHTML = '';
      appendBreachLine(output, '// INVALID EMAIL FORMAT — SCAN ABORTED', 'breach-line--red');
      return;
    }
    output.innerHTML = '';
    var scanLines = [
      { t:'[ QUERYING HAVEIBEENPWNED INDEX... ]', c:'breach-line--cyan' },
      { t:'[ SEARCHING 14.3 BILLION RECORDS... ]', c:'breach-line--normal' },
      { t:'[ CROSS-REFERENCING DOMAIN: ' + domain + '... ]', c:'breach-line--normal' },
      { t:'[ ANALYSIS COMPLETE ]', c:'breach-line--cyan' },
    ];
    var si = 0;
    var timer = setInterval(function () {
      if (si >= scanLines.length) {
        clearInterval(timer);
        setTimeout(function () { renderBreachReport(output, email, domain); }, 200);
        return;
      }
      appendBreachLine(output, scanLines[si].t, scanLines[si].c);
      si++;
    }, 220);
  }

  function renderBreachReport(output, email, domain) {
    var data     = BREACH_MAP[domain];
    var rsk      = data ? data.risk : 3;
    var lbl      = data ? data.label : 'MODERATE';
    var tier     = data ? data.tier : 'CORPORATE / UNKNOWN';
    var breaches = data ? data.breaches : ['No specific records found — corporate domains may have unlisted exposure.'];

    output.innerHTML = '';
    appendBreachLine(output, '[ BREACH ANALYSIS REPORT ]', 'breach-line--cyan');
    appendBreachLine(output, 'TARGET  : ' + email, 'breach-line--normal');
    appendBreachLine(output, 'TIER    : ' + tier, 'breach-line--dim');
    appendBreachLine(output, '', 'breach-line--dim');
    appendBreachLine(output, '[ THREAT ASSESSMENT ]', 'breach-line--cyan');
    appendBreachLine(output, 'RISK    : ' + RISK_BARS[rsk] + ' ' + lbl, 'breach-line--normal', RISK_COLS[rsk]);
    appendBreachLine(output, 'RECORDS : 14.3B DATABASE SCAN COMPLETE', 'breach-line--dim');
    appendBreachLine(output, '', 'breach-line--dim');
    appendBreachLine(output, '[ KNOWN BREACH VECTORS ]', 'breach-line--cyan');
    breaches.forEach(function (b) { appendBreachLine(output, '\u25b6 ' + b, 'breach-line--normal'); });
    appendBreachLine(output, '', 'breach-line--dim');
    appendBreachLine(output,
      rsk >= 4
        ? '[ REC ] ROTATE CREDENTIALS IMMEDIATELY \u2014 ENABLE 2FA'
        : '[ REC ] ENABLE 2FA \u2014 USE UNIQUE PASSWORDS PER SERVICE',
      rsk >= 4 ? 'breach-line--red' : 'breach-line--green'
    );
  }

  function initBreachSimulator() {
    var input = document.getElementById('breach-input');
    var btn   = document.getElementById('breach-scan-btn');
    if (!input || !btn) return;
    btn.addEventListener('click', function () {
      var email = input.value.trim(); if (!email) return; runBreachScan(email);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runBreachScan(input.value.trim());
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     Q. LIVE AUTOMATIC NETWORK DIAGNOSTIC (NEW v4.6)
     100% automated — no user input required.
     Reads navigator.connection (Network Information API) for:
       rtt (ping latency), downlink (Mbps), effectiveType, type, saveData.
     SSL/HTTPS detection via window.location.protocol.
     Falls back to HEAD-fetch RTT measurement for Firefox/Safari.
     Updates automatically if connection changes (conn 'change' event).
  ═══════════════════════════════════════════════════════════════ */
  function renderNetDiag(output, data) {
    output.innerHTML = '';
    appendBreachLine(output, '[ NETWORK_PROBE ] \u2014 AUTO_SCAN_COMPLETE', 'breach-line--cyan');
    appendBreachLine(output, '', 'breach-line--dim');
    data.forEach(function (r) {
      appendBreachLine(output, r.k + ' : ' + r.v, r.c, r.col || null);
    });
  }

  function buildNetDiagData(rttOverride) {
    var conn     = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var isHttps  = window.location.protocol === 'https:';
    var origin   = window.location.hostname || 'file://local';

    var rows = [];
    rows.push({ k:'[ SSL_PROTOCOL    ]', v: isHttps ? 'TLS_1.3 // HTTPS_VERIFIED' : 'HTTP // UNSECURED_CHANNEL', c: isHttps ? 'breach-line--green' : 'breach-line--red' });
    rows.push({ k:'[ HOST_ORIGIN     ]', v: origin, c:'breach-line--normal' });

    if (conn) {
      var rtt  = conn.rtt !== undefined ? conn.rtt : 0;
      var dl   = conn.downlink !== undefined ? Number(conn.downlink).toFixed(2) : '0.00';
      var eff  = (conn.effectiveType || 'UNKNOWN').toUpperCase();
      var type = (conn.type || 'UNKNOWN').toUpperCase().replace('NONE','OFFLINE');
      var save = conn.saveData ? 'ENABLED // LITE_LOAD' : 'DISABLED // FULL_LOAD';
      var latLbl = rtt === 0 ? 'CACHED' : rtt < 50 ? 'EXCELLENT' : rtt < 100 ? 'OPTIMAL' : rtt < 200 ? 'MODERATE' : 'HIGH_LATENCY';
      var dlLbl  = parseFloat(dl) >= 10 ? 'BROADBAND_TIER' : parseFloat(dl) >= 2 ? 'STANDARD_TIER' : 'LIMITED';
      rows.push({ k:'[ PING_RTT        ]', v: rtt + 'ms // ' + latLbl, c:'breach-line--normal' });
      rows.push({ k:'[ DOWNLINK_SPEED  ]', v: dl + ' Mbps // ' + dlLbl, c:'breach-line--normal' });
      rows.push({ k:'[ EFFECTIVE_TYPE  ]', v: eff, c:'breach-line--normal' });
      rows.push({ k:'[ LINK_MEDIUM     ]', v: type, c:'breach-line--normal' });
      rows.push({ k:'[ SAVE_DATA_FLAG  ]', v: save, c:'breach-line--dim' });
    } else if (rttOverride !== undefined) {
      var latLbl2 = rttOverride < 100 ? 'OPTIMAL' : rttOverride < 300 ? 'MODERATE' : 'HIGH_LATENCY';
      rows.push({ k:'[ MEASURED_RTT    ]', v: rttOverride + 'ms // ' + latLbl2 + ' (HEAD_FETCH)', c:'breach-line--normal' });
      rows.push({ k:'[ BANDWIDTH_API   ]', v: 'NOT_AVAILABLE // BROWSER_POLICY', c:'breach-line--dim' });
      rows.push({ k:'[ NOTE            ]', v: 'FULL METRICS REQUIRE CHROME / EDGE / ANDROID', c:'breach-line--dim' });
    } else {
      rows.push({ k:'[ BANDWIDTH_API   ]', v: 'NOT_AVAILABLE // BROWSER_POLICY', c:'breach-line--dim' });
      rows.push({ k:'[ RTT_LATENCY     ]', v: 'NOT_AVAILABLE // MEASURING...', c:'breach-line--dim' });
      rows.push({ k:'[ NOTE            ]', v: 'FULL METRICS REQUIRE CHROME / EDGE / ANDROID', c:'breach-line--dim' });
    }
    return rows;
  }

  function initNetworkDiagnostic() {
    var output = document.getElementById('netdiag-output');
    if (!output) return;

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    function runScan(rttOverride) {
      renderNetDiag(output, buildNetDiagData(rttOverride));
    }

    if (conn) {
      /* Network Information API available — render immediately, re-render on change */
      setTimeout(function () { runScan(undefined); }, 600);
      conn.addEventListener('change', function () { runScan(undefined); });
    } else if (!_isLocal) {
      /* Fallback: HEAD-fetch to measure RTT */
      var t0 = performance.now();
      fetch(window.location.origin + '/?diag=' + Date.now(), {
        method: 'HEAD', cache: 'no-store'
      })
      .then(function () {
        runScan(Math.round(performance.now() - t0));
      })
      .catch(function () {
        setTimeout(function () { runScan(undefined); }, 600);
      });
    } else {
      /* Local filesystem — just show SSL/origin */
      setTimeout(function () { runScan(undefined); }, 600);
    }
  }


  /* ═══════════════════════════════════════════════════════════════
     R. INSTAGRAM CREDENTIAL HANDSHAKE — 4-line typewriter (~1s)
  ═══════════════════════════════════════════════════════════════ */
  var INSTA_URL   = 'https://instagram.com/smit_mehtaa';
  var INSTA_LINES = [
    { t:'[>] TARGET NODE: @smit_mehtaa',                                                                     c:'insta-line--normal' },
    { t:'[>] INITIALIZING CREDENTIAL HANDSHAKE...',                                                          c:'insta-line--normal' },
    { t:'[>] COMPILING TEMPORARY GUEST ACCESS KEY...',                                                       c:'insta-line--cyan' },
    { t:'[\u2714] REQUEST LOGGED. SUBMIT YOUR ACCESS CLEARANCE BY CLICKING \'FOLLOW\' ON THE TERMINAL OUTLET.', c:'insta-line--green' },
  ];

  function runInstaHandshake() {
    var terminal = document.getElementById('insta-terminal');
    var logEl    = document.getElementById('insta-log');
    if (!terminal || !logEl) return;
    logEl.innerHTML = '';
    terminal.setAttribute('aria-hidden', 'false');
    terminal.classList.add('open');
    var li = 0;
    (function nextLine() {
      if (li >= INSTA_LINES.length) {
        setTimeout(function () { window.open(INSTA_URL, '_blank', 'noopener,noreferrer'); }, 180);
        return;
      }
      var spec   = INSTA_LINES[li];
      var lineEl = document.createElement('span');
      lineEl.className = 'insta-line ' + spec.c;
      logEl.appendChild(lineEl);
      logEl.appendChild(document.createElement('br'));
      li++;
      var text = spec.t, ci = 0;
      (function tick() {
        if (ci >= text.length) { setTimeout(nextLine, 22); return; }
        lineEl.textContent = text.substr(0, ci + 1);
        ci++;
        setTimeout(tick, 5);
      }());
    }());
  }

  function closeInstaTerminal() {
    var t = document.getElementById('insta-terminal');
    if (!t) return;
    t.classList.remove('open');
    t.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      var l = document.getElementById('insta-log');
      if (l) l.innerHTML = '';
    }, 350);
  }

  function initInstagramTunnel() {
    var card  = document.getElementById('insta-card');
    var close = document.getElementById('insta-close');
    if (card) {
      card.addEventListener('click', runInstaHandshake);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); runInstaHandshake(); }
      });
    }
    if (close) close.addEventListener('click', closeInstaTerminal);
    document.addEventListener('keydown', function (e) {
      var t = document.getElementById('insta-terminal');
      if (e.key === 'Escape' && t && t.classList.contains('open')) closeInstaTerminal();
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     S. MOBILE HAMBURGER NAV
  ═══════════════════════════════════════════════════════════════ */
  function initMobileNav() {
    var btn   = document.getElementById('mobile-hamburger');
    var links = document.getElementById('mobile-nav-links');
    if (!btn || !links) return;
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     T. SESSION TRACKER + DOCK LIVE METRICS
  ═══════════════════════════════════════════════════════════════ */
  function initSessionTracker() {
    var sessEl = document.getElementById('session-time');
    var nodeEl = document.getElementById('node-session');
    var dockEl = document.getElementById('dock-uptime');
    var start  = _sessionStart;
    function tick() {
      var e  = Date.now() - start;
      var ss = Math.floor(e / 1000) % 60;
      var mm = Math.floor(e / 60000) % 60;
      var hh = Math.floor(e / 3600000);
      var str = pad2(hh) + ':' + pad2(mm) + ':' + pad2(ss);
      if (sessEl) sessEl.textContent = str;
      if (nodeEl) nodeEl.textContent = str;
      if (dockEl) dockEl.textContent = str;
    }
    tick(); setInterval(tick, 1000);
  }


  /* ═══════════════════════════════════════════════════════════════
     U. DOCK NAV ACTIVE-LINK HIGHLIGHT ON SCROLL
  ═══════════════════════════════════════════════════════════════ */
  function initDockHighlight() {
    var sections = ['identity','telemetry','projects','toolkit','comms'];
    var links    = {};
    sections.forEach(function (id) {
      var el = document.querySelector('.dock-link[href="#' + id + '"]');
      if (el) links[id] = el;
    });

    function setActive(id) {
      sections.forEach(function (sid) {
        if (links[sid]) links[sid].classList.toggle('active', sid === id);
      });
    }

    function update() {
      /* Bottom-of-page check: within 10px of document bottom → force COMMS active.
         Tolerance set to 10px to survive fractional pixel rounding on all devices. */
      var atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 10;
      if (atBottom) { setActive('comms'); return; }

      /* Standard scrollspy: last section whose top is <= 80px from viewport top */
      var current = sections[0];
      sections.forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec && sec.getBoundingClientRect().top <= 80) current = id;
      });
      setActive(current);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }


  /* ═══════════════════════════════════════════════════════════════
     V. SCROLL-TO-TOP
  ═══════════════════════════════════════════════════════════════ */
  function initScrollTop() {
    var btn = document.getElementById('scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', function () { smoothScrollTo(0, 650); });
  }


  /* ═══════════════════════════════════════════════════════════════
     BOOT ENTRY — ordered startup
  ═══════════════════════════════════════════════════════════════ */
  /* ═══════════════════════════════════════════════════════════════
     W. MOBILE COVERFLOW CAROUSEL
     Active ONLY when window.innerWidth <= 768px.
     Each .project-grid becomes a horizontal snap track.
     IntersectionObserver per grid + scroll-end debounce track which
     .proj-card is in the horizontal center and apply:
       cf-active  → scale(1) translateZ(0) rotateY(0)  opacity 1
       cf-left    → scale(0.82) rotateY(-12deg)         opacity 0.45
       cf-right   → scale(0.82) rotateY( 12deg)         opacity 0.45
  ═══════════════════════════════════════════════════════════════ */
  function initCoverFlow() {
    if (window.innerWidth > 768) return;   /* desktop guard */

    var grids = document.querySelectorAll('.project-grid');
    if (!grids.length) return;

    /* Classify every card in a grid relative to the active (center) card.
       index -1 means no card intersects; use first card as fallback. */
    function applyClasses(grid, activeIdx) {
      var cards = grid.querySelectorAll('.proj-card');
      cards.forEach(function (card, i) {
        card.classList.remove('cf-active', 'cf-left', 'cf-right');
        if (i === activeIdx)      card.classList.add('cf-active');
        else if (i < activeIdx)   card.classList.add('cf-left');
        else                      card.classList.add('cf-right');
      });
    }

    /* Find which card's center is closest to the grid's scroll center */
    function findCenter(grid) {
      var cards   = grid.querySelectorAll('.proj-card');
      var gridRect = grid.getBoundingClientRect();
      var midX    = gridRect.left + gridRect.width / 2;
      var best    = -1;
      var bestDist = Infinity;
      cards.forEach(function (card, i) {
        var r    = card.getBoundingClientRect();
        var cardMid = r.left + r.width / 2;
        var dist = Math.abs(cardMid - midX);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }

    /* Attach scroll listener + IntersectionObserver to each grid */
    grids.forEach(function (grid) {
      var cards = grid.querySelectorAll('.proj-card');
      if (!cards.length) return;

      /* Initialise: first card active */
      applyClasses(grid, 0);

      /* IntersectionObserver with root = the grid scroll container */
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function () {
          /* Any intersection change → re-evaluate which card is centered */
          applyClasses(grid, findCenter(grid));
        }, {
          root: grid,
          threshold: 0.5   /* card must be ≥ 50% visible in container */
        });
        cards.forEach(function (card) { io.observe(card); });
      }

      /* Scroll-end debounce: catches the snap resting position precisely */
      var _scrollEnd;
      grid.addEventListener('scroll', function () {
        clearTimeout(_scrollEnd);
        _scrollEnd = setTimeout(function () {
          applyClasses(grid, findCenter(grid));
        }, 80);
      }, { passive: true });
    });

    /* Re-guard on resize: if user rotates to landscape, remove mobile classes */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        document.querySelectorAll('.proj-card').forEach(function (c) {
          c.classList.remove('cf-active', 'cf-left', 'cf-right');
        });
      }
    }, { passive: true });
  }


  initCanvas();  /* B. start frame preloading immediately before DOM ready */

  document.addEventListener('DOMContentLoaded', function () {

    initFormFocusGuard();     /* C. */
    initNavLinks();            /* D. */
    renderProjects();          /* M. */
    initCoverFlow();           /* W. mobile 3D coverflow — runs after cards exist in DOM */
    initProjectPanel();        /* N. */
    initPasswordEvaluator();   /* O. */
    initBreachSimulator();     /* P. */
    initNetworkDiagnostic();   /* Q. */
    initInstagramTunnel();     /* R. */
    initMobileNav();           /* S. */
    initSessionTracker();      /* T. */
    initDockHighlight();       /* U. */
    initScrollTop();           /* V. */

    startMumbaiClock();        /* H. */
    initNodeMatrix();          /* I. */
    initBattery();             /* I. battery */
    initPointerIndicator();    /* K. */
    initGuestPrompt();         /* G3. live guest OS prompt — sets guest@[os]:~ $ hostname */
    /* L. initGuestMatrix removed in v4.7 — hero terminal replaced guest matrix */

    /* F. Boot preloader → G. reveal + post-boot verification */
    runPreloader(function () {
      revealInterface();
    });

    /* E. Start FPS monitor after a brief delay (DOM must be stable) */
    setTimeout(startPerfMonitor, 400);
  });

}());
