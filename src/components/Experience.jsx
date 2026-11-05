import React, { useState } from 'react';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import { experience } from '../data/portfolioData.jsx';

// Career as a commit graph: newest on top, each role is a node on the main line.
const Experience = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="experience" className="border-y border-line bg-paper2/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle id="experience-title" index="04" file="git log --career" aside="Click a role to expand every bullet. Newest first.">
          Experience.
        </SectionTitle>
        <ol className="relative">
          <span className="absolute bottom-6 left-[15px] top-6 w-[2px] bg-ink/15 sm:left-[19px]" aria-hidden />
          {experience.map((job, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={job.duration} delay={i * 0.06} className="relative pb-5 pl-11 last:pb-0 sm:pl-14">
                <span className={`absolute left-[7px] top-7 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 sm:left-[11px] ${i === 0 ? 'border-blue bg-blue' : 'border-ink/40 bg-paper'}`}>
                  {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <div className={`panel overflow-hidden transition ${isOpen ? 'border-ink/25' : ''}`}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                          className="flex w-full flex-col gap-2 p-6 text-left sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl font-bold sm:text-2xl">{job.role}</h3>
                        {i === 0 && <span className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10.5px] text-mint">HEAD → now</span>}
                      </div>
                      <div className="mt-0.5 text-[15px] text-mute"><span className="font-semibold text-ink">{job.company}</span> · {job.location}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] text-mute">{job.duration}</span>
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-line font-mono text-sm transition ${isOpen ? 'rotate-45 bg-ink text-paper' : ''}`}>+</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-line px-6 pb-6 pt-5">
                      <ul className="space-y-2.5">
                        {job.points.map((pt) => (
                          <li key={pt} className="flex gap-3 text-[14.5px] leading-relaxed text-ink/75">
                            <span className="mt-[9px] h-px w-4 shrink-0 bg-blue" />{pt}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap gap-1.5">{job.tech.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
