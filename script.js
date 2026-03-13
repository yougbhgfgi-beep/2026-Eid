/* ══════════════════════════
       CURSOR
    ══════════════════════════ */
    const cur = document.getElementById('cur');
    const cHalo = document.getElementById('cur-halo');
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      cHalo.style.left = mx + 'px'; cHalo.style.top = my + 'px';
    });
    document.addEventListener('touchmove', e => {
      const t = e.touches[0]; mx = t.clientX; my = t.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      spawnGold(mx, my);
    }, { passive: true });
    document.addEventListener('click', e => spawnGold(e.clientX, e.clientY));

    /* ══════════════════════════
       SKY CANVAS — Night sky with crescent
    ══════════════════════════ */
    const skyC = document.getElementById('skyC');
    const skyX = skyC.getContext('2d');
    function rSky() { skyC.width = innerWidth; skyC.height = innerHeight; }
    rSky(); window.addEventListener('resize', rSky);
    let skyT = 0;
    (function sky() {
      skyX.clearRect(0, 0, skyC.width, skyC.height);
      skyT += 0.003;
      const w = skyC.width, h = skyC.height;
      // deep night gradient
      const gr = skyX.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#04060f');
      gr.addColorStop(0.4, '#070c1e');
      gr.addColorStop(1, '#0a1520');
      skyX.fillStyle = gr; skyX.fillRect(0, 0, w, h);
      // aurora-like glow blobs
      [
        [w * .2 + Math.sin(skyT) * w * .05, h * .25, w * .35, 'rgba(200,146,42,0.04)'],
        [w * .8 + Math.cos(skyT * .8) * w * .04, h * .4, w * .3, 'rgba(26,107,74,0.035)'],
        [w * .5 + Math.sin(skyT * 1.2) * w * .06, h * .6, w * .4, 'rgba(14,21,53,0.3)'],
      ].forEach(([x, y, r, c]) => {
        const g = skyX.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c); g.addColorStop(1, 'transparent');
        skyX.fillStyle = g; skyX.fillRect(0, 0, w, h);
      });
      requestAnimationFrame(sky);
    })();

    /* ══════════════════════════
       PARTICLE CANVAS — Gold dust + stars
    ══════════════════════════ */
    const partC = document.getElementById('partC');
    const partX = partC.getContext('2d');
    function rPart() { partC.width = innerWidth; partC.height = innerHeight; }
    rPart(); window.addEventListener('resize', rPart);
    let parts = [];

    class Particle {
      constructor(x, y, isClick) {
        this.x = x || (Math.random() * partC.width);
        this.y = y || partC.height + 10;
        this.click = isClick || false;
        this.vx = (Math.random() - .5) * (isClick ? 6 : 1.2);
        this.vy = isClick ? -(Math.random() * 5 + 2) : -(Math.random() * 1.5 + .5);
        this.s = isClick ? (4 + Math.random() * 10) : (3 + Math.random() * 8);
        this.life = 1;
        this.d = isClick ? .022 : (.003 + Math.random() * .004);
        this.rot = Math.random() * Math.PI * 2;
        this.rs = (Math.random() - .5) * .06;
        // Gold and emerald palette
        const r = Math.random();
        this.col = r < .5 ? '#c8922a' : r < .7 ? '#e8b84b' : r < .85 ? '#f5d07a' : '#c0e0b0';
        this.type = Math.random() < .4 ? 'star' : Math.random() < .6 ? 'crescent' : 'dot';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += .035; this.vx *= .99;
        this.rot += this.rs; this.life -= this.d;
      }
      draw() {
        partX.save(); partX.globalAlpha = this.life * .8;
        partX.translate(this.x, this.y); partX.rotate(this.rot);
        partX.fillStyle = this.col;
        if (this.type === 'star') {
          const r = this.s * .5;
          partX.beginPath();
          for (let i = 0; i < 5; i++) {
            const a = i * Math.PI * 2 / 5 - Math.PI / 2;
            partX.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            const b = a + Math.PI / 5;
            partX.lineTo(Math.cos(b) * r * .38, Math.sin(b) * r * .38);
          }
          partX.closePath(); partX.fill();
        } else if (this.type === 'crescent') {
          const r = this.s * .5;
          partX.beginPath(); partX.arc(0, 0, r, 0, Math.PI * 2); partX.fill();
          partX.fillStyle = 'rgba(4,6,15,0.8)';
          partX.beginPath(); partX.arc(r * .4, 0, r * .72, 0, Math.PI * 2); partX.fill();
        } else {
          partX.beginPath(); partX.arc(0, 0, this.s * .4, 0, Math.PI * 2); partX.fill();
        }
        partX.restore();
      }
    }

    function spawnGold(x, y) { for (let i = 0; i < 10; i++) parts.push(new Particle(x, y, true)); }

    (function animPart() {
      partX.clearRect(0, 0, partC.width, partC.height);
      if (Math.random() < .3) parts.push(new Particle());
      parts = parts.filter(p => p.life > 0);
      parts.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animPart);
    })();

    /* ══════════════════════════
       LOGIN
    ══════════════════════════ */
    function login() {
      const v = document.getElementById('pwIn').value;
      const err = document.getElementById('lpErr');
      if (v === '1') {
        const lp = document.getElementById('loginPage');
        lp.style.transition = 'opacity 1.3s ease'; lp.style.opacity = '0';
        setTimeout(() => {
          lp.style.display = 'none';
          const m = document.getElementById('main'); m.style.display = 'block';
          document.getElementById('nav').style.display = 'flex';
          init();
        }, 1300);
      } else {
        err.style.display = 'block';
        err.style.animation = 'none';
        setTimeout(() => err.style.animation = 'errSh 0.5s', 10);
      }
    }
    document.getElementById('pwIn').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

    /* ══════════════════════════
       SECTIONS & NAV
    ══════════════════════════ */
    const SECS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11'];
    function go(i) { document.getElementById(SECS[i])?.scrollIntoView({ behavior: 'smooth' }); }

    /* ══════════════════════════
       INIT
    ══════════════════════════ */
    function init() {
      counter();
      initQuiz();
      initReveals();
      initStarCanvas();
      initNavWatch();
    }

    /* ══════════════════════════
       COUNTER
    ══════════════════════════ */
    const START = new Date("June 30, 2025 00:00:00").getTime();
    function counter() {
      function upd() {
        let diff = Math.max(0, Date.now() - START);
        const days = Math.floor(diff / 864e5); diff -= days * 864e5;
        const hrs = Math.floor(diff / 36e5); diff -= hrs * 36e5;
        const min = Math.floor(diff / 6e4); diff -= min * 6e4;
        const sec = Math.floor(diff / 1e3);
        document.getElementById('cd').textContent = String(days).padStart(2, '0');
        document.getElementById('ch').textContent = String(hrs).padStart(2, '0');
        document.getElementById('cm').textContent = String(min).padStart(2, '0');
        document.getElementById('cs').textContent = String(sec).padStart(2, '0');
        document.getElementById('totalMsg').textContent = `🌙 ${days} يوم من الحب الحقيقي 🌙`;
      }
      upd(); setInterval(upd, 1000);
    }

    /* ══════════════════════════
       REVEALS
    ══════════════════════════ */
    function initReveals() {
      const els = document.querySelectorAll('.fu,.tl-item');
      const m = document.getElementById('main');
      const chk = () => els.forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight * .88) el.classList.add('in');
      });
      m.addEventListener('scroll', chk); chk();
    }

    /* ══════════════════════════
       NAV WATCH
    ══════════════════════════ */
    function initNavWatch() {
      const m = document.getElementById('main');
      const dots = document.querySelectorAll('.nd');
      m.addEventListener('scroll', () => {
        SECS.forEach((id, i) => {
          const el = document.getElementById(id); if (!el) return;
          const t = el.getBoundingClientRect().top;
          if (t <= 100 && t > -innerHeight + 100) { dots.forEach(d => d.classList.remove('a')); dots[i]?.classList.add('a'); }
        });
      });
    }

    /* ══════════════════════════
       QUIZ
    ══════════════════════════ */
    const QS = [
      { q: 'ما هو أحب الأوقات إليك في العيد؟', opts: ['صلاة الفجر', 'العيدية 😄', 'التجمع مع الأهل', 'الحلويات'], ans: 2 },
      { q: 'ما معنى وجودي في حياتك؟', opts: ['سعادة', 'راحة', 'كل شيء', 'أ وب وج'], ans: 3 },
      { q: 'لو كان لك أمنية واحدة هذا العيد، ماذا تتمنى؟', opts: ['المال', 'الصحة', 'أن تكون معي دائماً', 'السفر'], ans: 2 },
    ];
    let qi = 0, qs = 0;
    function initQuiz() { renderQ(); }
    function renderQ() {
      if (qi >= QS.length) {
        document.getElementById('qQ').textContent = 'انتهت المسابقة 🌙';
        document.getElementById('qOp').innerHTML = '';
        const m = ['تحتاج أن تعرفني أكثر 😊', 'قريب جداً! 💛', 'أنت تعرفني تماماً — هذا هو الحب 🌙'];
        document.getElementById('qFb').textContent = m[Math.min(qs, 2)];
        setTimeout(() => go(6), 2000); return;
      }
      const d = QS[qi];
      document.getElementById('qQ').textContent = d.q;
      const op = document.getElementById('qOp'); op.innerHTML = '';
      d.opts.forEach((o, i) => {
        const b = document.createElement('button'); b.className = 'quiz-o'; b.textContent = o;
        b.onclick = () => {
          document.querySelectorAll('.quiz-o').forEach(x => x.onclick = null);
          if (i === d.ans) { b.classList.add('correct'); qs++; document.getElementById('qSc').textContent = qs; document.getElementById('qFb').textContent = '✦ إجابة رائعة 🌙'; spawnGold(innerWidth / 2, innerHeight * .6); }
          else { b.classList.add('wrong'); document.querySelectorAll('.quiz-o')[d.ans].classList.add('correct'); document.getElementById('qFb').textContent = 'الإجابة الصحيحة باللون الأخضر'; }
          qi++; setTimeout(renderQ, 1800);
        };
        op.appendChild(b);
      });
      document.getElementById('qFb').textContent = '';
    }

    /* ══════════════════════════
       LOVE METER
    ══════════════════════════ */
    const LM = [
      'قلبان في طريق التلاقي — الله يجمع بينكما 🌱',
      'بداية طيبة — والأيام تحمل الكثير 🌙',
      'توافق واضح — بارك الله فيكما 💛',
      'حب حقيقي يزداد مع الأيام 🌹',
      'تناغم نادر — هذا هو الحب الذي يُكتب في السماء 🌌',
      'لا يفرق بينكما شيء — قُدّرتما لبعض من الأزل ✨',
    ];
    function calcLove() {
      const n1 = document.getElementById('mn1').value || 'أنا';
      const n2 = document.getElementById('mn2').value || 'حبيبي';
      let h = 0; for (const c of (n1 + n2)) h += c.charCodeAt(0);
      const p = 60 + (h % 38);
      const r = document.getElementById('mRes'); r.style.display = 'block';
      document.getElementById('mPct').textContent = p + '%';
      setTimeout(() => document.getElementById('mBar').style.width = p + '%', 100);
      document.getElementById('mMsg').textContent = LM[Math.min(Math.floor(p / 16.7), 5)];
      for (let i = 0; i < 25; i++) setTimeout(() => spawnGold(Math.random() * innerWidth, Math.random() * innerHeight * .5), i * 70);
      toast(`${n1} 🌙 ${n2} = ${p}% حب 💛`);
    }

    /* ══════════════════════════
       FIREWORKS
    ══════════════════════════ */
    let fwC, fwX, fwP = [], fwOn = false;
    function shootFireworks() {
      fwC = document.getElementById('fwC');
      fwC.width = fwC.offsetWidth || innerWidth; fwC.height = fwC.offsetHeight || innerHeight;
      fwX = fwC.getContext('2d'); fwOn = true;
      const cols = ['#c8922a', '#e8b84b', '#f5d07a', '#ffffff', '#c0e0b0', '#a0d0b0'];
      let n = 0;
      const iv = setInterval(() => {
        if (n >= 10) { clearInterval(iv); setTimeout(() => { fwOn = false; }, 3000); return; }
        const x = 80 + Math.random() * (fwC.width - 160);
        const y = 60 + Math.random() * (fwC.height * .55);
        const c = cols[Math.floor(Math.random() * cols.length)];
        for (let i = 0; i < 65; i++) fwP.push({ x, y, vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, c, l: 1, s: 2 + Math.random() * 3, d: .015 + Math.random() * .01 });
        n++;
      }, 380);
      (function aFw() {
        if (!fwOn && !fwP.length) return;
        fwX.clearRect(0, 0, fwC.width, fwC.height);
        fwP = fwP.filter(p => p.l > 0);
        fwP.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += .04; p.vx *= .98; p.l -= p.d;
          fwX.save(); fwX.globalAlpha = p.l; fwX.fillStyle = p.c;
          fwX.beginPath(); fwX.arc(p.x, p.y, p.s * p.l, 0, Math.PI * 2); fwX.fill(); fwX.restore();
        });
        requestAnimationFrame(aFw);
      })();
      toast('كل عام وأنتما بخير 🌙✨');
    }

    /* ══════════════════════════
       FANOOS / GIFT
    ══════════════════════════ */
    let fOpen = false;
    function openFanoos() {
      if (fOpen) return; fOpen = true;
      document.getElementById('fanoos').classList.add('opened');
      setTimeout(() => document.getElementById('giftOverlay').classList.add('show'), 700);
      for (let i = 0; i < 30; i++) setTimeout(() => spawnGold(Math.random() * innerWidth, Math.random() * innerHeight * .6), i * 60);
    }
    function closeGift() {
      fOpen = false;
      document.getElementById('fanoos').classList.remove('opened');
      document.getElementById('giftOverlay').classList.remove('show');
    }

    /* ══════════════════════════
       STAR CANVAS — crescent stars
    ══════════════════════════ */
    function initStarCanvas() {
      const sc = document.getElementById('sCvs');
      sc.width = sc.offsetWidth || innerWidth; sc.height = sc.offsetHeight || innerHeight;
      const sx = sc.getContext('2d');
      const stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * sc.width, y: Math.random() * sc.height,
        r: .3 + Math.random() * 1.8, t: Math.random() * Math.PI * 2,
        sp: .008 + Math.random() * .02,
        col: Math.random() < .6 ? '255,255,255' : Math.random() < .5 ? '200,146,42' : '192,224,176',
      }));
      const shots = [];
      setInterval(() => shots.push({
        x: Math.random() * sc.width * .7, y: Math.random() * sc.height * .35,
        vx: 3 + Math.random() * 5, vy: .5 + Math.random() * 1.5, l: 1
      }), 2200);
      // crescent moon
      const moonX = sc.width * .25, moonY = sc.height * .2;
      (function dStar() {
        sx.clearRect(0, 0, sc.width, sc.height);
        // stars
        stars.forEach(s => {
          s.t += s.sp;
          const a = (.25 + Math.sin(s.t) * .75) * .85;
          sx.save(); sx.globalAlpha = a; sx.fillStyle = `rgb(${s.col})`;
          sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, Math.PI * 2); sx.fill(); sx.restore();
        });
        // big crescent
        sx.save(); sx.globalAlpha = .12;
        sx.fillStyle = '#c8922a';
        sx.beginPath(); sx.arc(moonX, moonY, 55, 0, Math.PI * 2); sx.fill();
        sx.fillStyle = 'rgba(4,6,15,0.95)';
        sx.beginPath(); sx.arc(moonX + 22, moonY, 44, 0, Math.PI * 2); sx.fill();
        sx.restore();
        // shooting stars
        for (let i = shots.length - 1; i >= 0; i--) {
          const s = shots[i];
          sx.save(); sx.globalAlpha = s.l * .7;
          const g = sx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
          g.addColorStop(0, 'rgba(200,146,42,0.9)'); g.addColorStop(1, 'transparent');
          sx.strokeStyle = g; sx.lineWidth = 1.5;
          sx.beginPath(); sx.moveTo(s.x, s.y); sx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10); sx.stroke(); sx.restore();
          s.x += s.vx; s.y += s.vy; s.l -= .022;
          if (s.l <= 0 || s.x > sc.width) shots.splice(i, 1);
        }
        requestAnimationFrame(dStar);
      })();
    }

    /* ══════════════════════════
       CELEBRATE FINAL
    ══════════════════════════ */
    function celebrate() {
      for (let i = 0; i < 8; i++) setTimeout(() => {
        for (let j = 0; j < 12; j++) spawnGold(Math.random() * innerWidth, Math.random() * innerHeight);
      }, i * 180);
      toast('🌙 كل عام وأنتما بخير — عيد مبارك 💛');
      setTimeout(() => go(0), 2500);
    }

    /* ══════════════════════════
       FINGERPRINT SCANNER
    ══════════════════════════ */
    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) {
        lucide.createIcons();
      }

      const fpPage = document.getElementById('fingerprint-page');
      const fpScanner = document.getElementById('fp-scanner');
      const fpMsg = document.getElementById('fp-msg');
      let scanTimeout;

      if (fpScanner && fpPage) {
        const startScan = (e) => {
          if (e.type === 'touchstart') e.preventDefault();
          fpScanner.classList.add('scanning');
          fpMsg.style.opacity = '1';
          fpMsg.textContent = 'جاري التحقق...';

          scanTimeout = setTimeout(() => {
            fpMsg.textContent = 'تم الدخول لقلبي 💛';
            setTimeout(() => {
              fpPage.style.opacity = '0';
              fpPage.style.transform = 'scale(1.1)';
              setTimeout(() => {
                fpPage.style.display = 'none';
              }, 1000);
            }, 800);
          }, 2500);
        };

        const stopScan = () => {
          clearTimeout(scanTimeout);
          fpScanner.classList.remove('scanning');
          fpMsg.style.opacity = '0';
          setTimeout(() => {
            if (!fpScanner.classList.contains('scanning')) fpMsg.textContent = 'اضغط مطولاً للدخول...';
          }, 500);
        };

        fpScanner.addEventListener('mousedown', startScan);
        fpScanner.addEventListener('mouseup', stopScan);
        fpScanner.addEventListener('mouseleave', stopScan);
        fpScanner.addEventListener('touchstart', startScan, { passive: false });
        fpScanner.addEventListener('touchend', stopScan);
      }
    });

    /* ══════════════════════════
       STATE / SETUP
    ══════════════════════════ */
    let PW = '';
    let tTO;
    function toast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg; t.classList.add('on');
      clearTimeout(tTO); tTO = setTimeout(() => t.classList.remove('on'), 3300);
    }

    /* ══════════════════════════
       KEYBOARD & SWIPE
    ══════════════════════════ */
    document.addEventListener('keydown', e => {
      if (document.getElementById('main').style.display !== 'block') return;
      const m = document.getElementById('main');
      if (e.key === 'ArrowDown') m.scrollTop += innerHeight;
      if (e.key === 'ArrowUp') m.scrollTop -= innerHeight;
    });
    let ty = 0;
    document.addEventListener('touchstart', e => ty = e.touches[0].clientY, { passive: true });
    document.addEventListener('touchend', e => {
      const d = ty - e.changedTouches[0].clientY;
      if (Math.abs(d) > 60) { const m = document.getElementById('main'); m.scrollTop += d > 0 ? innerHeight : -innerHeight; }
    }, { passive: true });