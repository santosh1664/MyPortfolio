import React from 'react';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import { leadershipAndInvolvement } from '../data/portfolioData.jsx';

const Involvement = () => (
  <section id="involvement" className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionTitle id="involvement-title" index="05" file="beyond_code.md">Beyond code.</SectionTitle>
      <div className="grid gap-5 md:grid-cols-2">
        {leadershipAndInvolvement.map((x, i) => (
          <Reveal key={x.role} delay={i * 0.08} className="panel p-7">
            <div className="font-mono text-[12px] text-blue">{i === 0 ? 'award' : 'leadership'}</div>
            <h3 className="mt-2 font-display text-xl font-bold leading-tight">{x.role}</h3>
            <p className="mt-1 text-[14px] text-mute">{x.organization}</p>
            <ul className="mt-5 space-y-2">
              {x.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[14px] leading-relaxed text-ink/75"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{pt}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Involvement;
