/* Procedural background music. Every track is synthesized live with the Web Audio API from
 * chord progressions and step patterns, so there are no audio files and nothing to license.
 * The same code renders offline (renderOffline) for tests.
 */
(function (root) {
  'use strict';

  var M7 = [0, 3, 7, 10], MAJ7 = [0, 4, 7, 11], DOM7 = [0, 4, 7, 10], MIN = [0, 3, 7], MAJ = [0, 4, 7], M9 = [0, 3, 7, 10, 14], MAJ9 = [0, 4, 7, 11, 14], SIX = [0, 4, 7, 9];
  function ch(r, n) { return { r: r, n: n }; }

  var TRACKS = [
    {
      id: 'lofi', seed: 11, bpm: 76, swing: 0.2, key: 57,
      name: { en: 'Case Opened', ru: 'Дело открыто' }, mood: { en: 'lo-fi · cosy', ru: 'лоу-фай · уютно' },
      prog: [ch(0, M7), ch(-4, MAJ7), ch(-7, M7), ch(-5, DOM7)],
      drums: { kick: 'x.....x...x.....', snare: '....x.......x...', hat: 'o.o.o.o.o.o.o.oo' },
      bass: { wave: 'sine', steps: '0.....0.2.....1.', oct: -24, len: 2.2, vol: 0.34 },
      chord: { wave: 'triangle', style: 'pluck', steps: 'x.....x.....x...', len: 5, vol: 0.075, oct: 0, lp: 1800 },
      lead: { wave: 'sine', style: 'pluck', prob: 0.3, every: 2, scale: [0, 3, 5, 7, 10], base: 69, len: 3, vol: 0.09, lp: 2600 },
      bed: { type: 'vinyl', vol: 0.025 }
    },
    {
      id: 'noir', seed: 23, bpm: 66, swing: 0.32, key: 50,
      name: { en: 'Midnight Stakeout', ru: 'Полночная слежка' }, mood: { en: 'noir jazz · slow', ru: 'нуар-джаз · медленно' },
      prog: [ch(0, M9), ch(5, DOM7), ch(-2, MAJ7), ch(-5, DOM7), ch(0, M9), ch(5, DOM7), ch(-2, MAJ7), ch(-7, DOM7)],
      drums: { kick: 'o.......o.......', snare: '', hat: 'o..oo..oo..oo..o' },
      bass: { wave: 'triangle', steps: '0...1...2...3...', oct: -24, len: 3.4, vol: 0.3 },
      chord: { wave: 'triangle', style: 'pluck', steps: '..x.......x.....', len: 4, vol: 0.06, oct: 0, lp: 1500 },
      lead: { wave: 'triangle', style: 'pluck', prob: 0.22, every: 2, scale: [0, 3, 5, 6, 7, 10], base: 62, len: 5, vol: 0.085, lp: 2200 },
      bed: { type: 'vinyl', vol: 0.02 }
    },
    {
      id: 'chip', gain: 1.35, seed: 37, bpm: 140, swing: 0, key: 52,
      name: { en: 'Chip Chase', ru: 'Погоня на чипах' }, mood: { en: 'chiptune · energetic', ru: 'чиптюн · энергично' },
      prog: [ch(0, MIN), ch(-4, MAJ), ch(3, MAJ), ch(-2, MAJ)],
      drums: { kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.' },
      bass: { wave: 'square', steps: '0.0.0.0.0.0.0.0.', oct: -24, len: 1, vol: 0.12 },
      chord: { wave: 'square', style: 'pluck', steps: '', len: 1, vol: 0.0, oct: 0 },
      lead: { wave: 'square', style: 'pluck', arp: true, prob: 0.9, every: 1, scale: [0, 3, 5, 7, 10], base: 64, len: 1.6, vol: 0.05, lp: 5000 },
      bed: null
    },
    {
      id: 'rain', seed: 41, bpm: 60, swing: 0, key: 48,
      name: { en: 'Rainy Query', ru: 'Дождливый запрос' }, mood: { en: 'ambient · calm', ru: 'эмбиент · спокойно' },
      prog: [ch(0, MAJ9), ch(-3, M9), ch(-7, MAJ9), ch(-5, SIX)],
      drums: { kick: '', snare: '', hat: '' },
      bass: { wave: 'sine', steps: '0...............', oct: -12, len: 14, vol: 0.2 },
      chord: { wave: 'sine', style: 'pad', steps: 'x...............', len: 16, vol: 0.07, oct: 12, lp: 1400, a: 1.2 },
      lead: { wave: 'sine', style: 'pluck', prob: 0.12, every: 2, scale: [0, 2, 4, 7, 9], base: 84, len: 8, vol: 0.06, lp: 4200 },
      bed: { type: 'rain', vol: 0.09 }
    },
    {
      id: 'bossa', seed: 53, bpm: 100, swing: 0.05, key: 55,
      name: { en: 'Coffee Break Bossa', ru: 'Босса-нова на перерыве' }, mood: { en: 'bossa nova · relaxed', ru: 'босса-нова · расслабленно' },
      prog: [ch(0, MAJ7), ch(2, M7), ch(7, DOM7), ch(0, MAJ7), ch(-3, M7), ch(2, DOM7), ch(-5, MAJ7), ch(-5, DOM7)],
      drums: { kick: '', snare: '..o..o...o..o...', hat: 'oxoxoxoxoxoxoxox' },
      bass: { wave: 'sine', steps: '0.....2...0...2.', oct: -24, len: 3, vol: 0.32 },
      chord: { wave: 'triangle', style: 'pluck', steps: 'x..x..x...x..x..', len: 2.2, vol: 0.06, oct: 0, lp: 2400 },
      lead: { wave: 'triangle', style: 'pluck', prob: 0.26, every: 2, scale: [0, 2, 4, 7, 9], base: 67, len: 3, vol: 0.075, lp: 3000 },
      bed: null
    },
    {
      id: 'synth', gain: 1.35, seed: 67, bpm: 92, swing: 0, key: 48,
      name: { en: 'Synth Noir', ru: 'Синтвейв-нуар' }, mood: { en: 'synthwave · moody', ru: 'синтвейв · мрачновато' },
      prog: [ch(0, MIN), ch(-4, MAJ), ch(3, MAJ), ch(-2, MAJ)],
      drums: { kick: 'x...x...x...x...', snare: '....x.......x...', hat: '..x...x...x...x.' },
      bass: { wave: 'sawtooth', steps: '0.0.0.0.0.0.0.0.', oct: -24, len: 1.2, vol: 0.13, lp: 700 },
      chord: { wave: 'sawtooth', style: 'pad', steps: 'x...............', len: 16, vol: 0.04, oct: 0, lp: 1100, a: 0.4, det: 6 },
      lead: { wave: 'sawtooth', style: 'pluck', arp: true, arpStep: 2, prob: 0.85, every: 2, scale: [0, 3, 5, 7, 10], base: 72, len: 2, vol: 0.04, lp: 2600 },
      bed: null
    },
    {
      id: 'lift', gain: 1.8, seed: 79, bpm: 112, swing: 0.12, key: 48,
      name: { en: 'Elevator to Floor 4', ru: 'Лифт на 4-й этаж' }, mood: { en: 'playful · pizzicato', ru: 'игриво · пиццикато' },
      prog: [ch(0, MAJ), ch(-3, MIN), ch(2, MIN), ch(7, DOM7)],
      drums: { kick: '', snare: '', hat: 'x.o.x.o.x.o.x.o.' },
      bass: { wave: 'triangle', steps: '0...2...0...2...', oct: -24, len: 1.6, vol: 0.28 },
      chord: { wave: 'triangle', style: 'pluck', steps: '..x...x...x...x.', len: 1.2, vol: 0.07, oct: 0, lp: 2600 },
      lead: { wave: 'triangle', style: 'pluck', prob: 0.5, every: 1, scale: [0, 2, 4, 5, 7, 9, 11], base: 72, len: 1.1, vol: 0.075, lp: 3400 },
      bed: null
    }
  ];

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function rng(a) { a = a >>> 0; return function () { a = (Math.imul(a, 1664525) + 1013904223) >>> 0; return a / 4294967296; }; }
  function hit(str, s) { var c = str ? str.charAt(s) : '.'; return c && c !== '.' && c !== ' '; }
  function amp(str, s) { var c = str.charAt(s); return c === 'o' ? 0.5 : c === 'X' ? 1.3 : 1; }
  function stepDur(T) { return 60 / T.bpm / 4; }
  function totalBars(T) { var barDur = 16 * stepDur(T); return T.prog.length * Math.max(1, Math.ceil(110 / (barDur * T.prog.length))); }
  function durationOf(T) { return totalBars(T) * 16 * stepDur(T); }

  function makeNoise(ctx) {
    var b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function tone(ctx, out, o) {
    var osc = ctx.createOscillator(); osc.type = o.wave || 'sine';
    osc.frequency.setValueAtTime(o.f, o.t); if (o.det) osc.detune.value = o.det;
    var g = ctx.createGain(), vol = o.vol || 0.1, a = o.a || 0.006, r = o.r || 0.12, dur = Math.max(o.dur, a + 0.02);
    g.gain.setValueAtTime(0.0001, o.t); g.gain.linearRampToValueAtTime(vol, o.t + a);
    var end;
    if (o.pluck) { g.gain.exponentialRampToValueAtTime(0.0001, o.t + dur); end = o.t + dur + 0.05; }
    else { var hold = Math.max(o.t + a, o.t + dur - r); g.gain.setValueAtTime(vol, hold); g.gain.exponentialRampToValueAtTime(0.0001, hold + r); end = hold + r + 0.05; }
    osc.connect(g); var last = g;
    if (o.lp) { var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; g.connect(f); last = f; }
    last.connect(out); osc.start(o.t); osc.stop(end);
  }
  function noiseHit(ctx, out, noise, t, dur, vol, type, freq, q) {
    var s = ctx.createBufferSource(); s.buffer = noise;
    var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    var g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.02);
  }
  function kick(ctx, out, t, vol) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(135, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.36);
  }

  /* One 16th-note step of a track. `when` is the audio-clock time. */
  function renderStep(ctx, out, noise, T, n, when) {
    var sd = stepDur(T), s = n % 16, bar = Math.floor(n / 16);
    var chord = T.prog[bar % T.prog.length], root = T.key + chord.r, rnd = rng(T.seed * 7919 + n * 31);
    var D = T.drums;
    if (hit(D.kick, s)) kick(ctx, out, when, 0.55 * amp(D.kick, s));
    if (hit(D.snare, s)) { noiseHit(ctx, out, noise, when, 0.14, 0.22 * amp(D.snare, s), 'bandpass', T.id === 'chip' ? 3000 : 1800, 0.8); tone(ctx, out, { f: 190, t: when, dur: 0.08, wave: 'triangle', vol: 0.12, pluck: true }); }
    if (hit(D.hat, s)) noiseHit(ctx, out, noise, when, 0.045, 0.1 * amp(D.hat, s), 'highpass', 7500);
    var B = T.bass;
    if (B && hit(B.steps, s)) {
      var idx = parseInt(B.steps.charAt(s), 10) % chord.n.length;
      tone(ctx, out, { f: mtof(root + chord.n[idx] + B.oct), t: when, dur: B.len * sd, wave: B.wave, vol: B.vol, a: 0.01, r: 0.1, lp: B.lp || 600 });
    }
    var C = T.chord;
    if (C && C.vol > 0 && hit(C.steps, s)) {
      chord.n.forEach(function (semi, i) {
        tone(ctx, out, { f: mtof(root + semi + (C.oct || 0)), t: when + i * 0.012, dur: C.len * sd, wave: C.wave, vol: C.vol, a: C.a || 0.006, r: 0.35, pluck: C.style === 'pluck', lp: C.lp, det: C.det ? (i % 2 ? C.det : -C.det) : 0 });
        if (C.det) tone(ctx, out, { f: mtof(root + semi + (C.oct || 0)), t: when, dur: C.len * sd, wave: C.wave, vol: C.vol * 0.7, a: C.a || 0.006, r: 0.35, pluck: false, lp: C.lp, det: 0 });
      });
    }
    var L = T.lead;
    if (L && s % L.every === 0 && rnd() < L.prob) {
      var note;
      if (L.arp) { var st = L.arpStep || 1, k = Math.floor(s / st) + bar; var arr = chord.n.concat(chord.n.map(function (x) { return x + 12; })); note = root + 12 + arr[k % arr.length]; if (L.base > 60 && T.id === 'synth') note = root + 24 + arr[k % arr.length]; }
      else { var prevBase = L.scale[Math.floor(rnd() * L.scale.length)]; note = L.base + prevBase + (rnd() < 0.25 ? 12 : 0) + (chord.r * 0); }
      tone(ctx, out, { f: mtof(note), t: when, dur: L.len * sd, wave: L.wave, vol: L.vol, a: 0.004, r: 0.1, pluck: L.style === 'pluck', lp: L.lp });
    }
  }

  function startBed(ctx, out, noise, T) {
    if (!T.bed) return null;
    var s = ctx.createBufferSource(); s.buffer = noise; s.loop = true;
    var f = ctx.createBiquadFilter(), g = ctx.createGain();
    if (T.bed.type === 'rain') { f.type = 'bandpass'; f.frequency.value = 4200; f.Q.value = 0.5; }
    else { f.type = 'highpass'; f.frequency.value = 2500; }
    g.gain.value = T.bed.vol; s.connect(f); f.connect(g); g.connect(out); s.start(0);
    return s;
  }

  /* ------------------------------------------------------------ player engine */
  var Music = {
    tracks: TRACKS, idx: -1, playing: false, volume: 0.6, shuffle: false, repeat: false,
    ctx: null, master: null, analyser: null, trackGain: null, bed: null, timer: null, t0: 0, n: 0, total: 0, listeners: [],
    onChange: function (fn) { this.listeners.push(fn); },
    _emit: function () { var self = this; this.listeners.forEach(function (f) { try { f(self); } catch (e) { /* ignore */ } }); },
    _ensure: function () {
      if (this.ctx) return;
      var AC = root.AudioContext || root.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = this.volume;
      var comp = this.ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      this.analyser = this.ctx.createAnalyser(); this.analyser.fftSize = 128; this.analyser.smoothingTimeConstant = 0.78;
      this.master.connect(comp); comp.connect(this.analyser); this.analyser.connect(this.ctx.destination);
      this.noise = makeNoise(this.ctx);
    },
    setVolume: function (v) { this.volume = v; if (this.master) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02); },
    play: function (i) {
      this._ensure();
      this._stopVoices();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      var T = TRACKS[i]; this.idx = i; this.playing = true;
      this.trackGain = this.ctx.createGain(); this.trackGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.trackGain.gain.linearRampToValueAtTime(T.gain || 1, this.ctx.currentTime + 0.4);
      this.trackGain.connect(this.master);
      this.bed = startBed(this.ctx, this.trackGain, this.noise, T);
      this.t0 = this.ctx.currentTime + 0.12; this.n = 0; this.total = totalBars(T) * 16;
      var self = this;
      this.timer = setInterval(function () { self._tick(); }, 70);
      this._emit();
    },
    _tick: function () {
      var T = TRACKS[this.idx], sd = stepDur(T), ctx = this.ctx;
      while (this.n < this.total) {
        var when = this.t0 + this.n * sd + ((this.n % 2) ? T.swing * sd : 0);
        if (when > ctx.currentTime + 0.4) break;
        renderStep(ctx, this.trackGain, this.noise, T, this.n, when);
        this.n++;
      }
      if (this.n >= this.total && ctx.currentTime >= this.t0 + this.total * sd) this.next(true);
    },
    _stopVoices: function () {
      clearInterval(this.timer); this.timer = null;
      var ctx = this.ctx;
      if (this.trackGain) { var g = this.trackGain; try { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05); } catch (e) { /* */ } var bed = this.bed; setTimeout(function () { try { g.disconnect(); if (bed) bed.stop(); } catch (e) { /* */ } }, 600); }
      this.trackGain = null; this.bed = null;
    },
    pause: function () { if (!this.ctx || !this.playing) return; this.ctx.suspend(); this.playing = false; this._emit(); },
    resume: function () { if (!this.ctx) return; this.ctx.resume(); this.playing = true; this._emit(); },
    toggle: function () { if (this.idx < 0) this.play(0); else if (this.playing) this.pause(); else this.resume(); },
    stop: function () { if (!this.ctx) return; this._stopVoices(); this.playing = false; this.idx = -1; if (this.ctx.state === 'suspended') this.ctx.resume(); this._emit(); },
    next: function (auto) {
      var n = TRACKS.length, i;
      if (auto && this.repeat) i = this.idx;
      else if (this.shuffle && n > 1) { do { i = Math.floor(Math.random() * n); } while (i === this.idx); }
      else i = (this.idx + 1) % n;
      this.play(i);
    },
    prev: function () { if (this.elapsed() > 4) this.play(this.idx); else this.play((this.idx - 1 + TRACKS.length) % TRACKS.length); },
    elapsed: function () { return this.ctx && this.idx >= 0 ? Math.max(0, this.ctx.currentTime - this.t0) : 0; },
    duration: function (i) { return durationOf(TRACKS[i == null ? this.idx : i]); },
    /* Offline render for tests: returns a Promise<AudioBuffer> */
    renderOffline: function (i, seconds, sr) {
      var T = TRACKS[i], rate = sr || 22050, OAC = root.OfflineAudioContext || root.webkitOfflineAudioContext;
      var ctx = new OAC(1, Math.floor(seconds * rate), rate), noise = makeNoise(ctx);
      var out = ctx.createGain(); var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
      out.gain.value = 0.6 * (T.gain || 1); out.connect(comp); comp.connect(ctx.destination);
      startBed(ctx, out, noise, T);
      var sd = stepDur(T);
      for (var n = 0; n * sd < seconds; n++) renderStep(ctx, out, noise, T, n, n * sd + ((n % 2) ? T.swing * sd : 0));
      return ctx.startRendering();
    }
  };

  root.SQLD_MUSIC = Music;
})(typeof window !== 'undefined' ? window : globalThis);
