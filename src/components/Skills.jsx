import React, { useMemo, useState } from 'react';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import { skills } from '../data/portfolioData.jsx';
import { findSkills, SKILLS_HAVE } from '../assistant/engine.js';
import { askSantosh } from '../assistant/events.js';

const groups = [
  { k: 'ai', title: 'AI / ML & Agents', items: skills.aiAndDataEngineering },
  { k: 'be', title: 'Backend & Frontend', items: skills.frameworksAndLibraries },
  { k: 'lang', title: 'Languages', items: skills.languages },
  { k: 'data', title: 'Databases', items: skills.databases },
  { k: 'ops', title: 'Cloud, DevOps & Testing', items: skills.toolsAndPlatforms },
  { k: 'eng', title: 'Engineering practice', items: skills.coreCompetencies },
];

// Instant "Does he know ___?" check, powered by the same engine as the assistant.
const Checker = () => {
  const [q, setQ] = useState('');
  const res = useMemo(() => {
    if (q.trim().length < 2) return null;
    const found = findSkills(` ${q} `);
    if (!found.length) return { state: 'unknown' };
    const yes = found.filter((s) => SKILLS_HAVE.has(s));
    return { state: yes.length ? 'yes' : 'no', yes, no: found.filter((s) => !SKILLS_HAVE.has(s)) };
  }, [q]);
  return (
    <div className="panel p-5">
      <label htmlFor="skillq" className="font-display text-xl font-bold">Does he know <span className="text-blue">___</span>?</label>
      <input id="skillq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a technology — Kafka, React, RAG…"
             className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 font-mono text-[14px] placeholder:text-mute/70 focus:border-blue focus:outline-none" />
      <div className="mt-3 min-h-[48px] text-[14.5px]" aria-live="polite">
        {!res && <span className="text-mute">Answers come straight from his résumé.</span>}
        {res?.state === 'yes' && (
          <div>
            <span className="font-semibold text-mint">✓ Yes — {res.yes.join(', ')}</span>
            {res.no.length > 0 && <span className="text-mute"> · not listed: {res.no.join(', ')}</span>}
            <button onClick={() => askSantosh(`Does he know ${res.yes[0]}?`)} className="ml-2 text-blue underline-offset-2 hover:underline">See where he used it →</button>
          </div>
        )}
        {res?.state === 'no' && <span className="text-ink">Not on his résumé: <b>{res.no.join(', ')}</b>. He doesn't claim it.</span>}
        {res?.state === 'unknown' && <span className="text-mute">I don't recognize that one. Try the assistant: <button onClick={() => askSantosh(`Does he know ${q}?`)} className="text-blue hover:underline">ask about “{q}”</button></span>}
      </div>
    </div>
  );
};

const Skills = () => {
  const [hot, setHot] = useState('ai');
  return (
    <section id="skills" className="border-y border-line bg-paper2/60 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionTitle id="skills-title" index="02" file="stack.json" aside="Hover a group to light it up, or check a specific technology on the right.">
          The stack.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <Reveal className="panel divide-y divide-line">
            {groups.map((g) => (
              <div key={g.k} onMouseEnter={() => setHot(g.k)} onFocus={() => setHot(g.k)} tabIndex={0}
                   className="grid gap-3 p-5 outline-none transition sm:grid-cols-[210px_1fr] sm:items-start">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full transition ${hot === g.k ? 'bg-blue ring-4 ring-blue/20' : 'bg-ink/20'}`} />
                  <h3 className={`font-display text-[17px] font-bold transition ${hot === g.k ? 'text-ink' : 'text-ink/55'}`}>{g.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span key={s.name} className={`chip transition ${hot === g.k ? 'border-blue/30 bg-blue/15 text-ink' : ''}`}>{s.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start"><Checker /></Reveal>
        </div>
      </div>
    </section>
  );
};

export default Skills;
