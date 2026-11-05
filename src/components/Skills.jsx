import React, { useState } from 'react';
import Tilt from './Tilt.jsx';
import SectionTitle from './SectionTitle.jsx';
import { skills } from '../data/portfolioData.jsx';

const groups = [
  { title: 'Languages', items: skills.languages },
  { title: 'AI / ML & Agents', items: skills.aiAndDataEngineering },
  { title: 'Backend & Frontend', items: skills.frameworksAndLibraries },
  { title: 'Databases', items: skills.databases },
  { title: 'Cloud, DevOps & Testing', items: skills.toolsAndPlatforms },
  { title: 'Engineering Practice', items: skills.coreCompetencies },
];

const Skills = () => {
  const [active, setActive] = useState(0);
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Tilt>
          <div className="card p-7 sm:p-12">
            <SectionTitle id="skills-title" index="02" kicker="Stack">Tech arsenal</SectionTitle>
            <ul className="divide-y divide-line border-y border-line">
              {groups.map((g, i) => (
                <li key={g.title} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0}
                    className="group grid gap-4 py-6 outline-none md:grid-cols-[320px_1fr] md:items-center">
                  <div className="flex items-center gap-4">
                    <span className={`h-2.5 w-2.5 rounded-[2px] transition ${active === i ? 'bg-accent shadow-[0_0_14px_rgba(255,45,85,0.7)]' : 'bg-white/25'}`} />
                    <h3 className={`font-display text-xl sm:text-2xl font-semibold tracking-tight transition ${active === i ? 'text-bone' : 'text-bone/60'}`}>{g.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span key={s.name} className={`chip transition ${active === i ? 'border-white/15 text-bone' : ''}`}>{s.name}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Tilt>
      </div>
    </section>
  );
};

export default Skills;
