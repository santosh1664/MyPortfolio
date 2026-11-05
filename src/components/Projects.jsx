import React from 'react';
import { motion as Motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaAward } from 'react-icons/fa';
import Tilt from './Tilt.jsx';
import SectionTitle from './SectionTitle.jsx';
import { projects } from '../data/portfolioData.jsx';

const LinkBtn = ({ href, icon, label }) =>
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition hover:text-accent">
      {React.createElement(icon, { size: 12 })} {label}
    </a>
  ) : null;

const Card = ({ p, i }) => {
  const featured = i < 2;
  return (
    <Motion.article
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel p-6 sm:p-8 transition-colors hover:border-white/20 ${featured ? 'md:col-span-2' : ''}`}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-accent/0 blur-3xl transition group-hover:bg-accent/15" />
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
        <span className="eyebrow !text-[10px] text-right">{p.category}</span>
      </div>
      <h3 className={`mt-5 font-display font-bold tracking-tight text-bone ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{p.title}</h3>
      <div className="mt-1 font-mono text-[11px] text-mute">{p.date}</div>
      <p className={`mt-4 leading-relaxed text-mute ${featured ? 'max-w-3xl' : 'text-sm'}`}>{p.description}</p>
      {p.highlights && (
        <ul className={`mt-5 grid gap-3 ${featured ? 'lg:grid-cols-2' : ''}`}>
          {p.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm leading-relaxed text-bone/75">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" />{h}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
      <div className="mt-auto flex flex-wrap gap-5 pt-7">
        <LinkBtn href={p.githubLink} icon={FaGithub} label="Code" />
        <LinkBtn href={p.liveLink} icon={FaExternalLinkAlt} label="Live" />
        <LinkBtn href={p.liveLink2} icon={FaExternalLinkAlt} label="Demo" />
        <LinkBtn href={p.award} icon={FaAward} label="Award" />
      </div>
    </Motion.article>
  );
};

const Projects = () => (
  <section id="projects" className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Tilt strength={0.6}>
        <SectionTitle id="projects-title" index="03" kicker="Selected work">Things I've built</SectionTitle>
      </Tilt>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => <Card key={p.title} p={p} i={i} />)}
      </div>
    </div>
  </section>
);

export default Projects;
