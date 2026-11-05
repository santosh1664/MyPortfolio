import React, { useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { askSantosh } from '../assistant/events.js';

// "How Santosh builds AI systems" — a live pipeline diagram. Every stat is from his résumé.
const SAMPLE_QS = ['Does he know Kafka?', 'What is he working on now?', 'Is he available?', 'Tell me about rejekt.ai'];

const NODES = [
  { id: 'ask', step: '01', kind: 'Input', title: 'Your question', x: 110, y: 64,
    stat: 'Ask anything', detail: 'Type a question about Santosh. The portfolio assistant answers from his real résumé, never invented.' },
  { id: 'rag', step: '02', kind: 'Retrieve', title: 'RAG over real data', x: 390, y: 64,
    stat: '2.02M listings', detail: 'Built RAG with SentenceTransformers + ChromaDB for rejekt.ai, grounded in real resumes and job descriptions; its pipelines have processed 2.02M+ job listings from 19 sources.' },
  { id: 'agent', step: '03', kind: 'Reason', title: 'Agents & LLMs', x: 390, y: 206,
    stat: '12 processes', detail: 'At Citigroup he builds AI agent workflows with Google ADK for Java that automate 12 multi-step financial processes. Uses LangGraph, OpenAI and Gemini in rejekt.ai.' },
  { id: 'guard', step: '04', kind: 'Guardrails', title: 'Deterministic checks', x: 110, y: 206,
    stat: '−30% manual', detail: 'Agents call enterprise APIs only through deterministic business-rule checks, so every decision stays predictable and auditable. Cut manual processing steps by 30%.' },
  { id: 'ship', step: '05', kind: 'Ship', title: 'Production', x: 250, y: 338,
    stat: '99.9% uptime', detail: '15 secure REST endpoints at 50K+ requests a day and 99.9% availability; code-to-production cut from 2 days to 6 hours with Docker, Kubernetes and CI/CD.' },
];

const EDGES = [
  'M190 64 L310 64',
  'M390 98 L390 172',
  'M310 206 L190 206',
  'M110 240 C110 300, 150 338, 170 338',
];

const Packets = () => (
  <g>
    {EDGES.map((d, i) => (
      <circle key={d} r="4" fill="#4C6BFF">
        <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.6}s`} path={d} />
      </circle>
    ))}
  </g>
);

const NodeCard = ({ n, active, onEnter, typed }) => (
  <button
    type="button"
    onMouseEnter={onEnter}
    onFocus={onEnter}
    onClick={() => (n.id === 'ask' ? askSantosh(SAMPLE_QS.find((q) => typed && q.startsWith(typed)) || SAMPLE_QS[0]) : onEnter())}
    style={{ left: `${(n.x / 500) * 100}%`, top: `${(n.y / 400) * 100}%`, transform: `translate(-50%, ${active ? '-56%' : '-50%'})` }}
    className={`absolute w-[36%] rounded-xl border bg-card px-3.5 py-3 text-left transition-all duration-300 ${
      active ? 'border-blue bg-[#151a2e] shadow-[0_14px_50px_-12px_rgba(76,107,255,0.75)]' : 'border-line hover:border-ink/30'
    }`}
    aria-label={`${n.kind}: ${n.title}`}
  >
    <div className="flex items-center justify-between">
      <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${active ? 'text-blue' : 'text-mute'}`}>{n.step} · {n.kind}</span>
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-blue' : 'bg-ink/20'}`} />
    </div>
    <div className="mt-1 font-display text-[15px] font-bold leading-tight text-ink">{n.title}</div>
    {n.id === 'ask' ? (
      <div className="mt-1.5 truncate rounded-md bg-paper px-2 py-1 font-mono text-[11px] text-ink/80">
        {typed}<span className="ml-px inline-block h-3 w-[2px] translate-y-[2px] animate-blink bg-blue" />
      </div>
    ) : (
      <div className="mt-1 font-mono text-[11.5px] text-blue">{n.stat}</div>
    )}
  </button>
);

const useTyped = (reduce) => {
  const [txt, setTxt] = useState(SAMPLE_QS[0]);
  useEffect(() => {
    if (reduce) return undefined;
    let qi = 0; let ci = 0; let dir = 1; let pause = 0;
    const t = setInterval(() => {
      const q = SAMPLE_QS[qi];
      if (pause > 0) { pause -= 1; return; }
      ci += dir;
      if (ci >= q.length) { dir = -1; pause = 28; }
      if (ci <= 0) { dir = 1; qi = (qi + 1) % SAMPLE_QS.length; pause = 4; }
      setTxt(SAMPLE_QS[qi].slice(0, Math.max(0, ci)));
    }, 55);
    return () => clearInterval(t);
  }, [reduce]);
  return txt;
};

const AgentGraph = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const typed = useTyped(reduce);

  useEffect(() => {
    if (reduce || hover) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % NODES.length), 2600);
    return () => clearInterval(t);
  }, [reduce, hover]);

  const cur = NODES[active];

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="w-full">
      {/* desktop / tablet: the graph */}
      <div className="panel relative hidden overflow-hidden p-3 sm:block">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="label">how_santosh_builds.graph</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mint">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> live
          </span>
        </div>
        <div className="relative aspect-[5/4] w-full rounded-xl bg-paper/60">
          <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="#ffffff" fillOpacity="0.35" />
              </marker>
            </defs>
            {EDGES.map((d) => (
              <path key={d} d={d} fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="4 5" markerEnd="url(#arr)" />
            ))}
            {!reduce && <Packets />}
          </svg>
          {NODES.map((n, i) => (
            <NodeCard key={n.id} n={n} active={i === active} typed={typed} onEnter={() => setActive(i)} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <Motion.div key={cur.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
                      className="mx-1 mt-3 flex min-h-[64px] gap-3 rounded-xl border border-blue/30 bg-blue/10 px-4 py-3">
            <span className="font-mono text-[11px] text-blue">{cur.step}</span>
            <p className="text-[13px] leading-relaxed text-ink/85">{cur.detail}</p>
          </Motion.div>
        </AnimatePresence>
      </div>

      {/* mobile: vertical pipeline */}
      <ol className="panel space-y-0 p-4 sm:hidden">
        {NODES.map((n, i) => (
          <li key={n.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < NODES.length - 1 && <span className="absolute left-[11px] top-6 h-full w-px border-l border-dashed border-ink/25" />}
            <span className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue font-mono text-[10px] text-white">{n.step}</span>
            <div>
              <div className="font-display text-[15px] font-bold">{n.title} <span className="ml-1 font-mono text-[11px] font-normal text-blue">{n.id === 'ask' ? '' : n.stat}</span></div>
              <p className="mt-0.5 text-[13px] leading-relaxed text-mute">{n.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default AgentGraph;
