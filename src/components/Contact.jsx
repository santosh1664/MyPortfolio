import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import Reveal from './Reveal.jsx';
import { personalInfo } from '../data/portfolioData.jsx';
import { askSantosh } from '../assistant/events.js';

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(personalInfo.email); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* blocked */ }
  };
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-blue p-8 text-white sm:p-14">
          <svg className="pointer-events-none absolute -right-10 -top-10 h-[420px] w-[420px] opacity-25" viewBox="0 0 200 200" aria-hidden>
            {[[30, 40], [150, 30], [100, 110], [40, 160], [170, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="white" />)}
            <path d="M30 40 L150 30 L100 110 L40 160 M100 110 L170 150" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="4 5" />
          </svg>
          <div className="relative">
            <div className="font-mono text-[12px] text-white/70">06 · contact.sh</div>
            <h2 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tightest sm:text-7xl">Let's ship something reliable.</h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/80">
              Open to Software Engineer roles across AI, backend and full-stack. Based in Dallas, open to relocation, on-site, hybrid or remote.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white">
                <FaEnvelope /> {personalInfo.email}
              </a>
              <button onClick={copy} className="rounded-full border border-white/30 px-5 py-3 text-sm transition hover:bg-white/10">{copied ? 'Copied ✓' : 'Copy email'}</button>
              <button onClick={() => askSantosh()} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm transition hover:bg-white/10">Ask the AI first <FaArrowRight size={11} /></button>
            </div>
            <div className="mt-10 flex gap-6 text-[14px] text-white/80">
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white"><FaLinkedin /> LinkedIn</a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white"><FaGithub /> GitHub</a>
              <a href={personalInfo.resumeLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">Résumé ↗</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
