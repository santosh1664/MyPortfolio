import React, { useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import WidgetFrame from './WidgetFrame.jsx';

// Clickable system diagram of rejekt.ai. Coordinates are in a 760×360 space.
const N = [
  { id: 'user', x: 70, y: 200, t: 'Candidate', s: 'web · voice', d: 'Candidates pick one of 6 interview modes (technical, behavioral, company-specific…) and answer by text or live voice.' },
  { id: 'api', x: 215, y: 200, t: 'FastAPI', s: 'Python services', d: 'Python/FastAPI services for auth, interview orchestration, AI evaluation, performance reporting, billing and credits, covered by pytest.' },
  { id: 'graph', x: 380, y: 120, t: 'LangGraph engine', s: 'adaptive interview', d: 'Keeps multi-turn context, generates follow-up questions and scores answers on 5 dimensions: technical accuracy, STAR structure, communication, filler words, missing concepts.' },
  { id: 'voice', x: 380, y: 280, t: 'Whisper + TTS', s: 'real-time voice', d: 'Speech-to-text with Whisper and text-to-speech for live voice interviews, through automated speech-processing pipelines.' },
  { id: 'llm', x: 590, y: 95, t: 'OpenAI · Gemini', s: 'LLMs + MCP tools', d: 'OpenAI and Google Gemini power question generation, answer evaluation and scoring; tools and data are wired in through the Model Context Protocol (MCP).' },
  { id: 'rag', x: 590, y: 185, t: 'RAG · ChromaDB', s: 'SentenceTransformers', d: 'Embeddings with SentenceTransformers in ChromaDB ground every question and piece of feedback in the candidate\'s resume and the target job description.' },
  { id: 'data', x: 560, y: 275, t: 'Postgres · Redis', s: 'state + cache', d: 'PostgreSQL (RDS) for users, sessions and reports; Redis for caching and session state.' },
  { id: 'ingest', x: 670, y: 350, t: 'Job ingestion', s: '19 sources → 2.02M', d: 'Pipelines across 19 job sources: 2.02M+ listings processed, ~115,600 qualified records kept after validation, normalization, classification and deduplication.' },
];
const E = [['user', 'api'], ['api', 'graph'], ['api', 'voice'], ['graph', 'llm'], ['graph', 'rag'], ['api', 'data'], ['voice', 'graph'], ['ingest', 'data'], ['ingest', 'rag']];
const pos = Object.fromEntries(N.map((n) => [n.id, n]));

const RejektArchitecture = () => {
  const reduce = useReducedMotion();
  const [sel, setSel] = useState('graph');
  const cur = pos[sel];
  return (
    <WidgetFrame file="rejekt_ai.architecture" status="in production">
      <div className="relative hidden aspect-[760/400] w-full rounded-xl bg-paper/60 md:block">
        <svg viewBox="0 0 760 400" className="absolute inset-0 h-full w-full" aria-hidden>
          {E.map(([a, b]) => {
            const A = pos[a]; const B = pos[b];
            const d = `M${A.x} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x} ${B.y}`;
            const on = sel === a || sel === b;
            return (
              <g key={a + b}>
                <path d={d} fill="none" stroke={on ? '#4C6BFF' : '#ffffff'} strokeOpacity={on ? 0.9 : 0.18} strokeWidth={on ? 2 : 1.4} strokeDasharray={on ? '0' : '4 5'} />
                {!reduce && on && <circle r="3.5" fill="#4C6BFF"><animateMotion dur="1.6s" repeatCount="indefinite" path={d} /></circle>}
              </g>
            );
          })}
          <rect x="478" y="22" width="276" height="370" rx="14" fill="none" stroke="#4C6BFF" strokeOpacity="0.25" strokeDasharray="3 5" />
          <text x="492" y="44" fill="#9097A8" fontSize="10" fontFamily="JetBrains Mono, monospace">AWS · ECS Fargate · S3 · ALB · CloudWatch</text>
        </svg>
        {N.map((n) => (
          <button key={n.id} type="button" onClick={() => setSel(n.id)} onMouseEnter={() => setSel(n.id)} onFocus={() => setSel(n.id)}
                  style={{ left: `${(n.x / 760) * 100}%`, top: `${(n.y / 400) * 100}%`, transform: 'translate(-50%,-50%)' }}
                  className={`absolute whitespace-nowrap rounded-lg border px-3 py-2 text-left transition ${sel === n.id ? 'border-blue bg-[#151a2e] shadow-[0_10px_30px_-10px_rgba(76,107,255,0.8)]' : 'border-line bg-card hover:border-ink/30'}`}>
            <div className="font-display text-[13.5px] font-bold leading-tight">{n.t}</div>
            <div className="font-mono text-[10.5px] text-blue">{n.s}</div>
          </button>
        ))}
      </div>

      {/* mobile: tappable list */}
      <div className="flex flex-wrap gap-1.5 rounded-xl bg-paper/60 p-3 md:hidden">
        {N.map((n) => (
          <button key={n.id} onClick={() => setSel(n.id)} className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] ${sel === n.id ? 'border-blue bg-blue/15' : 'border-line'}`}>{n.t}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <Motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                    className="mx-1 mt-3 flex gap-3 rounded-xl border border-blue/30 bg-blue/10 px-4 py-3">
          <span className="font-display text-[14px] font-bold text-ink">{cur.t}</span>
          <p className="text-[13.5px] leading-relaxed text-ink/80">{cur.d}</p>
        </Motion.div>
      </AnimatePresence>
    </WidgetFrame>
  );
};

export default RejektArchitecture;
