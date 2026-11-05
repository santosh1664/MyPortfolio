import React from 'react';
import Tilt from './Tilt.jsx';
import SectionTitle from './SectionTitle.jsx';
import { experience } from '../data/portfolioData.jsx';

const Experience = () => (
  <section id="experience" className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Tilt>
        <div className="card p-7 sm:p-12">
          <SectionTitle id="experience-title" index="04" kicker="Career">Experience</SectionTitle>
          <ol className="relative space-y-12 border-l border-line pl-8 sm:pl-12">
            {experience.map((job, i) => (
              <li key={job.duration} className="relative">
                <span className={`absolute -left-[37px] sm:-left-[53px] top-1.5 h-3 w-3 rounded-full ring-4 ring-ink ${i === 0 ? 'bg-accent shadow-[0_0_16px_rgba(255,45,85,0.8)]' : 'bg-white/40'}`} />
                <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{job.duration}</div>
                    <div className="mt-2 font-display text-2xl font-bold tracking-tight text-bone">{job.company}</div>
                    <div className="text-sm text-mute">{job.location}</div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-bone">{job.role}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {job.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-mute leading-relaxed">
                          <span className="mt-2.5 h-px w-4 shrink-0 bg-accent" />{pt}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-2">{job.tech.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Tilt>
    </div>
  </section>
);

export default Experience;
