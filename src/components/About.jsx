import React from 'react';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import { education, certifications } from '../data/portfolioData.jsx';

const pillars = [
  { t: 'Production AI', d: 'Agent workflows at a global bank, with deterministic guardrails so every decision is auditable.' },
  { t: 'Full-stack depth', d: 'React and Angular through Spring Boot, Kafka and AWS. Owns features end to end.' },
  { t: 'Builder', d: 'Designed, shipped and runs rejekt.ai on his own: RAG, live voice, data pipelines, cloud infra.' },
  { t: 'Reliability', d: '99.9% availability, root-caused incidents, regression tests, releases from days to hours.' },
];

const About = () => (
  <section id="about" className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionTitle id="about-title" index="01" file="about.md" aside="Java and Python engineer moving fast into AI systems, with the enterprise discipline to ship them safely.">
        Engineer first.<br />AI by design.
      </SectionTitle>

      <div className="grid gap-5 lg:grid-cols-3">
        <Reveal className="panel p-7 lg:col-span-2">
          <p className="font-display text-2xl font-bold leading-snug sm:text-[28px]">
            By day I build <span className="text-blue">AI agent workflows</span> and full-stack financial systems at Citigroup.
            On my own time I built <span className="text-blue">rejekt.ai</span>, a live Generative AI interview platform.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {pillars.map((p, i) => (
              <div key={p.t} className="bg-card p-5">
                <div className="font-mono text-[11px] text-blue">0{i + 1}</div>
                <div className="mt-1 font-display text-lg font-bold">{p.t}</div>
                <p className="mt-1 text-[14px] leading-relaxed text-mute">{p.d}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-5">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.08} className="panel p-6">
              <div className="label">{e.duration}</div>
              <div className="mt-2 font-display text-lg font-bold leading-tight">{e.degree}</div>
              <div className="mt-1 text-[14px] text-mute">{e.institution.trim()}</div>
              {e.score && <div className="mt-3 chip">{e.score}</div>}
            </Reveal>
          ))}
          <Reveal delay={0.16} className="panel flex items-center gap-4 bg-blue p-6 text-white">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 font-mono text-sm font-bold">AWS</div>
            <div>
              <div className="font-display text-lg font-bold leading-tight">{certifications[0].title}</div>
              <a href={certifications[0].verifyUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/80 underline-offset-2 hover:underline">
                Verify · ID {certifications[0].validationId.slice(0, 10)}…
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default About;
