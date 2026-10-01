/**
 * Wedding T2: envelope Save the Date cover + scrollable pastel invitation.
 */
(function () {
  'use strict';

  /* ============================================================
     BASIC HELPERS
     ============================================================ */

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var el = byId(id);
    if (el) {
      el.textContent = value == null ? '' : String(value);
    }
    return el;
  }

  function setHtml(id, value) {
    var el = byId(id);
    if (el) {
      el.innerHTML = value == null ? '' : String(value);
    }
    return el;
  }

  function getAttr(name, fallback) {
    var body = document.body;
    if (!body) return fallback;

    var value = body.getAttribute(name);
    return value == null || value === '' ? fallback : value;
  }

  function getDataAttr(name, fallback) {
    var body = document.body;
    if (!body) return fallback;

    var value = body.getAttribute('data-' + name);
    return value == null || value === '' ? fallback : value;
  }

  function addClass(id, className) {
    var el = byId(id);
    if (el) el.classList.add(className);
    return el;
  }

  function removeClass(id, className) {
    var el = byId(id);
    if (el) el.classList.remove(className);
    return el;
  }

  function toggleClass(id, className, state) {
    var el = byId(id);
    if (el) el.classList.toggle(className, !!state);
    return el;
  }

  function safeCall(fn) {
    try {
      if (typeof fn === 'function') {
        return fn();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* ============================================================
     DATE HELPERS
     ============================================================ */

  function ordinalDaySuffix(day) {
    var n = Number(day);

    if (!n) {
      return '';
    }

    var mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 13) {
      return 'th';
    }

    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  function parseDateOnly(dateRaw) {
    if (!dateRaw) {
      return null;
    }

    var eventDate = new Date(String(dateRaw) + 'T00:00:00');

    if (isNaN(eventDate.getTime())) {
      return null;
    }

    return eventDate;
  }

  function formatScratchWeekdayDay(dateRaw) {
    if (!dateRaw) {
      return '';
    }

    var eventDate = new Date(dateRaw + 'T00:00:00');

    if (isNaN(eventDate.getTime())) {
      return '';
    }

    var dayNum = eventDate.getDate();
    var dayLabel = String(dayNum);

    if (getAttr('data-scratch-day-ordinal', '') === 'true') {
      dayLabel = dayNum + ordinalDaySuffix(dayNum);
    }

    return (
      eventDate.toLocaleDateString('en-GB', {
        weekday: 'long'
      }) +
      ', ' +
      dayLabel
    );
  }

  /*
   * FULL SCRATCH DATE
   *
   * Example:
   * Tuesday, 27th October 2026
   *
   * This is intentionally kept separate from the older
   * weekday/day formatter so the Scratch section can display
   * both complete event dates vertically.
   */
  function formatScratchFullDate(dateRaw) {
    if (!dateRaw) {
      return '';
    }

    var eventDate = new Date(dateRaw + 'T00:00:00');

    if (isNaN(eventDate.getTime())) {
      return '';
    }

    var dayNum = eventDate.getDate();

    var weekday = eventDate.toLocaleDateString('en-GB', {
      weekday: 'long'
    });

    var month = eventDate.toLocaleDateString('en-GB', {
      month: 'long'
    });

    var year = eventDate.getFullYear();

    return (
      weekday +
      ', ' +
      dayNum +
      ordinalDaySuffix(dayNum) +
      ' ' +
      month +
      ' ' +
      year
    );
  }

  function formatLongDate(dateRaw) {
    var eventDate = parseDateOnly(dateRaw);

    if (!eventDate) {
      return '';
    }

    var dayNum = eventDate.getDate();

    return (
      eventDate.toLocaleDateString('en-GB', {
        weekday: 'long'
      }) +
      ', ' +
      dayNum +
      ordinalDaySuffix(dayNum) +
      ' ' +
      eventDate.toLocaleDateString('en-GB', {
        month: 'long'
      }) +
      ' ' +
      eventDate.getFullYear()
    );
  }

  function formatMonth(dateRaw) {
    var eventDate = parseDateOnly(dateRaw);

    if (!eventDate) {
      return '';
    }

    return eventDate
      .toLocaleDateString('en-GB', {
        month: 'long'
      })
      .toUpperCase();
  }

  function formatYear(dateRaw) {
    var eventDate = parseDateOnly(dateRaw);

    if (!eventDate) {
      return '';
    }

    return String(eventDate.getFullYear());
  }

  function formatDayNumber(dateRaw) {
    var eventDate = parseDateOnly(dateRaw);

    if (!eventDate) {
      return '';
    }

    return String(eventDate.getDate());
  }

  function formatWeekday(dateRaw) {
    var eventDate = parseDateOnly(dateRaw);

    if (!eventDate) {
      return '';
    }

    return eventDate.toLocaleDateString('en-GB', {
      weekday: 'long'
    });
  }

  /* ============================================================
     CONFIGURATION
     ============================================================ */

  var body = document.body;

  var config = {
    event1Date:
      body && body.getAttribute('data-event-1-date')
        ? body.getAttribute('data-event-1-date')
        : '2026-10-27',

    event2Date:
      body && body.getAttribute('data-event-2-date')
        ? body.getAttribute('data-event-2-date')
        : '2026-10-28',

    event1Label:
      body && body.getAttribute('data-event-1-label')
        ? body.getAttribute('data-event-1-label')
        : 'Day 1',

    event2Label:
      body && body.getAttribute('data-event-2-label')
        ? body.getAttribute('data-event-2-label')
        : 'Day 2',

    eventAddress:
      body && body.getAttribute('data-event-address')
        ? body.getAttribute('data-event-address')
        : 'Baghwanpora, Lalbazar, Srinagar, Jammu and Kashmir',

    mapsUrl:
      body && body.getAttribute('data-maps-url')
        ? body.getAttribute('data-maps-url')
        : 'https://maps.app.goo.gl/VMx4amuEaxYhAL3q7?g_st=ic'
  };

  /* ============================================================
     EVENT DATA
     ============================================================ */

  var event1DateRaw = config.event1Date;
  var event2DateRaw = config.event2Date;

  var event1Date = parseDateOnly(event1DateRaw);
  var event2Date = parseDateOnly(event2DateRaw);

  /* ============================================================
     GENERAL EVENT TEXT
     ============================================================ */

  function updateEventDates() {
    var date1 = formatLongDate(event1DateRaw);
    var date2 = formatLongDate(event2DateRaw);

    qsa('[data-event-1-date-text]').forEach(function (el) {
      el.textContent = date1;
    });

    qsa('[data-event-2-date-text]').forEach(function (el) {
      el.textContent = date2;
    });

    qsa('[data-event-1-label]').forEach(function (el) {
      el.textContent = config.event1Label;
    });

    qsa('[data-event-2-label]').forEach(function (el) {
      el.textContent = config.event2Label;
    });
  }

  /* ============================================================
     ADDRESS / MAP
     ============================================================ */

  function updateMapLinks() {
    qsa('a[href*="maps.app.goo.gl"], [data-maps-link]').forEach(function (
      el
    ) {
      if (el.tagName && el.tagName.toLowerCase() === 'a') {
        el.href = config.mapsUrl;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }
    });

    qsa('[data-event-address]').forEach(function (el) {
      el.textContent = config.eventAddress;
    });
  }

  /* ============================================================
     SCRATCH CARD
     ============================================================ */

  var scratchRevealed = false;
  var scratchInitialized = false;

  function getScratchElements() {
    return {
      card: byId('wed2-scratch-card'),
      canvas: byId('wed2-scratch-canvas'),
      month: byId('wed2-scratch-month'),
      day: byId('wed2-scratch-day'),
      year: byId('wed2-scratch-year'),
      time: byId('wed2-scratch-time'),
      hint: byId('wed2-scratch-hint')
    };
  }

  function updateScratchContent() {
    var scratchMonthEl = byId('wed2-scratch-month');
    var scratchDayEl = byId('wed2-scratch-day');
    var scratchYearEl = byId('wed2-scratch-year');
    var scratchTimeEl = byId('wed2-scratch-time');

    /*
     * The Scratch section intentionally displays ONLY:
     *
     * Tuesday, 27th October 2026
     * &
     * Wednesday, 28th October 2026
     *
     * No separate month/year line is required.
     */

    if (scratchMonthEl) {
      scratchMonthEl.textContent = '';
      scratchMonthEl.style.display = 'none';
    }

    if (scratchYearEl) {
      scratchYearEl.textContent = '';
      scratchYearEl.style.display = 'none';
    }

    if (scratchTimeEl) {
      scratchTimeEl.style.display = 'none';
    }

    if (scratchDayEl) {
      setHtml(
        'wed2-scratch-day',
        '<span class="wed2-scratch-date-value wed2-scratch-date-top">' +
          formatScratchFullDate(event1DateRaw) +
          '</span>' +
          '<span class="wed2-scratch-date-divider">&amp;</span>' +
          '<span class="wed2-scratch-date-value wed2-scratch-date-bottom">' +
          formatScratchFullDate(event2DateRaw) +
          '</span>'
      );

      scratchDayEl.classList.add('wed2-scratch-day-dual');
      scratchDayEl.classList.add('wed2-scratch-day-full');
    }
  }

  function resizeScratchCanvas() {
    var elements = getScratchElements();

    if (!elements.canvas || !elements.card) {
      return;
    }

    var rect = elements.card.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    var dpr = Math.max(1, window.devicePixelRatio || 1);

    elements.canvas.width = Math.floor(rect.width * dpr);
    elements.canvas.height = Math.floor(rect.height * dpr);

    elements.canvas.style.width = rect.width + 'px';
    elements.canvas.style.height = rect.height + 'px';

    var ctx = elements.canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /*
     * Scratch overlay.
     */
    ctx.fillStyle = '#d6d0c5';
    ctx.fillRect(0, 0, rect.width, rect.height);

    /*
     * Subtle scratch texture.
     */
    var gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);

    gradient.addColorStop(0, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.02)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.08)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    /*
     * Small diagonal texture lines.
     */
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    for (var x = -rect.height; x < rect.width; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + rect.height, rect.height);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    /*
     * Scratch hint.
     */
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var fontSize = Math.max(12, Math.min(16, rect.width * 0.04));

    ctx.font =
      '600 ' +
      fontSize +
      'px ' +
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    ctx.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2);
  }

  function scratchPoint(event, canvas) {
    var rect = canvas.getBoundingClientRect();

    var clientX;
    var clientY;

    if (event.touches && event.touches.length) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function eraseScratch(event) {
    var canvas = byId('wed2-scratch-canvas');

    if (!canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    var point = scratchPoint(event, canvas);

    ctx.save();

    ctx.globalCompositeOperation = 'destination-out';

    var radius = Math.max(
      24,
      Math.min(44, canvas.getBoundingClientRect().width * 0.075)
    );

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (scratchRevealed) {
      return;
    }

    var canvas = byId('wed2-scratch-canvas');

    if (!canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    var width = canvas.width;
    var height = canvas.height;

    if (!width || !height) {
      return;
    }

    /*
     * Sample the alpha channel instead of scanning every pixel.
     */
    var sampleStep = 12;

    var imageData;

    try {
      imageData = ctx.getImageData(
        0,
        0,
        width,
        height
      );
    } catch (error) {
      return;
    }

    var data = imageData.data;

    var total = 0;
    var transparent = 0;

    for (var y = 0; y < height; y += sampleStep) {
      for (var x = 0; x < width; x += sampleStep) {
        var index = (y * width + x) * 4 + 3;

        total++;

        if (data[index] < 100) {
          transparent++;
        }
      }
    }

    if (!total) {
      return;
    }

    var percentage = transparent / total;

    if (percentage >= 0.42) {
      revealScratch();
    }
  }

  function revealScratch() {
    if (scratchRevealed) {
      return;
    }

    scratchRevealed = true;

    var canvas = byId('wed2-scratch-canvas');
    var card = byId('wed2-scratch-card');
    var hint = byId('wed2-scratch-hint');

    if (canvas) {
      canvas.classList.add('is-revealed');

      setTimeout(function () {
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0';
      }, 250);
    }

    if (card) {
      card.classList.add('is-revealed');
    }

    if (hint) {
      hint.classList.add('is-hidden');
    }
  }

  function resetScratch() {
    scratchRevealed = false;

    var canvas = byId('wed2-scratch-canvas');
    var card = byId('wed2-scratch-card');
    var hint = byId('wed2-scratch-hint');

    if (canvas) {
      canvas.classList.remove('is-revealed');
      canvas.style.opacity = '';
      canvas.style.pointerEvents = '';
    }

    if (card) {
      card.classList.remove('is-revealed');
    }

    if (hint) {
      hint.classList.remove('is-hidden');
    }

    resizeScratchCanvas();
  }

  function initScratch() {
    if (scratchInitialized) {
      updateScratchContent();
      return;
    }

    scratchInitialized = true;

    updateScratchContent();

    var canvas = byId('wed2-scratch-canvas');

    if (!canvas) {
      return;
    }

    var scratching = false;

    canvas.addEventListener(
      'pointerdown',
      function (event) {
        if (scratchRevealed) {
          return;
        }

        scratching = true;

        if (canvas.setPointerCapture) {
          try {
            canvas.setPointerCapture(event.pointerId);
          } catch (error) {}
        }

        eraseScratch(event);
        event.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener(
      'pointermove',
      function (event) {
        if (!scratching || scratchRevealed) {
          return;
        }

        eraseScratch(event);
        event.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener(
      'pointerup',
      function () {
        scratching = false;
      },
      { passive: true }
    );

    canvas.addEventListener(
      'pointercancel',
      function () {
        scratching = false;
      },
      { passive: true }
    );

    canvas.addEventListener(
      'touchstart',
      function (event) {
        if (scratchRevealed) {
          return;
        }

        eraseScratch(event);
        event.preventDefault();
      },
      { passive: false }
    );

    canvas.addEventListener(
      'touchmove',
      function (event) {
        if (scratchRevealed) {
          return;
        }

        eraseScratch(event);
        event.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener('resize', function () {
      if (!scratchRevealed) {
        resizeScratchCanvas();
      }
    });

    setTimeout(function () {
      resizeScratchCanvas();
    }, 100);
  }

  /* ============================================================
     ENVELOPE / COVER
     ============================================================ */

  var sessionCover = 'cover';
  var sessionInvite = 'invite';

  function getStoredSession() {
    try {
      return sessionStorage.getItem('wedding-t2-session') || '';
    } catch (error) {
      return '';
    }
  }

  function setStoredSession(value) {
    try {
      sessionStorage.setItem('wedding-t2-session', value);
    } catch (error) {}
  }

  function showSession(session) {
    var cover = qs('.wed2-cover');
    var invitation = qs('.wed2-invitation');

    if (session === sessionInvite) {
      if (cover) {
        cover.classList.add('is-hidden');
      }

      if (invitation) {
        invitation.classList.remove('is-hidden');
      }

      document.body.classList.add('wed2-invitation-open');

      setStoredSession(sessionInvite);
    } else {
      if (cover) {
        cover.classList.remove('is-hidden');
      }

      if (invitation) {
        invitation.classList.add('is-hidden');
      }

      document.body.classList.remove('wed2-invitation-open');

      setStoredSession(sessionCover);
    }
  }

  function openInvitation() {
    showSession(sessionInvite);

    var invitation = qs('.wed2-invitation');

    if (invitation) {
      setTimeout(function () {
        try {
          invitation.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } catch (error) {}
      }, 50);
    }
  }

  function initEnvelope() {
    var buttons = qsa(
      '[data-open-invitation], .wed2-open-invitation, #wed2-open-invitation'
    );

    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        openInvitation();
      });
    });

    var closeButtons = qsa(
      '[data-close-invitation], .wed2-close-invitation'
    );

    closeButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        showSession(sessionCover);
      });
    });
  }

  /* ============================================================
     STYLE PICKER
     ============================================================ */

  function initStylePicker(callback) {
    var picker = byId('wed2-style-picker');

    if (!picker) {
      safeCall(callback);
      return;
    }

    var buttons = qsa('[data-style]', picker);

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var style = button.getAttribute('data-style');

        if (!style) {
          return;
        }

        document.body.setAttribute('data-style', style);

        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });

        try {
          localStorage.setItem('wedding-t2-style', style);
        } catch (error) {}

        safeCall(callback);
      });
    });

    try {
      var storedStyle = localStorage.getItem('wedding-t2-style');

      if (storedStyle) {
        document.body.setAttribute('data-style', storedStyle);

        buttons.forEach(function (button) {
          button.classList.toggle(
            'active',
            button.getAttribute('data-style') === storedStyle
          );
        });
      }
    } catch (error) {}

    safeCall(callback);
  }

  /* ============================================================
     MUSIC
     ============================================================ */

  var musicStarted = false;

  function getMusicElement() {
    return (
      byId('wedding-music') ||
      byId('wed2-music') ||
      qs('audio[data-wedding-music]')
    );
  }

  function showMuteButton(show) {
    var button =
      byId('wed2-mute-button') ||
      qs('[data-mute-button]');

    if (!button) {
      return;
    }

    button.style.display = show ? '' : 'none';
  }

  function setMusicButtonState() {
    var button =
      byId('wed2-mute-button') ||
      qs('[data-mute-button]');

    var audio = getMusicElement();

    if (!button || !audio) {
      return;
    }

    var muted = !!audio.muted;

    button.classList.toggle('is-muted', muted);

    var label = muted ? 'Unmute music' : 'Mute music';

    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  }

  function startMusic() {
    var audio = getMusicElement();

    if (!audio || musicStarted) {
      return;
    }

    musicStarted = true;

    try {
      var promise = audio.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          musicStarted = false;
        });
      }
    } catch (error) {
      musicStarted = false;
    }
  }

  function initMusic() {
    var audio = getMusicElement();

    if (!audio) {
      showMuteButton(false);
      return;
    }

    showMuteButton(true);

    setMusicButtonState();

    var button =
      byId('wed2-mute-button') ||
      qs('[data-mute-button]');

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        audio.muted = !audio.muted;

        setMusicButtonState();

        if (!audio.muted) {
          try {
            audio.play();
          } catch (error) {}
        }
      });
    }

    document.addEventListener(
      'click',
      function firstInteraction() {
        startMusic();
        document.removeEventListener('click', firstInteraction);
      },
      {
        once: true
      }
    );
  }

  /* ============================================================
     COUNTDOWN
     ============================================================ */

  function getCountdownTarget() {
    var attr =
      body && body.getAttribute('data-countdown-date')
        ? body.getAttribute('data-countdown-date')
        : event1DateRaw;

    var date = parseDateOnly(attr);

    if (!date) {
      return null;
    }

    return date;
  }

  function updateCountdown() {
    var target = getCountdownTarget();

    if (!target) {
      return;
    }

    var now = new Date();
    var difference = target.getTime() - now.getTime();

    var daysEl =
      byId('wed2-countdown-days') ||
      byId('countdown-days');

    var hoursEl =
      byId('wed2-countdown-hours') ||
      byId('countdown-hours');

    var minutesEl =
      byId('wed2-countdown-minutes') ||
      byId('countdown-minutes');

    var secondsEl =
      byId('wed2-countdown-seconds') ||
      byId('countdown-seconds');

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    var totalSeconds = Math.floor(difference / 1000);

    var days = Math.floor(totalSeconds / 86400);

    totalSeconds -= days * 86400;

    var hours = Math.floor(totalSeconds / 3600);

    totalSeconds -= hours * 3600;

    var minutes = Math.floor(totalSeconds / 60);

    var seconds = totalSeconds % 60;

    function pad(number) {
      return String(number).padStart(2, '0');
    }

    if (daysEl) {
      daysEl.textContent = String(days);
    }

    if (hoursEl) {
      hoursEl.textContent = pad(hours);
    }

    if (minutesEl) {
      minutesEl.textContent = pad(minutes);
    }

    if (secondsEl) {
      secondsEl.textContent = pad(seconds);
    }
  }

  function initCountdown() {
    updateCountdown();

    setInterval(function () {
      updateCountdown();
    }, 1000);
  }

  /* ============================================================
     SCROLL REVEALS
     ============================================================ */

  function initScrollReveal() {
    var elements = qsa(
      '[data-reveal], .wed2-reveal, .wed2-fade-in'
    );

    if (!elements.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (element) {
        element.classList.add('is-visible');
      });

      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ============================================================
     SMOOTH ANCHOR LINKS
     ============================================================ */

  function initAnchors() {
    qsa('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');

        if (!href || href === '#') {
          return;
        }

        var target;

        try {
          target = document.querySelector(href);
        } catch (error) {
          return;
        }

        if (!target) {
          return;
        }

        event.preventDefault();

        try {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } catch (error) {
          target.scrollIntoView();
        }
      });
    });
  }

  /* ============================================================
     COPY ADDRESS
     ============================================================ */

  function initCopyAddress() {
    qsa(
      '[data-copy-address], .wed2-copy-address'
    ).forEach(function (button) {
      button.addEventListener('click', function () {
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          navigator.clipboard
            .writeText(config.eventAddress)
            .then(function () {
              button.classList.add('copied');

              setTimeout(function () {
                button.classList.remove('copied');
              }, 1500);
            })
            .catch(function () {});
        }
      });
    });
  }

  /* ============================================================
     RSVP / FORM HELPERS
     ============================================================ */

  function initForms() {
    qsa('form[data-prevent-submit]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
      });
    });
  }

  /* ============================================================
     PAGE VISIBILITY
     ============================================================ */

  function initVisibility() {
    document.addEventListener('visibilitychange', function () {
      var audio = getMusicElement();

      if (!audio) {
        return;
      }

      if (document.hidden) {
        try {
          audio.pause();
        } catch (error) {}
      } else if (
        musicStarted &&
        !audio.muted
      ) {
        try {
          audio.play();
        } catch (error) {}
      }
    });
  }

  /* ============================================================
     DYNAMIC SCRATCH CSS
     ============================================================ */

  function injectScratchFixStyles() {
    if (byId('wed2-scratch-runtime-fix')) {
      return;
    }

    var style = document.createElement('style');

    style.id = 'wed2-scratch-runtime-fix';

    style.textContent = `
      #wed2-scratch-month,
      #wed2-scratch-year,
      #wed2-scratch-time {
        display: none !important;
      }

      #wed2-scratch-day.wed2-scratch-day-full {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        width: 100%;
        margin: 0;
        padding: 0;
        line-height: 1.2;
        text-align: center;
      }

      #wed2-scratch-day .wed2-scratch-date-value {
        display: block;
        width: 100%;
        white-space: nowrap;
      }

      #wed2-scratch-day .wed2-scratch-date-divider {
        display: block;
        line-height: 1;
        margin: 0.1rem 0;
      }

      #wed2-scratch-day .wed2-scratch-date-top,
      #wed2-scratch-day .wed2-scratch-date-bottom {
        display: block;
      }

      @media (max-width: 520px) {
        #wed2-scratch-day .wed2-scratch-date-value {
          font-size: 0.92em;
          white-space: normal;
        }

        #wed2-scratch-day.wed2-scratch-day-full {
          gap: 0.35rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     EVENT CARDS
     ============================================================ */

  function updateEventCards() {
    var event1DateObject = parseDateOnly(event1DateRaw);
    var event2DateObject = parseDateOnly(event2DateRaw);

    qsa('[data-event-card="1"]').forEach(function (card) {
      var dateText = formatLongDate(event1DateRaw);

      var dateElements = qsa(
        '[data-event-date], .event-date',
        card
      );

      dateElements.forEach(function (element) {
        element.textContent = dateText;
      });

      qsa('[data-event-label], .event-label', card).forEach(
        function (element) {
          element.textContent = config.event1Label;
        }
      );
    });

    qsa('[data-event-card="2"]').forEach(function (card) {
      var dateText = formatLongDate(event2DateRaw);

      var dateElements = qsa(
        '[data-event-date], .event-date',
        card
      );

      dateElements.forEach(function (element) {
        element.textContent = dateText;
      });

      qsa('[data-event-label], .event-label', card).forEach(
        function (element) {
          element.textContent = config.event2Label;
        }
      );
    });

    /*
     * Keep references used by the original template alive.
     */
    if (event1DateObject && event2DateObject) {
      var sameYear =
        event1DateObject.getFullYear() ===
        event2DateObject.getFullYear();

      document.body.classList.toggle(
        'wed2-events-same-year',
        sameYear
      );
    }
  }

  /* ============================================================
     DAY LABEL REPLACEMENT
     ============================================================ */

  function updateDayLabels() {
    /*
     * Replace explicit event labels where the template exposes
     * data attributes.
     */
    qsa('[data-event-day="1"]').forEach(function (element) {
      element.textContent = config.event1Label;
    });

    qsa('[data-event-day="2"]').forEach(function (element) {
      element.textContent = config.event2Label;
    });
  }

  /* ============================================================
     PAGE INITIALIZATION
     ============================================================ */

  function initializePage() {
    updateEventDates();
    updateMapLinks();
    updateEventCards();
    updateDayLabels();

    injectScratchFixStyles();
    initScratch();

    initEnvelope();
    initMusic();
    initCountdown();
    initScrollReveal();
    initAnchors();
    initCopyAddress();
    initForms();
    initVisibility();

    /*
     * Apply saved cover/invitation state.
     */
    var storedSession = getStoredSession();

    if (storedSession === sessionInvite) {
      showSession(sessionInvite);
    } else {
      showSession(sessionCover);
    }
  }

  /* ============================================================
     DOM READY
     ============================================================ */

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        initStylePicker(function () {
          initializePage();
        });
      }
    );
  } else {
    initStylePicker(function () {
      initializePage();
    });
  }

  /* ============================================================
     GLOBAL SAFETY
     ============================================================ */

  window.WeddingT2 = window.WeddingT2 || {};

  window.WeddingT2.refreshScratch = function () {
    updateScratchContent();
    resizeScratchCanvas();
  };

  window.WeddingT2.resetScratch = function () {
    resetScratch();
  };

  window.WeddingT2.revealScratch = function () {
    revealScratch();
  };

  window.WeddingT2.getEventDates = function () {
    return {
      event1: event1DateRaw,
      event2: event2DateRaw,
      event1Formatted: formatLongDate(event1DateRaw),
      event2Formatted: formatLongDate(event2DateRaw)
    };
  };

  /*
   * Keep these references available for compatibility with
   * existing template code.
   */
  window.WeddingT2.formatScratchFullDate =
    formatScratchFullDate;

  window.WeddingT2.formatScratchWeekdayDay =
    formatScratchWeekdayDay;

  window.WeddingT2.ordinalDaySuffix =
    ordinalDaySuffix;

  /*
   * Final UI refresh after fonts/layout settle.
   */
  window.addEventListener('load', function () {
    setTimeout(function () {
      updateScratchContent();
      resizeScratchCanvas();
    }, 150);
  });

  /*
   * Recalculate scratch canvas if the page layout changes.
   */
  if (typeof ResizeObserver !== 'undefined') {
    var scratchCard = byId('wed2-scratch-card');

    if (scratchCard) {
      try {
        var resizeObserver = new ResizeObserver(function () {
          if (!scratchRevealed) {
            resizeScratchCanvas();
          }
        });

        resizeObserver.observe(scratchCard);
      } catch (error) {}
    }
  }

  /*
   * Prevent accidental browser pull-to-refresh while actively
   * scratching on supported mobile browsers.
   */
  document.addEventListener(
    'touchmove',
    function (event) {
      var target = event.target;

      if (
        target &&
        target.id === 'wed2-scratch-canvas' &&
        !scratchRevealed
      ) {
        event.preventDefault();
      }
    },
    {
      passive: false
    }
  );

  /* ============================================================
     INITIAL MUSIC BUTTON STATE
     ============================================================ */

  showMuteButton(false);

  initStylePicker(function () {
    showSession(sessionCover);
  });
})();
