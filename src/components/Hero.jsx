import React, { useState } from 'react';
import { motion as Motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { FaArrowRight, FaDownload, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { personalInfo, socialLinks } from '../data/portfolioData.jsx';
import { askSantosh } from '../assistant/events.js';

const icons = { FaGithub, FaLinkedin, FaEnvelope };

// Drop a transparent-background photo at public/profile.png to replace the monogram.
const PHOTO = '/profile.png';

const fade = (d) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } });

const Portrait = () => {
  const [ok, setOk] = useState(true);
  if (ok) {
    return (
      <img src={PHOTO} alt={`Portrait of ${personalInfo.name}`} onError={() => setOk(false)}
           className="relative z-10 h-full w-full object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
    );
  }
  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      <div className="relative">
        <span className="font-display text-[11rem] sm:text-[15rem] font-bold leading-none tracking-tightest text-transparent [-webkit-text-stroke:1.5px_rgba(244,241,234,0.35)]">DG</span>
        <span className="absolute bottom-6 right-0 h-5 w-5 rounded-full bg-accent shadow-[0_0_40px_10px_rgba(255,45,85,0.45)]" />
      </div>
    </div>
  );
};

const AskBar = () => {
  const [q, setQ] = useState('');
  const chips = ['What is he working on now?', 'Does he know Kubernetes?', 'Is he available?'];
  return (
    <Motion.div {...fade(0.65)} className="mt-10 max-w-xl">
      <form onSubmit={(e) => { e.preventDefault(); askSantosh(q || 'Give me a 30-second intro'); setQ(''); }}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2 pl-4 backdrop-blur transition focus-within:border-accent/70 hover:border-white/20">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask my AI assistant"
               placeholder="Ask my AI assistant anything about me…"
               className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-bone placeholder:text-mute focus:outline-none" />
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Ask</button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <button key={c} onClick={() => askSantosh(c)} className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-mute transition hover:border-accent hover:text-bone">{c}</button>
        ))}
        <button onClick={() => askSantosh('', 'fit')} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[12px] text-bone transition hover:bg-accent/20">Recruiter? Check job fit →</button>
      </div>
    </Motion.div>
  );
};

const Hero = () => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 18]);
  const scale = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 0.9]);
  const opacity = useTransform(scrollY, [0, 650], [1, 0.15]);

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div style={{ perspective: 1400 }} className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Motion.div style={{ rotateX, scale, opacity, transformOrigin: 'center top' }}
                    className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <Motion.div {...fade(0.1)} className="eyebrow mb-6 flex flex-wrap items-center gap-3">
              <span className="h-[2px] w-6 bg-accent" />
              <span>Software Engineer</span><span className="text-white/20">·</span>
              <span>AI Agents &amp; Full-Stack</span><span className="text-white/20">·</span>
              <span>Dallas, TX</span>
            </Motion.div>

            <Motion.h1 {...fade(0.2)} className="font-display font-bold uppercase leading-[0.86] tracking-tightest text-bone text-[3.4rem] sm:text-[5.5rem] lg:text-[7.2rem]">
              Durga<br />santosh<span className="text-accent">.</span>
            </Motion.h1>

            <Motion.p {...fade(0.35)} className="mt-6 font-display text-2xl sm:text-3xl font-medium text-bone">
              Building intelligent systems.
              <span className="block font-serif italic font-normal text-bone/70">Engineering what's next.</span>
            </Motion.p>

            <Motion.p {...fade(0.45)} className="mt-6 max-w-xl text-[15px] leading-relaxed text-mute">
              {personalInfo.bio}
            </Motion.p>

            <Motion.div {...fade(0.55)} className="mt-9 flex flex-wrap items-center gap-4">
              <ScrollLink to="projects" href="#projects" smooth duration={700} offset={-64} className="btn-primary cursor-pointer">
                Explore my work <FaArrowRight />
              </ScrollLink>
              <a href={personalInfo.resumeLink} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <FaDownload /> Download CV
              </a>
              <div className="ml-1 flex items-center gap-4">
                {Object.entries(socialLinks).map(([k, l]) => {
                  const I = icons[l.iconName];
                  return (
                    <a key={k} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={k} className="text-mute transition hover:text-accent">
                      {I && <I size={20} />}
                    </a>
                  );
                })}
              </div>
            </Motion.div>
            <AskBar />
          </div>

          <Motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
                      className="relative hidden h-[560px] lg:block">
            <div className="absolute inset-x-8 bottom-0 top-16 rounded-[2rem] border border-line bg-gradient-to-b from-panel2 to-ink" />
            <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-[100px]" />
            <Portrait />
            <div className="absolute bottom-8 left-0 z-20 card px-4 py-3">
              <div className="eyebrow !text-[10px]">Currently</div>
              <div className="mt-1 font-display text-sm text-bone">Software Engineer · Citigroup</div>
            </div>
            <div className="absolute right-0 top-24 z-20 card px-4 py-3">
              <div className="eyebrow !text-[10px]">Building</div>
              <div className="mt-1 font-display text-sm text-bone">rejekt.ai · live</div>
            </div>
          </Motion.div>
        </Motion.div>
      </div>

      <ScrollLink to="about" href="#about" smooth duration={700} offset={-64}
                  className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 cursor-pointer eyebrow hidden sm:flex flex-col items-center gap-2">
        Scroll <span className="h-10 w-px animate-pulse bg-gradient-to-b from-accent to-transparent" />
      </ScrollLink>
    </section>
  );
};

export default Hero;
