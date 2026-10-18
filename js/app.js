/**
 * Shahna & Adarsh - Master Wedding Invitation Engine
 * Handles Cinematic Letter-by-Letter Text Animations,
 * Storytelling Motion, Royal Gold & Emerald Canvas Particles,
 * Audio Controller, Countdown, RSVP, Sharing, and Scroll Reveals.
 */

(function () {
  'use strict';

  // --- 1. LETTER-BY-LETTER TEXT SPLITTING UTILITY ---
  function splitTextIntoAnimatedLetters(el, customBaseDelay = null, customStagger = null) {
    if (!el || el.dataset.letterized === 'true') return;
    el.dataset.letterized = 'true';

    const baseDelay = customBaseDelay !== null
      ? customBaseDelay
      : (parseFloat(el.dataset.baseDelay) || 0);

    const stagger = customStagger !== null
      ? customStagger
      : (parseFloat(el.dataset.stagger) || 0.04);

    const rawText = el.textContent.trim();
    if (!rawText) return;

    const words = rawText.split(/\s+/);
    el.innerHTML = '';

    let currentDelay = baseDelay;

    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'anim-word';

      for (let i = 0; i < word.length; i++) {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'anim-letter';
        letterSpan.textContent = word[i];
        letterSpan.style.setProperty('--letter-delay', `${currentDelay.toFixed(3)}s`);
        wordSpan.appendChild(letterSpan);
        currentDelay += stagger;
      }

      el.appendChild(wordSpan);

      if (wIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'anim-space';
        spaceSpan.innerHTML = '&nbsp;';
        el.appendChild(spaceSpan);
      }
    });
  }

  function initAllLetterAnimations() {
    document.querySelectorAll('.letter-anim-target').forEach((target) => {
      splitTextIntoAnimatedLetters(target);
    });
  }

  // --- 2. TOAST NOTIFICATION UTILITY ---
  function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- 3. LUXURY AUDIO ENGINE ---
  class LuxuryAudioEngine {
    constructor() {
      this.isPlaying = false;
      this.audioCtx = null;
      this.gainNode = null;
      this.intervalId = null;
      this.audioElement = document.getElementById('weddingBgAudio') || new Audio('/assets/wedding_song.mp3');
      if (!this.audioElement.src) {
        this.audioElement.src = '/assets/wedding_song.mp3';
      }
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';
      this.audioElement.volume = 1.0;
      this.hasCustomMp3 = true;
      this.onStateChange = null;

      this.audioElement.addEventListener('play', () => {
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true);
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      });

      this.audioElement.addEventListener('error', (err) => {
        console.warn('assets/wedding_song.mp3 error, fallback to drone synthesizer', err);
        this.hasCustomMp3 = false;
        if (this.isPlaying) {
          this.startWebAudioDrone();
        }
      });
    }

    initWebAudio() {
      if (this.audioCtx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);
    }

    playTanpuraNote(freq, startTime, duration, type = 'sine', gainVal = 0.05) {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(gainVal, startTime + duration * 0.25);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    startWebAudioDrone() {
      this.initWebAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.4, this.audioCtx.currentTime + 2.0);

      const rootSa = 138.59;
      const pa = 207.65;
      const highSa = 277.18;
      const ga = 174.61;

      const playDroneCycle = () => {
        if (!this.isPlaying || !this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        this.playTanpuraNote(pa, now + 0.0, 4.0, 'triangle', 0.07);
        this.playTanpuraNote(highSa, now + 1.2, 3.8, 'sine', 0.06);
        this.playTanpuraNote(highSa, now + 2.4, 3.8, 'sine', 0.06);
        this.playTanpuraNote(rootSa, now + 3.6, 5.0, 'triangle', 0.09);
        this.playTanpuraNote(ga, now + 4.8, 4.2, 'sine', 0.05);
      };

      playDroneCycle();
      this.intervalId = setInterval(playDroneCycle, 5800);
    }

    stopWebAudio() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.audioCtx && this.gainNode) {
        this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.8);
      }
    }

    play() {
      this.isPlaying = true;
      this.stopWebAudio();
      this.audioElement.volume = 1.0;

      const promise = this.audioElement.play();
      if (promise !== undefined && promise.then) {
        return promise.then(() => {
          this.hasCustomMp3 = true;
          this.isPlaying = true;
          if (this.onStateChange) this.onStateChange(true);
          return true;
        }).catch((err) => {
          console.log('Autoplay waiting for first touch/click:', err);
          this.isPlaying = false;
          if (this.onStateChange) this.onStateChange(false);
          return false;
        });
      }
      return Promise.resolve(false);
    }

    pause() {
      this.isPlaying = false;
      if (this.hasCustomMp3) {
        this.audioElement.pause();
      }
      this.stopWebAudio();
      if (this.onStateChange) this.onStateChange(false);
    }

    toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      return this.isPlaying;
    }
  }

  // --- 4. FLOATING PETALS & CELEBRATORY PARTICLES CANVAS ---
  let triggerPetalsBlast = null;

  function initPetalsCanvas() {
    const canvas = document.getElementById('petalsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Combined particle pool — continuous falling + blast
    const particles = [];

    const petalColors = [
      // Rich Real Metallic Gold Tones (Sophisticated warm gold, no lemon yellow)
      { r: 212, g: 175, b: 55, isGold: true },    // Metallic Pure Gold (#d4af37)
      { r: 201, g: 155, b: 45, isGold: true },    // Antique Royal Gold (#c99b2d)
      { r: 226, g: 195, b: 114, isGold: true },   // Soft Champagne Gold (#e2c372)
      { r: 184, g: 134, b: 28, isGold: true },    // Rich Metallic Bronze Gold (#b8861c)
      { r: 218, g: 178, b: 78, isGold: true },    // Warm Lustrous Gold
      // Elegant Islamic Emerald & Forest Green Tones
      { r: 16, g: 94, b: 68, isGreen: true },     // Deep Emerald Green (#105e44)
      { r: 10, g: 68, b: 50, isGreen: true },     // Forest Green (#0a4432)
      { r: 24, g: 118, b: 86, isGreen: true },    // Royal Jade Green (#187656)
      { r: 35, g: 142, b: 105, isGreen: true },   // Subtle Emerald Green Glimmer (#238e69)
      { r: 8, g: 54, b: 40, isGreen: true }       // Dark Pine Green
    ];

    // Ambient Auspicious Floating Petals & Golden Light Motes (Subtle, calm blessings)
    const AMBIENT_COUNT = 8;
    function createAmbientParticle(initialSpread = false) {
      const isGold = Math.random() < 0.38;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      return {
        x: Math.random() * (width + 60) - 30,
        y: initialSpread ? Math.random() * height : -Math.random() * 50 - 15,
        vx: (Math.random() - 0.5) * 0.75,
        vy: isGold ? (Math.random() * 0.55 + 0.3) : (Math.random() * 0.95 + 0.55),
        friction: 0.995,
        gravity: isGold ? 0.007 : 0.018,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.6,
        flutterAngle: Math.random() * Math.PI * 2,
        flutterSpeed: Math.random() * 0.035 + 0.015,
        size: isGold ? (Math.random() * 3.2 + 2) : (Math.random() * 11 + 7),
        color,
        alpha: Math.random() * 0.35 + 0.45,
        decay: 0,
        continuous: true,
        isGold,
        wobbleSpeed: Math.random() * 1.4 + 0.8
      };
    }

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      particles.push(createAmbientParticle(true));
    }

    // --- BLAST EFFECT ON BUTTON CLICK (Celebratory shower of blessings) ---
    triggerPetalsBlast = function (originX, originY) {
      const centerX = originX || width / 2;
      const centerY = originY || height / 2;

      function spawnScatter(num, speedMultiplier) {
        for (let i = 0; i < num; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = (Math.random() * 16 + 6) * speedMultiplier;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed * 0.85 - (Math.random() * 9 + 4);
          const color = petalColors[Math.floor(Math.random() * petalColors.length)];
          const size = Math.random() * 16 + 8;
          particles.push({
            x: centerX + (Math.random() - 0.5) * 40,
            y: centerY + (Math.random() - 0.5) * 25,
            vx, vy,
            friction: 0.965,
            gravity: 0.12,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 7,
            flutterAngle: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.08 + 0.03,
            size, color,
            alpha: 1.0,
            fadeIn: false,
            decay: Math.random() * 0.003 + 0.0018,
            continuous: false,
            isGold: false,
            wobbleSpeed: Math.random() * 2 + 1.2
          });
        }
      }

      function spawnBlastFalling(num) {
        for (let i = 0; i < num; i++) {
          const color = petalColors[Math.floor(Math.random() * petalColors.length)];
          const size = Math.random() * 15 + 8;
          particles.push({
            x: Math.random() * (width + 100) - 50,
            y: -Math.random() * 60 - 20,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2.8 + 1.6,
            friction: 0.985,
            gravity: 0.09,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 5,
            flutterAngle: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.07 + 0.03,
            size, color,
            alpha: 1.0,
            fadeIn: false,
            decay: Math.random() * 0.0022 + 0.0012,
            continuous: false,
            isGold: false,
            wobbleSpeed: Math.random() * 1.8 + 1.0
          });
        }
      }

      spawnScatter(220, 1.35);
      spawnBlastFalling(90);
      setTimeout(() => { spawnScatter(80, 0.9); spawnBlastFalling(110); }, 180);
      setTimeout(() => { spawnBlastFalling(120); }, 460);
    };

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.isGold) {
        // Metallic gold particle with warm soft metallic glow
        const pulse = Math.sin(p.flutterAngle * 2.2) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha * pulse * 0.85})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
        ctx.shadowBlur = 5;
        ctx.fill();
      } else {
        // Elegant teardrop petal fluttering in 3D
        const scaleX = Math.cos(p.flutterAngle * p.wobbleSpeed);
        const scaleY = Math.sin(p.flutterAngle * 1.3) * 0.25 + 0.75;
        ctx.scale(scaleX, scaleY);

        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.8, p.size * 0.8, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.88})`;
        ctx.fill();
      }

      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.flutterAngle += p.flutterSpeed;
        p.x += p.vx + Math.sin(p.flutterAngle) * 1.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Decay for blast petals — they naturally fade out, leaving clean screen
        if (!p.continuous) {
          p.alpha -= p.decay;
        }

        // Remove fully decayed or off-screen blast petals
        if (!p.continuous && (p.alpha <= 0 || p.y > height + 60)) {
          particles.splice(i, 1);
          continue;
        }

        // Recycle continuous ambient petals
        if (p.continuous && p.y > height + 50) {
          p.y = -Math.random() * 40 - 10;
          p.x = Math.random() * (width + 60) - 30;
          p.vy = p.isGold ? (Math.random() * 0.55 + 0.3) : (Math.random() * 0.95 + 0.55);
          p.vx = (Math.random() - 0.5) * 0.75;
          continue;
        }

        drawPetal(p);
      }

      requestAnimationFrame(render);
    }

    render();
  }

  // --- 5. SACRED COUNTDOWN TIMER ---
  let countdownTimerId = null;

  function initCountdown(targetIso) {
    if (countdownTimerId) clearInterval(countdownTimerId);

    const targetDate = new Date(targetIso || '2026-11-12T16:00:00+05:30').getTime();

    const dEl = document.getElementById('countDays');
    const hEl = document.getElementById('countHours');
    const mEl = document.getElementById('countMins');
    const sEl = document.getElementById('countSecs');
    const celebrationMsg = document.getElementById('countdownCelebrationMsg');
    const gridEl = document.getElementById('countdownGrid');

    function update() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        if (gridEl) gridEl.style.display = 'none';
        if (celebrationMsg) celebrationMsg.style.display = 'block';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (dEl) dEl.innerText = String(days).padStart(2, '0');
      if (hEl) hEl.innerText = String(hours).padStart(2, '0');
      if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
      if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
    }

    update();
    countdownTimerId = setInterval(update, 1000);
  }

  // --- 6. RSVP SECTION ---
  let selectedRsvpStatus = 'accepted';

  function initRsvpSection() {
    const btnAccept = document.getElementById('btnRsvpAccept');
    const btnDecline = document.getElementById('btnRsvpDecline');
    const form = document.getElementById('rsvpForm');
    const successBox = document.getElementById('rsvpSuccessBox');
    const successTitle = document.getElementById('rsvpSuccessTitle');
    const successText = document.getElementById('rsvpSuccessText');

    if (btnAccept && btnDecline) {
      btnAccept.addEventListener('click', () => {
        btnAccept.classList.add('active');
        btnDecline.classList.remove('active');
        selectedRsvpStatus = 'accepted';
      });

      btnDecline.addEventListener('click', () => {
        btnDecline.classList.add('active');
        btnAccept.classList.remove('active');
        selectedRsvpStatus = 'declined';
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const guestName = document.getElementById('rsvpGuestName').value.trim();
        const message = document.getElementById('rsvpMessage').value.trim();

        if (!guestName) {
          alert('Please enter your full name.');
          return;
        }

        if (window.NeoDB && window.NeoDB.submitRSVP) {
          window.NeoDB.submitRSVP({
            name: guestName,
            status: selectedRsvpStatus,
            message: message
          });
        }

        form.style.display = 'none';
        if (successBox) {
          successBox.style.display = 'block';
          if (selectedRsvpStatus === 'accepted') {
            successTitle.innerText = 'BLESSINGS RECEIVED WITH JOY!';
            successText.innerText = `Thank you, ${guestName}! We are overjoyed to celebrate our wedding reception with you at Sree Balakrishna Kalyana Mandapam, Thirumala, Thiruvananthapuram.`;
          } else {
            successTitle.innerText = 'GRATEFUL FOR YOUR BLESSINGS';
            successText.innerText = `Thank you, ${guestName}! We sincerely appreciate your warm wishes and prayers.`;
          }
        }
        showToast('RSVP sent successfully!');
      });
    }
  }

  // --- 7. SHARING BUTTONS ---
  function initShareButtons() {
    const btnWhatsapp = document.getElementById('btnShareWhatsApp');
    const btnCalendar = document.getElementById('btnShareCalendar');
    const btnCopyLink = document.getElementById('btnShareCopyLink');

    const coupleName = 'Shahna & Adarsh';
    const dateText = 'Thursday, November 12, 2026';
    const hashtag = '#ShahnaWedsAdarsh';
    const pageUrl = window.location.href;

    if (btnWhatsapp) {
      const msg = encodeURIComponent(
        `🌙 Wedding Reception Invitation 🌙\n\n` +
        `Together with our families, we joyfully invite you to celebrate the wedding reception of ${coupleName}.\n\n` +
        `📅 Date: ${dateText}\n` +
        `🌙 Hijri: 1448 Rabi' al-Akhir 2\n` +
        `⏰ Time: 4:00 PM – 8:30 PM\n` +
        `📍 Venue: Sree Balakrishna Kalyana Mandapam, near Thirumala Junction, Thiruvananthapuram\n\n` +
        `View the digital wedding invitation:\n${pageUrl}\n\n` +
        `${hashtag}`
      );
      btnWhatsapp.href = `https://api.whatsapp.com/send?text=${msg}`;
    }

    if (btnCalendar) {
      btnCalendar.addEventListener('click', () => {
        const title = encodeURIComponent(`Wedding Reception of ${coupleName}`);
        const details = encodeURIComponent(`Wedding Reception of ${coupleName} at Sree Balakrishna Kalyana Mandapam, near Thirumala Junction, Thiruvananthapuram.`);
        const location = encodeURIComponent(`Sree Balakrishna Kalyana Mandapam, near Thirumala Junction, Thiruvananthapuram, Kerala`);
        const dates = `20261112T103000Z/20261112T150000Z`;

        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
        window.open(googleCalUrl, '_blank');
      });
    }

    if (btnCopyLink) {
      btnCopyLink.addEventListener('click', () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
          showToast('Invitation link copied to clipboard!');
        }).catch(() => {
          prompt('Copy invitation link:', pageUrl);
        });
      });
    }
  }

  // --- 8. SCROLL REVEAL OBSERVER WITH MOTION CHOREOGRAPHY ---
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  // --- 9. INITIALIZE APPLICATION ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Split all letter-by-letter targets into animated spans
    initAllLetterAnimations();

    const audioEngine = new LuxuryAudioEngine();
    const audioBtn = document.getElementById('audioToggleBtn');
    const coverMusicBtn = document.getElementById('coverMusicBtn');
    const openInvitationBtn = document.getElementById('btnOpenInvitation');
    const coverScreen = document.getElementById('coverScreen');

    initPetalsCanvas();
    initCountdown('2026-11-12T16:00:00+05:30');
    initRsvpSection();
    initShareButtons();
    initScrollReveal();

    // Sync Audio Buttons UI (both top bar and cover card pill)
    audioEngine.onStateChange = (isPlaying) => {
      // Top bar button
      if (audioBtn) {
        const text = audioBtn.querySelector('.audio-text');
        if (isPlaying) {
          audioBtn.classList.add('playing');
          if (text) text.innerText = 'MUSIC ON';
        } else {
          audioBtn.classList.remove('playing');
          if (text) text.innerText = 'MUSIC OFF';
        }
      }

      // Cover screen music pill
      if (coverMusicBtn) {
        const coverText = coverMusicBtn.querySelector('.cover-music-text');
        if (isPlaying) {
          coverMusicBtn.classList.add('playing');
          if (coverText) coverText.innerText = 'MUSIC PLAYING';
        } else {
          coverMusicBtn.classList.remove('playing');
          if (coverText) coverText.innerText = 'PLAY WEDDING SONG';
        }
      }
    };

    if (audioEngine.isPlaying) {
      audioEngine.onStateChange(true);
    }

    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audioEngine.toggle();
      });
    }

    if (coverMusicBtn) {
      coverMusicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audioEngine.toggle();
      });
    }

    // --- AUTO-PLAY MUSIC RIGHT ON OPEN INVITATION SCREEN ---
    const startAudio = () => {
      if (audioEngine.isPlaying) return Promise.resolve(true);
      return audioEngine.play().then((ok) => {
        return ok;
      }).catch(() => false);
    };

    // 1. Immediate autoplay attempts when the page lands
    startAudio();
    window.addEventListener('load', startAudio, { once: true });
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        startAudio();
      }
    });

    // 2. Continuous gesture listener on the opening screen:
    // Starts music instantly on first tap or click anywhere on the page
    const gestureEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'keydown'];
    const handleGesture = () => {
      startAudio().then((started) => {
        if (started) {
          gestureEvents.forEach((evt) => {
            window.removeEventListener(evt, handleGesture, { capture: true });
            document.removeEventListener(evt, handleGesture, { capture: true });
          });
        }
      });
    };

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { capture: true, passive: true });
      document.addEventListener(evt, handleGesture, { capture: true, passive: true });
    });

    if (coverScreen) {
      coverScreen.addEventListener('click', () => {
        startAudio();
      }, { passive: true });
    }

    // OPEN INVITATION BUTTON (Cinematic Transition & Continuous Reveal)
    if (openInvitationBtn && coverScreen) {
      openInvitationBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (coverScreen.classList.contains('scattering')) return;
        coverScreen.classList.add('scattering');
        document.body.classList.add('invitation-opened');

        const btnText = document.getElementById('btnOpenInvitationText');
        if (btnText) {
          btnText.innerText = 'OPENING...';
        }

        // 1. Play Background Music immediately
        if (!audioEngine.isPlaying) {
          audioEngine.play();
        }

        // 2. Celebratory flower petal & gold dust scatter
        const rect = openInvitationBtn.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        if (typeof triggerPetalsBlast === 'function') {
          triggerPetalsBlast(originX, originY);
        }

        // 3. Smooth fade & scale out of cover card
        setTimeout(() => {
          coverScreen.classList.add('opened');
          window.scrollTo(0, 0);

          // Trigger Hero Section sequential reveal
          const heroSec = document.getElementById('heroSection');
          if (heroSec) {
            heroSec.classList.add('revealed');
          }
        }, 480);
      });
    }
  });
})();
