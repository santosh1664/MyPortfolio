import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { FaArrowRight, FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { personalInfo, socialLinks, heroStats } from '../data/portfolioData.jsx';
import { askSantosh } from '../assistant/events.js';
import AgentGraph from './AgentGraph.jsx';

const icons = { FaGithub, FaLinkedin, FaEnvelope };
const up = (d) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] } });

const AskBar = () => {
  const [q, setQ] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); askSantosh(q || 'Give me a 30-second intro'); setQ(''); }}
          className="flex items-center gap-2 rounded-full border border-ink/15 bg-card p-1.5 pl-5 shadow-[0_12px_40px_-20px_rgba(76,107,255,0.45)] transition focus-within:border-blue">
      <span className="font-mono text-[13px] text-blue">ask&gt;</span>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask my AI assistant"
             placeholder="anything about me — skills, projects, availability…"
             className="min-w-0 flex-1 bg-transparent py-2 text-[14.5px] placeholder:text-mute/80 focus:outline-none" />
      <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue text-white transition hover:bg-white hover:text-black" aria-label="Ask"><FaArrowRight size={13} /></button>
    </form>
  );
};

const Hero = () => (
  <section id="hero" className="relative overflow-hidden pt-28 sm:pt-32">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <Motion.div {...up(0.05)} className="mb-7 inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[13px] text-mint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> Open to Software Engineer roles · Dallas, TX
        </Motion.div>
        <Motion.p {...up(0.1)} className="font-mono text-[13px] text-mute">Durgasantosh G — Software Engineer</Motion.p>
        <Motion.h1 {...up(0.18)} className="mt-3 font-display text-[2.9rem] font-extrabold leading-[0.95] tracking-tightest sm:text-[4.4rem] lg:text-[5rem]">
          I build AI agents{' '}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">banks can trust</span>
            <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden>
              <path d="M2 9 C 80 2, 220 2, 298 7" fill="none" stroke="#4C6BFF" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-blue">.</span>
        </Motion.h1>
        <Motion.p {...up(0.28)} className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-mute">
          {personalInfo.bio}
        </Motion.p>
        <Motion.div {...up(0.36)} className="mt-8 max-w-xl"><AskBar /></Motion.div>
        <Motion.div {...up(0.44)} className="mt-6 flex flex-wrap items-center gap-3">
          <ScrollLink to="projects" href="#projects" smooth duration={700} offset={-72} className="btn-ink cursor-pointer">See the work <FaArrowDown size={12} /></ScrollLink>
          <button onClick={() => askSantosh('', 'fit')} className="btn-line">Recruiter? Check job fit</button>
          <div className="ml-1 flex items-center gap-1">
            {Object.entries(socialLinks).map(([k, l]) => {
              const I = icons[l.iconName];
              return <a key={k} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={k} className="rounded-full p-2.5 text-mute transition hover:bg-ink/5 hover:text-ink">{I && React.createElement(I, { size: 18 })}</a>;
            })}
          </div>
        </Motion.div>
      </div>
      <Motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
        <AgentGraph />
      </Motion.div>
    </div>

    {/* ticker */}
    <div className="mt-20 border-y border-blue/40 bg-blue py-4 text-white">
      <div className="flex overflow-hidden" aria-label="Highlights">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 whitespace-nowrap">
          {[...heroStats, ...heroStats, ...heroStats, ...heroStats].map((s, i) => (
            <span key={i} className="flex items-center gap-3 text-[15px]">
              <span className="font-display text-xl font-bold text-white">{s.k}</span>
              <span className="text-white/75">{s.v}</span>
              <span className="text-white/50">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
