import React from 'react';
import Tilt from './Tilt.jsx';
import SectionTitle from './SectionTitle.jsx';
import { personalInfo, education, heroStats as stats } from '../data/portfolioData.jsx';


const About = () => (
  <section id="about" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Tilt>
        <div className="card p-7 sm:p-12">
          <SectionTitle id="about-title" index="01" kicker="About">Who I am</SectionTitle>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-display text-2xl sm:text-3xl leading-snug text-bone">
                I build <span className="font-serif italic text-accent">auditable</span> AI agents and the enterprise systems they run on —
                from Spring Boot microservices and Kafka pipelines to RAG and LangGraph products.
              </p>
              <p className="mt-6 max-w-2xl leading-relaxed text-mute">{personalInfo.bio}</p>
              <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                {stats.map((s) => (
                  <div key={s.k} className="bg-panel p-5">
                    <div className="font-display text-3xl font-bold tracking-tight text-bone">{s.k}</div>
                    <div className="mt-1 text-xs leading-snug text-mute">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow mb-5">Education</div>
              <ol className="space-y-4">
                {education.map((e) => (
                  <li key={e.degree} className="rounded-xl border border-line bg-white/[0.02] p-5">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{e.duration}</div>
                    <div className="mt-2 font-display text-lg font-semibold text-bone">{e.degree}</div>
                    <div className="mt-1 text-sm text-mute">{e.institution.trim()}</div>
                    {e.score && <div className="mt-3 chip">{e.score}</div>}
                  </li>
                ))}
              </ol>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-line bg-white/[0.02] p-5">
                  <div className="eyebrow !text-[10px]">Certified</div>
                  <div className="mt-2 font-display text-base font-semibold text-bone">AWS Developer – Associate</div>
                </div>
                <div className="rounded-xl border border-line bg-white/[0.02] p-5">
                  <div className="eyebrow !text-[10px]">Published</div>
                  <div className="mt-2 font-display text-base font-semibold text-bone">ACM W4A '24 · Judges' Award</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  </section>
);

export default About;
