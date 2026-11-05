import React from 'react';
import { FaGithub, FaAward } from 'react-icons/fa6';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import RejektArchitecture from '../widgets/RejektArchitecture.jsx';
import { projects } from '../data/portfolioData.jsx';

const Links = ({ p, light }) => {
  const cls = `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition ${light ? 'border-blue/40 text-ink hover:bg-blue hover:text-white' : 'border-ink/15 hover:border-ink hover:bg-ink hover:text-paper'}`;
  return (
    <div className="flex flex-wrap gap-2">
      {p.liveLink && <a className={cls} href={p.liveLink} target="_blank" rel="noopener noreferrer">Live <span aria-hidden>↗</span></a>}
      {p.githubLink && <a className={cls} href={p.githubLink} target="_blank" rel="noopener noreferrer"><FaGithub size={13} /> Code</a>}
      {p.liveLink2 && <a className={cls} href={p.liveLink2} target="_blank" rel="noopener noreferrer">Demo <span aria-hidden>↗</span></a>}
      {p.award && <a className={cls} href={p.award} target="_blank" rel="noopener noreferrer"><FaAward size={12} /> Award</a>}
    </div>
  );
};

const CaseStudy = ({ p, i }) => {
  const dark = i === 0;
  return (
    <Reveal delay={i * 0.08} className={`flex flex-col rounded-3xl border p-7 sm:p-9 ${dark ? 'border-blue/40 bg-card bg-[radial-gradient(120%_80%_at_0%_0%,rgba(76,107,255,0.28),transparent_60%)] shadow-[0_30px_80px_-40px_rgba(76,107,255,0.7)]' : 'border-line bg-card'}`}>
      <div className="flex items-center justify-between">
        <span className={`font-mono text-[12px] ${dark ? 'text-blueSoft' : 'text-blue'}`}>case_{String(i + 1).padStart(2, '0')}</span>
        <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? 'text-ink/50' : 'text-mute'}`}>{p.date}</span>
      </div>
      <h3 className="mt-5 font-display text-[28px] font-extrabold leading-[1.05] tracking-tight sm:text-[34px]">{p.title.split('—')[0].trim()}</h3>
      <div className={`mt-1 text-[15px] ${dark ? 'text-ink/60' : 'text-mute'}`}>{(p.title.split('—')[1] || p.category).trim()}</div>
      <p className={`mt-5 text-[15px] leading-relaxed ${dark ? 'text-ink/80' : 'text-ink/75'}`}>{p.description}</p>
      {p.highlights && (
        <ul className="mt-5 space-y-2.5">
          {p.highlights.map((h) => (
            <li key={h} className={`flex gap-3 text-[14px] leading-relaxed ${dark ? 'text-ink/75' : 'text-ink/70'}`}>
              <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${dark ? 'bg-blueSoft' : 'bg-blue'}`} />{h}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {p.tech.slice(0, 12).map((t) => (
          <span key={t} className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${dark ? 'bg-blue/15 text-ink/85' : 'bg-paper text-ink/75'}`}>{t}</span>
        ))}
      </div>
      <div className="mt-auto pt-7"><Links p={p} light={dark} /></div>
    </Reveal>
  );
};

const Projects = () => {
  const [a, b, ...rest] = projects;
  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle id="projects-title" index="03" file="work/case_studies" aside="Two flagship builds, then the archive: accessibility, ML, systems and games.">
          Selected work.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-2">
          <CaseStudy p={a} i={0} />
          <CaseStudy p={b} i={1} />
        </div>

        <Reveal className="mt-5">
          <RejektArchitecture />
        </Reveal>

        <Reveal className="mt-14">
          <div className="label mb-3">archive/</div>
          <ul className="divide-y divide-line border-y border-line">
            {rest.map((p, i) => (
              <li key={p.title} className="group grid gap-2 py-5 transition sm:grid-cols-[48px_1.4fr_1fr_auto] sm:items-center sm:gap-6">
                <span className="font-mono text-[12px] text-mute">{String(i + 3).padStart(2, '0')}</span>
                <div>
                  <h4 className="font-display text-lg font-bold leading-tight transition group-hover:text-blue">{p.title}</h4>
                  <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-mute">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">{p.tech.slice(0, 4).map((t) => <span key={t} className="chip !text-[10.5px]">{t}</span>)}</div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <span className="font-mono text-[11px] text-mute">{p.date.split('–')[0].trim()}</span>
                  {p.githubLink && <a href={p.githubLink} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} code`} className="rounded-full border border-line p-2 transition hover:border-ink hover:bg-ink hover:text-paper"><FaGithub size={14} /></a>}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
