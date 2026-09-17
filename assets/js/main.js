
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;
  var isTouch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
  var root = document.documentElement;
  var body = document.body;
  var themeChoices = document.querySelectorAll('[data-theme-choice]');
  var themeMenu = document.querySelector('.theme-menu');
  var yearningLyrics = document.querySelector('.yearning-lyrics');
  var yearningTimer = null;
  var activeThemeName = 'default';

  function setYearningLyrics(active) {
    if (!yearningLyrics) return;
    window.clearTimeout(yearningTimer);
    yearningLyrics.classList.remove('is-animating');
    if (!active || reduceMotion) return;
    void yearningLyrics.offsetWidth;
    yearningLyrics.classList.add('is-animating');
    yearningTimer = window.setTimeout(function restartYearningLyrics() {
      yearningLyrics.classList.remove('is-animating');
      yearningTimer = window.setTimeout(function () {
        if (!body.classList.contains('theme-yearning')) return;
        void yearningLyrics.offsetWidth;
        yearningLyrics.classList.add('is-animating');
        yearningTimer = window.setTimeout(restartYearningLyrics, 27000);
      }, 5000);
    }, 27000);
  }

  function applyTheme(themeName, shouldAnimate) {
    var isThemeChange = shouldAnimate && activeThemeName !== themeName && !reduceMotion;
    if (isThemeChange) {
      body.classList.remove('is-theme-switching');
      if (themeMenu) themeMenu.classList.remove('is-switching');
      void body.offsetWidth;
      body.classList.add('is-theme-switching');
      if (themeMenu) themeMenu.classList.add('is-switching');
      window.setTimeout(function () {
        body.classList.remove('is-theme-switching');
        if (themeMenu) themeMenu.classList.remove('is-switching');
      }, 720);
    }
    activeThemeName = themeName;
    var mono = themeName === 'mono';
    var amber = themeName === 'amber';
    var violet = themeName === 'violet';
    var cosmic = themeName === 'cosmic';
    var olympus = themeName === 'olympus';
    var icarus = themeName === 'icarus';
    var yearning = themeName === 'yearning';
    var robot = themeName === 'robot';
    var dreamworks = themeName === 'dreamworks';
    body.classList.toggle('theme-mono', mono);
    body.classList.toggle('theme-amber', amber);
    body.classList.toggle('theme-violet', violet);
    body.classList.toggle('theme-cosmic', cosmic);
    body.classList.toggle('theme-olympus', olympus);
    body.classList.toggle('theme-icarus', icarus);
    body.classList.toggle('theme-yearning', yearning);
    body.classList.toggle('theme-robot', robot);
    body.classList.toggle('theme-dreamworks', dreamworks);
    setYearningLyrics(yearning);
    if (typeof syncYearningVideo === 'function') syncYearningVideo(yearning);
    if (typeof syncRobotScene === 'function') syncRobotScene(robot);
    if (dreamworks && typeof syncDreamworksBackgroundToScroll === 'function') syncDreamworksBackgroundToScroll();
    for (var i = 0; i < themeChoices.length; i++) {
      var choice = themeChoices[i];
      var isActive = choice.getAttribute('data-theme-choice') === themeName;
      choice.setAttribute('aria-pressed', String(isActive));
    }
    if (typeof setMusicState === 'function') setMusicState();
    try {
      localStorage.setItem('siteTheme', themeName);
    } catch (error) {}
  }

  var savedTheme = 'mono';
  try {
    savedTheme = localStorage.getItem('siteTheme') || 'mono';
  } catch (error) {}
  var themeFromUrl = new URLSearchParams(window.location.search).get('theme');
  if (themeFromUrl) savedTheme = themeFromUrl;
  applyTheme(savedTheme === 'mono' || savedTheme === 'amber' || savedTheme === 'violet' || savedTheme === 'cosmic' || savedTheme === 'olympus' || savedTheme === 'icarus' || savedTheme === 'yearning' || savedTheme === 'robot' || savedTheme === 'dreamworks' ? savedTheme : 'default');

  for (var themeIndex = 0; themeIndex < themeChoices.length; themeIndex++) {
    themeChoices[themeIndex].addEventListener('click', function () {
      applyTheme(this.getAttribute('data-theme-choice'), true);
      if (themeMenu) themeMenu.removeAttribute('open');
    });
  }

  if (isFinePointer && !reduceMotion) {
    root.classList.add('has-fine-pointer');
  }

  /* -------------------------------------------
     Binary rain — mouse-revealed background
     A field of falling 0s and 1s drips behind every
     section, almost invisible until the cursor passes
     over it and "reveals" a glowing patch of the rain.
  --------------------------------------------*/
  var rainCanvas = document.getElementById('binaryRainCanvas');
  if (rainCanvas && !reduceMotion) {
    var rctx = rainCanvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var fontSize = 15;
    var colSpacing = 20;
    var cssW = 0, cssH = 0, cols = 0;
    var drops = [];
    var speeds = [];
    var embers = [];
    var stars = [];
    var comets = [];
    var monoScans = [];
    var divineDust = [];
    var feathers = [];
    var activeBackgroundEffect = '';

    function sizeRain() {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      rainCanvas.width = Math.ceil(cssW * dpr);
      rainCanvas.height = Math.ceil(cssH * dpr);
      rainCanvas.style.width = cssW + 'px';
      rainCanvas.style.height = cssH + 'px';
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rctx.font = fontSize + 'px "JetBrains Mono", monospace';
      rctx.textBaseline = 'top';
      cols = Math.ceil(cssW / colSpacing) + 1;
      drops = [];
      speeds = [];
      embers = [];
      stars = [];
      comets = [];
      monoScans = [];
      divineDust = [];
      feathers = [];
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.random() * (cssH / fontSize) * -1;
        speeds[i] = 0.35 + Math.random() * 0.55;
      }
      for (var j = 0; j < Math.min(90, Math.max(42, Math.floor(cssW / 18))); j++) {
        embers.push({
          x:Math.random() * cssW,
          y:Math.random() * cssH,
          size:0.7 + Math.random() * 2.1,
          speed:0.22 + Math.random() * 0.65,
          drift:(Math.random() - 0.5) * 0.4,
          phase:Math.random() * Math.PI * 2
        });
      }
      for (var k = 0; k < Math.min(120, Math.max(55, Math.floor(cssW / 14))); k++) {
        stars.push({
          x:Math.random() * cssW,
          y:Math.random() * cssH,
          size:0.4 + Math.random() * 1.5,
          phase:Math.random() * Math.PI * 2,
          speed:0.012 + Math.random() * 0.026
        });
      }
      for (var l = 0; l < 9; l++) {
        comets.push({
          x:Math.random() * cssW,
          y:Math.random() * cssH,
          length:45 + Math.random() * 95,
          speed:2.2 + Math.random() * 2.6,
          delay:Math.random() * 220
        });
      }
      for (var m = 0; m < 7; m++) {
        monoScans.push({ y:Math.random() * cssH, speed:0.25 + Math.random() * 0.45, width:0.15 + Math.random() * 0.45 });
      }
      for (var n = 0; n < 28; n++) {
        divineDust.push({
          x:Math.random() * cssW,
          y:Math.random() * cssH,
          size:0.8 + Math.random() * 2.4,
          speed:0.18 + Math.random() * 0.34,
          sway:Math.random() * Math.PI * 2
        });
      }
      for (var o = 0; o < 18; o++) {
        feathers.push({
          x:Math.random() * cssW,
          y:Math.random() * cssH,
          size:4 + Math.random() * 7,
          speed:0.3 + Math.random() * 0.5,
          angle:Math.random() * Math.PI * 2,
          turn:(Math.random() - 0.5) * 0.025
        });
      }
    }
    sizeRain();
    window.addEventListener('resize', sizeRain);

    var hasMouse = isFinePointer && !isTouch;
    var targetMX = cssW / 2, targetMY = cssH / 2;
    var mx = targetMX, my = targetMY;
    var targetRadius = 0, curRadius = 0;

    if (hasMouse) {
      window.addEventListener('mousemove', function (e) {
        targetMX = e.clientX;
        targetMY = e.clientY;
        targetRadius = 230;
      }, { passive: true });
      document.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget) targetRadius = 0;
      });
      window.addEventListener('blur', function () { targetRadius = 0; });
    }

    var pageVisible = !document.hidden;
    document.addEventListener('visibilitychange', function () {
      pageVisible = !document.hidden;
    });

    function getRainPalette() {
      return body.classList.contains('theme-mono')
        ? { faint: [86, 86, 86], hot: [210, 210, 210], bg: [8, 8, 8] }
        : body.classList.contains('theme-amber')
          ? { faint: [127, 88, 50], hot: [255, 196, 107], bg: [16, 11, 6] }
        : body.classList.contains('theme-violet')
          ? { faint: [119, 95, 174], hot: [196, 165, 255], bg: [11, 8, 23] }
        : body.classList.contains('theme-cosmic')
          ? { faint: [87, 137, 196], hot: [119, 197, 255], bg: [3, 7, 17] }
        : body.classList.contains('theme-olympus')
          ? { faint: [157, 136, 84], hot: [233, 202, 120], bg: [11, 19, 32] }
        : body.classList.contains('theme-icarus')
          ? { faint: [172, 100, 57], hot: [255, 193, 107], bg: [26, 10, 8] }
        : body.classList.contains('theme-yearning')
          ? { faint: [170, 103, 144], hot: [255, 182, 216], bg: [22, 13, 25] }
        : { faint: [124, 142, 176], hot: [79, 214, 255], bg: [6, 9, 17] };
    }

    function drawEmbers(palette) {
      for (var i = 0; i < embers.length; i++) {
        var ember = embers[i];
        ember.phase += 0.018;
        ember.y -= ember.speed;
        ember.x += ember.drift + Math.sin(ember.phase) * 0.18;
        if (ember.y < -8 || ember.x < -8 || ember.x > cssW + 8) {
          ember.x = Math.random() * cssW;
          ember.y = cssH + 8;
          ember.phase = Math.random() * Math.PI * 2;
        }
        var pulse = 0.5 + Math.sin(ember.phase * 1.5) * 0.24;
        rctx.beginPath();
        rctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        rctx.fillStyle = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',' + pulse.toFixed(3) + ')';
        rctx.shadowColor = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0.55)';
        rctx.shadowBlur = 9;
        rctx.fill();
      }
      rctx.shadowBlur = 0;
    }

    function drawStars(palette) {
      for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        star.phase += star.speed;
        var glow = Math.sin(star.phase) > 0.38 ? 0.82 : 0.12;
        rctx.beginPath();
        rctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        rctx.fillStyle = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',' + glow.toFixed(3) + ')';
        rctx.shadowColor = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0.45)';
        rctx.shadowBlur = 6;
        rctx.fill();
      }
      rctx.shadowBlur = 0;
    }

    function drawComets(palette) {
      for (var i = 0; i < comets.length; i++) {
        var comet = comets[i];
        if (comet.delay > 0) {
          comet.delay--;
          continue;
        }
        comet.x += comet.speed;
        comet.y += comet.speed * 0.45;
        var gradient = rctx.createLinearGradient(comet.x - comet.length, comet.y - comet.length * 0.45, comet.x, comet.y);
        gradient.addColorStop(0, 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0)');
        gradient.addColorStop(1, 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0.85)');
        rctx.strokeStyle = gradient;
        rctx.lineWidth = 1.2;
        rctx.shadowColor = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0.65)';
        rctx.shadowBlur = 8;
        rctx.beginPath();
        rctx.moveTo(comet.x - comet.length, comet.y - comet.length * 0.45);
        rctx.lineTo(comet.x, comet.y);
        rctx.stroke();
        if (comet.x - comet.length > cssW || comet.y - comet.length * 0.45 > cssH) {
          comet.x = -comet.length;
          comet.y = Math.random() * cssH * 0.75;
          comet.delay = 80 + Math.random() * 260;
        }
      }
      rctx.shadowBlur = 0;
    }

    function drawMonoScans(palette) {
      for (var i = 0; i < monoScans.length; i++) {
        var scan = monoScans[i];
        scan.y += scan.speed;
        if (scan.y > cssH + 2) scan.y = -2;
        var gradient = rctx.createLinearGradient(0, scan.y - 10, 0, scan.y + 10);
        gradient.addColorStop(0, 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0)');
        gradient.addColorStop(0.5, 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',' + scan.width.toFixed(2) + ')');
        gradient.addColorStop(1, 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0)');
        rctx.fillStyle = gradient;
        rctx.fillRect(0, scan.y - 10, cssW, 20);
      }
    }

    function drawDivineLight(palette) {
      var rayOrigin = cssW * 0.62;
      for (var ray = 0; ray < 3; ray++) {
        var spread = 110 + ray * 85;
        rctx.fillStyle = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',' + (0.035 - ray * 0.008).toFixed(3) + ')';
        rctx.beginPath();
        rctx.moveTo(rayOrigin - 14, -10);
        rctx.lineTo(rayOrigin + 14, -10);
        rctx.lineTo(rayOrigin + spread, cssH);
        rctx.lineTo(rayOrigin - spread, cssH);
        rctx.closePath();
        rctx.fill();
      }
      for (var i = 0; i < divineDust.length; i++) {
        var dust = divineDust[i];
        dust.y -= dust.speed;
        dust.sway += 0.016;
        dust.x += Math.sin(dust.sway) * 0.18;
        if (dust.y < -dust.size) {
          dust.y = cssH + dust.size;
          dust.x = Math.random() * cssW;
        }
        rctx.fillStyle = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0.5)';
        rctx.beginPath();
        rctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        rctx.fill();
      }
    }

    function drawFeathers(palette) {
      for (var i = 0; i < feathers.length; i++) {
        var feather = feathers[i];
        feather.y += feather.speed;
        feather.angle += feather.turn;
        feather.x += Math.sin(feather.angle) * 0.45;
        if (feather.y > cssH + feather.size) {
          feather.y = -feather.size;
          feather.x = Math.random() * cssW;
        }
        rctx.save();
        rctx.translate(feather.x, feather.y);
        rctx.rotate(feather.angle);
        rctx.strokeStyle = 'rgba(' + palette.hot[0] + ',' + palette.hot[1] + ',' + palette.hot[2] + ',0.52)';
        rctx.lineWidth = 1.1;
        rctx.beginPath();
        rctx.moveTo(0, -feather.size);
        rctx.quadraticCurveTo(feather.size * 0.65, 0, 0, feather.size);
        rctx.stroke();
        rctx.restore();
      }
    }

    function rainLoop() {
      if (pageVisible) {
        var palette = getRainPalette();
        var faintColor = palette.faint;
        var hotColor = palette.hot;
        var backgroundEffect = body.classList.contains('theme-robot') ? 'robot' : body.classList.contains('theme-amber') ? 'embers' : body.classList.contains('theme-violet') ? 'stars' : body.classList.contains('theme-cosmic') ? 'comets' : body.classList.contains('theme-olympus') ? 'divine' : body.classList.contains('theme-icarus') ? 'feathers' : body.classList.contains('theme-mono') ? 'scanlines' : 'binary';

        if (backgroundEffect !== activeBackgroundEffect) {
          rctx.clearRect(0, 0, cssW, cssH);
          activeBackgroundEffect = backgroundEffect;
        }

        mx += (targetMX - mx) * 0.12;
        my += (targetMY - my) * 0.12;
        curRadius += (targetRadius - curRadius) * 0.08;

        if (backgroundEffect === 'robot' || backgroundEffect === 'comets' || backgroundEffect === 'stars' || backgroundEffect === 'embers' || backgroundEffect === 'scanlines' || backgroundEffect === 'divine' || backgroundEffect === 'feathers') {
          rctx.clearRect(0, 0, cssW, cssH);
        } else {
          rctx.fillStyle = 'rgba(' + palette.bg[0] + ',' + palette.bg[1] + ',' + palette.bg[2] + ',0.09)';
          rctx.fillRect(0, 0, cssW, cssH);
        }

        if (backgroundEffect === 'robot') {
          requestAnimationFrame(rainLoop);
          return;
        }
        if (backgroundEffect === 'embers') {
          drawEmbers(palette);
          requestAnimationFrame(rainLoop);
          return;
        }
        if (backgroundEffect === 'stars') {
          drawStars(palette);
          requestAnimationFrame(rainLoop);
          return;
        }
        if (backgroundEffect === 'comets') {
          drawComets(palette);
          requestAnimationFrame(rainLoop);
          return;
        }
        if (backgroundEffect === 'scanlines') {
          drawMonoScans(palette);
          requestAnimationFrame(rainLoop);
          return;
        }
        if (backgroundEffect === 'divine') {
          drawDivineLight(palette);
          requestAnimationFrame(rainLoop);
          return;
        }
        if (backgroundEffect === 'feathers') {
          drawFeathers(palette);
          requestAnimationFrame(rainLoop);
          return;
        }
        var activeR = Math.max(curRadius, 0.001);
        var r2 = activeR * activeR;

        for (var i = 0; i < cols; i++) {
          var x = i * colSpacing;
          var y = drops[i] * fontSize;

          if (y > -fontSize && y < cssH + fontSize) {
            var dx = x - mx, dy = y - my;
            var dist2 = dx * dx + dy * dy;
            var reveal = curRadius > 1 ? Math.max(0, 1 - dist2 / r2) : 0;
            reveal = reveal * reveal;

            var ch = Math.random() < 0.5 ? '0' : '1';
            var alpha = 0.045 + reveal * 0.85;
            var cr = faintColor[0] + (hotColor[0] - faintColor[0]) * reveal;
            var cg = faintColor[1] + (hotColor[1] - faintColor[1]) * reveal;
            var cb = faintColor[2] + (hotColor[2] - faintColor[2]) * reveal;

            if (reveal > 0.3) {
              rctx.shadowColor = 'rgba(' + hotColor[0] + ',' + hotColor[1] + ',' + hotColor[2] + ',0.75)';
              rctx.shadowBlur = 7;
            }
            rctx.fillStyle = 'rgba(' + (cr | 0) + ',' + (cg | 0) + ',' + (cb | 0) + ',' + alpha.toFixed(3) + ')';
            rctx.fillText(ch, x, y);
            rctx.shadowBlur = 0;
          }

          drops[i] += speeds[i];
          if (drops[i] * fontSize > cssH && Math.random() > 0.975) {
            drops[i] = Math.random() * -20;
            speeds[i] = 0.35 + Math.random() * 0.55;
          }
        }
      }
      requestAnimationFrame(rainLoop);
    }
    requestAnimationFrame(rainLoop);
  }

  /* -------------------------------------------
     Footer year
  --------------------------------------------*/
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var loaderScreen = document.getElementById('loaderScreen');
  var loaderPercent = document.getElementById('loaderPercent');
  var musicAudio = document.getElementById('musicBgAudio');
  var yearningVideo = document.getElementById('yearningBackgroundVideo');
  var robotSpline = document.getElementById('robotSpline');
  var musicToggle = document.getElementById('musicToggle');
  var musicToggleLabel = document.getElementById('musicToggleLabel');
  var musicStarted = false;
  var musicMuted = false;

  try {
    musicMuted = localStorage.getItem('musicMuted') === 'true';
  } catch (error) {}

  function updateLoaderPercent(value) {
    if (!loaderPercent) return;
    var safeValue = Math.max(1, Math.min(100, value));
    loaderPercent.textContent = safeValue + '%';
  }

  function syncMusicButton() {
    if (!musicToggle || !musicToggleLabel) return;
    musicToggle.classList.toggle('is-muted', musicMuted);
    musicToggle.classList.toggle('is-unmuted', !musicMuted);
    musicToggle.setAttribute('aria-label', musicMuted ? 'Unmute background music' : 'Mute background music');
    musicToggle.setAttribute('title', musicMuted ? 'Unmute background music' : 'Mute background music');
    musicToggle.setAttribute('aria-pressed', String(!musicMuted));
    try {
      localStorage.setItem('musicMuted', String(musicMuted));
    } catch (error) {}
  }

  function syncYearningVideo(active) {
    if (!yearningVideo) return;
    if (!active) {
      yearningVideo.pause();
      return;
    }
    yearningVideo.play().catch(function () {});
  }
  function syncRobotScene(active) {
    if (!robotSpline || !active || robotSpline.getAttribute('url')) return;
    robotSpline.setAttribute('url', robotSpline.getAttribute('data-scene'));
  }
  syncYearningVideo(body.classList.contains('theme-yearning'));
  syncRobotScene(body.classList.contains('theme-robot'));

  function setMusicState() {
    if (!musicAudio) return;
    var musicSource = body.classList.contains('theme-yearning') ? 'assets/audio/yren.mp3' : 'assets/audio/background-music.mp3';
    if (musicAudio.getAttribute('src') !== musicSource) {
      musicAudio.src = musicSource;
      musicAudio.load();
    }
    musicAudio.muted = musicMuted;
    musicAudio.loop = true;
    if (!musicStarted) return;
    musicAudio.play().catch(function () {});
  }

  function startMusicAfterLoad() {
    if (!musicAudio || musicStarted) return;
    musicStarted = true;
    setMusicState();
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', function () {
      musicMuted = !musicMuted;
      syncMusicButton();
      if (!musicAudio) return;
      musicAudio.muted = musicMuted;
      if (musicStarted) {
        musicAudio.play().catch(function () {});
      } else {
        startMusicAfterLoad();
      }
    });
  }

  syncMusicButton();

  if (loaderScreen) {
    document.body.classList.add('is-loading');
    updateLoaderPercent(1);

    var loaderStart = Date.now();
    var duration = 6000;
    var tick = function () {
      var elapsed = Date.now() - loaderStart;
      var progress = Math.min(100, Math.max(1, Math.round((elapsed / duration) * 100)));
      updateLoaderPercent(progress);
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      }
    };

    window.addEventListener('load', function () {
      tick();
      setTimeout(function () {
        updateLoaderPercent(100);
        loaderScreen.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
        startMusicAfterLoad();
      }, duration);
    });
  }

  /* -------------------------------------------
     Custom cursor (fine pointer only, motion allowed)
  --------------------------------------------*/
  if (isFinePointer && !reduceMotion) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var cursorTrail = document.querySelector('.cursor-trail');
    var cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
    var ringX = cursorX, ringY = cursorY;
    var lastParticleAt = 0;

    function addCursorParticle(x, y, burst) {
      if (!cursorTrail) return;
      var particle = document.createElement('span');
      var angle = Math.random() * Math.PI * 2;
      var distance = burst ? 30 + Math.random() * 44 : 10 + Math.random() * 21;
      particle.className = 'cursor-particle mode-' + activeThemeName + (burst ? ' is-burst' : '');
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--cursor-x', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--cursor-y', Math.sin(angle) * distance + 'px');
      particle.style.setProperty('--cursor-rotate', (Math.random() * 240 - 120) + 'deg');
      cursorTrail.appendChild(particle);
      particle.addEventListener('animationend', function () { particle.remove(); }, { once: true });
    }

    window.addEventListener('mousemove', function (e) {
      cursorX = e.clientX; cursorY = e.clientY;
      dot.style.transform = 'translate(' + cursorX + 'px,' + cursorY + 'px) translate(-50%,-50%)';
      if (performance.now() - lastParticleAt > 38) {
        addCursorParticle(cursorX, cursorY, false);
        lastParticleAt = performance.now();
      }
    }, { passive: true });

    window.addEventListener('mousedown', function (e) {
      for (var particleIndex = 0; particleIndex < 8; particleIndex++) addCursorParticle(e.clientX, e.clientY, true);
    }, { passive: true });

    function ringLoop() {
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
      requestAnimationFrame(ringLoop);
    }
    requestAnimationFrame(ringLoop);

    var hoverTargets = document.querySelectorAll('a, button, .cert-card, .goal-card, .skill-group, .project-card, .gallery-tile');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
  }

  /* -------------------------------------------
     Hero circular photo reveal
  --------------------------------------------*/
  var heroVisual = document.getElementById('heroVisual');
  var heroOverlay = document.getElementById('heroOverlay');

  if (heroVisual && (isTouch || reduceMotion)) {
    heroVisual.classList.add('is-static');
  } else if (heroVisual) {
    var targetX = 0, targetY = 0, targetR = 0;
    var curX = 0, curY = 0, curR = 0, curO = 0;
    var targetO = 0;
    var heroActive = true;
    var maxRadius;

    function sizeReveal() {
      maxRadius = Math.max(heroVisual.offsetWidth, heroVisual.offsetHeight) * 0.42;
      curX = targetX = heroVisual.offsetWidth / 2;
      curY = targetY = heroVisual.offsetHeight / 2;
    }
    sizeReveal();
    window.addEventListener('resize', sizeReveal);

    heroVisual.addEventListener('mousemove', function (e) {
      var rect = heroVisual.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      targetR = maxRadius;
      targetO = 1;
    });
    heroVisual.addEventListener('mouseleave', function () {
      targetR = 0;
      targetO = 0;
    });

    var io = new IntersectionObserver(function (entries) {
      heroActive = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    io.observe(heroVisual);

    function revealLoop() {
      if (heroActive) {
        curX += (targetX - curX) * 0.16;
        curY += (targetY - curY) * 0.16;
        curR += (targetR - curR) * 0.14;
        curO += (targetO - curO) * 0.14;
        heroVisual.style.setProperty('--rx', curX + 'px');
        heroVisual.style.setProperty('--ry', curY + 'px');
        heroVisual.style.setProperty('--rr', curR + 'px');
        heroVisual.style.setProperty('--ro', curO.toFixed(3));
      }
      requestAnimationFrame(revealLoop);
    }
    requestAnimationFrame(revealLoop);
  }

  /* -------------------------------------------
     Nav: scroll state, mobile toggle, active link
  --------------------------------------------*/
  var siteNav = document.getElementById('siteNav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var dreamworksBackground = document.querySelector('.dreamworks-background');
  var dreamworksNavItems = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('[data-nav]')) : [];
  var dreamworksImages = [
    'assets/images/dreamworks/10.png',
    'assets/images/dreamworks/1.jpg',
    'assets/images/dreamworks/2.jpg',
    'assets/images/dreamworks/3.jpg',
    'assets/images/dreamworks/4.jpg',
    'assets/images/dreamworks/5.jpg',
    'assets/images/dreamworks/6.jpg',
    'assets/images/dreamworks/7.jpg',
    'assets/images/dreamworks/8.jpg',
    'assets/images/dreamworks/9.jpg'
  ];
  var dreamworksBackgroundLayers = dreamworksBackground ? dreamworksBackground.querySelectorAll('.dreamworks-background-layer') : [];
  var dreamworksBackgroundTimer = null;
  var activeDreamworksImage = '';

  function setDreamworksBackground(imagePath) {
    if (!dreamworksBackgroundLayers.length || !imagePath || activeDreamworksImage === imagePath) return;
    activeDreamworksImage = imagePath;
    var currentLayer = dreamworksBackgroundLayers[0];
    var incomingLayer = dreamworksBackgroundLayers[1];
    window.clearTimeout(dreamworksBackgroundTimer);
    incomingLayer.style.backgroundImage = 'linear-gradient(rgba(7,21,44,.38),rgba(7,21,44,.50)),url("' + imagePath + '")';
    incomingLayer.style.backgroundSize = imagePath.endsWith('/10.png') ? 'cover, clamp(260px, 42vw, 560px) auto' : 'cover, cover';
    incomingLayer.classList.add('is-current');
    dreamworksBackgroundTimer = window.setTimeout(function () {
      currentLayer.style.backgroundImage = incomingLayer.style.backgroundImage;
      currentLayer.style.backgroundSize = incomingLayer.style.backgroundSize;
      incomingLayer.classList.remove('is-current');
    }, 820);
  }

  function syncDreamworksBackgroundToScroll() {
    if (!body.classList.contains('theme-dreamworks') || !dreamworksNavItems || !dreamworksNavItems.length) return;
    var screenCenter = window.scrollY + (window.innerHeight * 0.5);
    var activeIndex = 0;
    for (var i = 0; i < dreamworksNavItems.length; i++) {
      var target = document.querySelector(dreamworksNavItems[i].getAttribute('href'));
      if (target && target.offsetTop <= screenCenter) activeIndex = i;
    }
    setDreamworksBackground(dreamworksImages[activeIndex]);
  }

  if (navLinks && dreamworksBackground) {
    dreamworksNavItems.forEach(function (link, index) {
      link.addEventListener('click', function () {
        if (!body.classList.contains('theme-dreamworks')) return;
        setDreamworksBackground(dreamworksImages[index]);
      });
    });
  }

  window.addEventListener('scroll', function () {
    siteNav.classList.toggle('is-scrolled', window.scrollY > 12);
    syncDreamworksBackgroundToScroll();
  }, { passive: true });

  syncDreamworksBackgroundToScroll();

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var typedName = document.querySelector('.typed-name');
  var typedSurname = document.querySelector('.typed-surname');

  function typeText(element, text, delay, speed, deleteSpeed, cycleDelay) {
    if (!element) return;
    var index = 0;
    var isDeleting = false;

    function tick() {
      if (!isDeleting) {
        element.textContent = text.slice(0, index);
        index += 1;

        if (index > text.length) {
          index = text.length;
          setTimeout(function () {
            isDeleting = true;
            tick();
          }, cycleDelay || 4000);
          return;
        }
      } else {
        index -= 1;
        element.textContent = text.slice(0, index);

        if (index <= 0) {
          index = 0;
          isDeleting = false;
          setTimeout(tick, 250);
          return;
        }
      }

      var nextSpeed = isDeleting ? (deleteSpeed || Math.max(speed - 40, 80)) : speed;
      setTimeout(tick, nextSpeed);
    }

    setTimeout(tick, delay || 0);
  }

  if (typedName) typedName.textContent = 'ADRIAN GOLLEGOS';
  typeText(typedSurname, 'BANQUIL', 500, 220, 120, 4000);

  var navAnchors = document.querySelectorAll('[data-nav]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* -------------------------------------------
     Scroll reveal
  --------------------------------------------*/
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var lastRevealScrollY = window.scrollY;
    var revealScrollDirection = 'down';
    window.addEventListener('scroll', function () {
      var currentScrollY = window.scrollY;
      revealScrollDirection = currentScrollY >= lastRevealScrollY ? 'down' : 'up';
      lastRevealScrollY = currentScrollY;
    }, { passive: true });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal-direction', revealScrollDirection);
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* -------------------------------------------
     Magnetic buttons
  --------------------------------------------*/
  if (isFinePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var offX = (e.clientX - rect.left - rect.width / 2) * 0.25;
        var offY = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = 'translate(' + offX + 'px,' + offY + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* -------------------------------------------
     Certificate modal
  --------------------------------------------*/
  var modal = document.getElementById('certModal');
  var modalTitle = document.getElementById('certModalTitle');
  var modalRank = document.getElementById('certModalRank');
  var modalDesc = document.getElementById('certModalDesc');
  var modalClose = document.getElementById('certModalClose');
  var lastFocused = null;

  function openModal(data) {
    modalTitle.textContent = data.title || '';
    modalRank.textContent = data.rank || '';
    modalRank.style.display = data.rank ? 'block' : 'none';
    modalDesc.textContent = data.desc || '';
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modalClose.focus();
    document.addEventListener('keydown', onModalKeydown);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onModalKeydown);
    if (lastFocused) lastFocused.focus();
  }
  function onModalKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  document.querySelectorAll('.cert-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal({
        title: card.getAttribute('data-cert-title'),
        rank: card.getAttribute('data-cert-rank'),
        desc: card.getAttribute('data-cert-desc')
      });
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  /* -------------------------------------------
     Gallery modal
  --------------------------------------------*/
  var galleryTile = document.querySelector('.gallery-tile.has-photo');
  var galleryModal = document.getElementById('galleryModal');
  var galleryModalClose = document.getElementById('galleryModalClose');

  function openGalleryModal() {
    if (!galleryModal) return;
    var galleryImages = galleryModal.querySelectorAll('img');
    galleryImages.forEach(function (img, index) {
      img.style.setProperty('--img-index', index);
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = 'galleryImageReveal .5s ease forwards';
      img.style.animationDelay = (index * 90) + 'ms';
    });
    lastFocused = document.activeElement;
    galleryModal.classList.add('is-open');
    galleryModalClose.focus();
    document.addEventListener('keydown', onGalleryKeydown);
  }

  function closeGalleryModal() {
    if (!galleryModal) return;
    galleryModal.classList.remove('is-open');
    document.removeEventListener('keydown', onGalleryKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onGalleryKeydown(e) {
    if (e.key === 'Escape') closeGalleryModal();
  }

  if (galleryTile) {
    galleryTile.addEventListener('click', openGalleryModal);
    galleryTile.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGalleryModal();
      }
    });
  }

  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', closeGalleryModal);
  }

  if (galleryModal) {
    galleryModal.addEventListener('click', function (e) {
      if (e.target === galleryModal) closeGalleryModal();
    });
  }

  /* -------------------------------------------
     Print résumé
  --------------------------------------------*/
  var printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

})();
