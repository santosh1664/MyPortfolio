import React from 'react';
import { FaArrowRight, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Tilt from './Tilt.jsx';
import { personalInfo, socialLinks } from '../data/portfolioData.jsx';

const icons = { FaGithub, FaLinkedin, FaEnvelope };

const Contact = () => (
  <section id="contact" className="py-24 sm:py-36">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Tilt>
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-panel2 via-panel to-ink p-8 sm:p-16">
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
          <div className="eyebrow mb-6 flex items-center gap-3"><span className="text-accent">07</span><span className="h-px w-10 bg-white/20" />Contact</div>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] tracking-tightest text-bone">
            Let's build<br /><span className="font-serif normal-case italic font-normal text-bone/70">something</span> next<span className="text-accent">.</span>
          </h2>
          <p className="mt-8 max-w-xl text-mute leading-relaxed">
            I'm open to new roles, projects, and collaborations. If you'd like to work together or just want to connect, my inbox is always open.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href={`mailto:${personalInfo.email}`} className="btn-primary">Say hello <FaArrowRight /></a>
            {Object.entries(socialLinks).map(([k, l]) => {
              const I = icons[l.iconName];
              return (
                <a key={k} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={k}
                   className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute transition hover:text-accent">
                  {I && <I size={16} />} {k}
                </a>
              );
            })}
          </div>
        </div>
      </Tilt>
    </div>
  </section>
);

export default Contact;
