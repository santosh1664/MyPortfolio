import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Opening screen: Santosh's portrait rebuilt from ~7,000 blue particles (the photo itself is never shipped).
// Particles assemble on load, push away from the cursor, and scatter + fade as you scroll into the site.
const BUCKETS = 10;
const color = (a) => `rgb(${Math.round(16 + (125 - 16) * a)},${Math.round(20 + (150 - 20) * a)},${Math.round(40 + (255 - 40) * a)})`;

const IntroPortrait = () => {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const progress = useRef(0);
  const mouse = useRef({ x: -9999, y: -9999 });
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -60]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => scrollYProgress.on('change', (v) => { progress.current = v; }), [scrollYProgress]);

  useEffect(() => {
    let raf = 0; let alive = true; let visible = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let size = 0; let dpr = 1; let parts = []; let start = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = r.width;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
    };

    const draw = (t) => {
      if (!alive) return;
      const p = progress.current;
      if (visible && p < 0.98) {
        const s = size / 1000;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);
        const assemble = reduce ? 1 : Math.min(1, (t - start) / 1600);
        const scatter = reduce ? 0 : Math.pow(p, 1.3);
        const fade = Math.max(0, 1 - p * 1.1);
        const mx = mouse.current.x; const my = mouse.current.y;
        for (let b = 0; b < BUCKETS; b += 1) {
          ctx.fillStyle = color(b / (BUCKETS - 1));
          ctx.globalAlpha = fade * (0.82 + 0.18 * Math.sin(t / 900 + b));
          ctx.beginPath();
          const list = parts[b];
          for (let i = 0; i < list.length; i += 1) {
            const d = list[i];
            const k = Math.min(1, Math.max(0, (assemble - d.delay) / (1 - d.delay)));
            const e = 1 - Math.pow(1 - k, 3);
            let x = (d.sx + (d.x - d.sx) * e) * s;
            let y = (d.sy + (d.y - d.sy) * e) * s;
            x += d.vx * scatter * 900 * s;
            y += (d.vy * scatter * 900 - scatter * 380) * s;
            const dx = x - mx; const dy = y - my; const dist2 = dx * dx + dy * dy;
            if (!reduce && dist2 < 5200) { const f = (1 - dist2 / 5200) * 16; const dd = Math.sqrt(dist2) || 1; x += (dx / dd) * f; y += (dy / dd) * f; }
            const r = Math.max(0.55, d.r * s * (1 - scatter * 0.4));
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(draw);
    };

    import('../assets/portrait-dots.json').then((mod) => {
      if (!alive) return;
      const data = mod.default || mod;
      parts = Array.from({ length: BUCKETS }, () => []);
      data.dots.forEach(([x, y, r, a]) => {
        const ang = Math.random() * Math.PI * 2; const sp = 0.25 + Math.random() * 0.75;
        parts[Math.min(BUCKETS - 1, Math.floor(a * BUCKETS))].push({
          x, y, r, sx: 500 + (Math.random() - 0.5) * 1400, sy: 500 + (Math.random() - 0.5) * 1400,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, delay: Math.random() * 0.45,
        });
      });
      resize();
      start = performance.now();
      setReady(true);
      raf = requestAnimationFrame(draw);
    });

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize); };
  }, [reduce]);

  const onMove = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <section ref={wrapRef} id="intro" className="relative h-[180vh]" aria-label="Introduction">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-5 pt-16 sm:px-8 lg:grid-cols-[1fr_1.05fr]">
          <Motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 order-2 lg:order-1">
            <div className="font-mono text-[13px] text-blue">hello, world —</div>
            <p className="mt-3 font-display text-[3.4rem] font-extrabold leading-[0.92] tracking-tightest sm:text-[5.5rem]">
              I'm Santosh<span className="text-blue">.</span>
            </p>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-mute">
              Software Engineer building AI agents and the full-stack systems they run on. Dallas, TX · open to roles worldwide.
            </p>
          </Motion.div>

          <div className="relative order-1 mx-auto aspect-square w-[min(78vw,560px)] lg:order-2" onMouseMove={onMove} onMouseLeave={() => { mouse.current = { x: -9999, y: -9999 }; }}>
            <Motion.div style={{ opacity: glowOpacity }} className="pointer-events-none absolute inset-[12%] rounded-full bg-blue/25 blur-[90px]" />
            <canvas ref={canvasRef} className={`relative h-full w-full [mask-image:linear-gradient(to_bottom,black_72%,transparent)] transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
                    role="img" aria-label="Portrait of Durgasantosh G drawn in blue particles" />
          </div>
        </div>

        <Motion.div style={{ opacity: cueOpacity }} className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="label">scroll to explore</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-blue to-transparent" />
        </Motion.div>
      </div>
    </section>
  );
};

export default IntroPortrait;
