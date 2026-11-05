import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import GuardrailSim from '../widgets/GuardrailSim.jsx';
import ComputerUseReplay from '../widgets/ComputerUseReplay.jsx';
import TraderSkills from '../widgets/TraderSkills.jsx';
import { askSantosh } from '../assistant/events.js';

const MINI = [
  { tag: 'GenAI · live product', t: 'rejekt.ai', d: 'Generative AI interview platform: LangGraph adaptive engine, RAG over ChromaDB, OpenAI/Gemini, real-time Whisper voice.', cta: 'See case study', to: 'projects', href: 'https://www.rejekt.ai' },
  { tag: 'Computer vision · ACM W4A \'24', t: 'Beyond Sight', d: 'Turns charts into speech for blind users: fine-tuned ResNet (92% accuracy) + OCR/NLP pipeline (85% precision). Judges\' Award.', cta: 'See case study', to: 'projects' },
  { tag: 'Runs in your browser', t: 'This site\'s assistant', d: 'Answers recruiter questions only from his résumé, scores job descriptions, never invents. No API key, zero cost.', cta: 'Try it now', ask: true },
];

const AILab = () => (
  <section id="ai-lab" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionTitle id="ai-lab-title" index="00" file="ai_lab/" aside="Agents, computer use, RAG and vision: six AI systems he has designed and shipped. Each panel below is interactive.">
        The AI Lab.
      </SectionTitle>

      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal><ComputerUseReplay /></Reveal>
        <Reveal delay={0.08}><GuardrailSim /></Reveal>
        <Reveal className="lg:col-span-2"><TraderSkills /></Reveal>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {MINI.map((m, i) => (
          <Reveal key={m.t} delay={i * 0.06} className="panel flex flex-col p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-blue">{m.tag}</div>
            <h3 className="mt-2 font-display text-xl font-bold">{m.t}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-mute">{m.d}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5 text-[13px]">
              {m.ask ? (
                <button onClick={() => askSantosh('What AI work has he done?')} className="rounded-full bg-blue px-4 py-1.5 text-white transition hover:bg-white hover:text-black">{m.cta} →</button>
              ) : (
                <ScrollLink to={m.to} href={`#${m.to}`} smooth duration={700} offset={-72} className="cursor-pointer rounded-full border border-line px-4 py-1.5 transition hover:border-blue hover:text-blue">{m.cta}</ScrollLink>
              )}
              {m.href && <a href={m.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-4 py-1.5 transition hover:border-blue hover:text-blue">Live ↗</a>}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default AILab;
