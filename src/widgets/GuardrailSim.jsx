import React, { useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import WidgetFrame from './WidgetFrame.jsx';

// Simplified illustration of the agent-with-guardrails pattern Santosh builds at Citigroup.
// Generic example only — no Citigroup code, data or process names.
const STEPS = [
  { k: 'req', t: 'Request', d: 'Multi-step financial task arrives' },
  { k: 'agent', t: 'AI agent', d: 'Google ADK for Java plans the next action' },
  { k: 'rule', t: 'Business-rule gate', d: 'Deterministic checks run before any API call' },
  { k: 'api', t: 'Enterprise API', d: 'Only approved calls go through' },
  { k: 'audit', t: 'Audit log', d: 'Every decision is recorded and explainable' },
];

const GuardrailSim = () => {
  const reduce = useReducedMotion();
  const [pass, setPass] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) { setStep(STEPS.length - 1); return undefined; }
    setStep(0);
    const t = setInterval(() => setStep((s) => (s >= STEPS.length - 1 ? s : s + 1)), 650);
    return () => clearInterval(t);
  }, [pass, reduce]);

  const blockedAt = 2;
  return (
    <WidgetFrame file="agent_guardrails.sim" status="pattern">
      <div className="rounded-xl bg-paper/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-display text-lg font-bold">Agents that can't go rogue</div>
          <div className="flex rounded-full border border-line p-0.5 text-[12px]">
            <button onClick={() => setPass(true)} className={`rounded-full px-3 py-1 transition ${pass ? 'bg-mint/20 text-mint' : 'text-mute'}`}>rule passes</button>
            <button onClick={() => setPass(false)} className={`rounded-full px-3 py-1 transition ${!pass ? 'bg-[#ff5c7a]/20 text-[#ff8da2]' : 'text-mute'}`}>rule fails</button>
          </div>
        </div>
        <ol className="mt-4 space-y-2">
          {STEPS.map((s, i) => {
            const reached = i <= step;
            const blocked = !pass && i > blockedAt;
            const isGate = i === blockedAt;
            const gateState = isGate && reached ? (pass ? 'ok' : 'stop') : null;
            return (
              <Motion.li key={s.k} animate={{ opacity: blocked ? 0.25 : reached ? 1 : 0.35 }}
                         className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${gateState === 'stop' ? 'border-[#ff5c7a]/50 bg-[#ff5c7a]/10' : gateState === 'ok' ? 'border-mint/40 bg-mint/10' : reached && !blocked ? 'border-blue/40 bg-blue/10' : 'border-line'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${gateState === 'stop' ? 'bg-[#ff5c7a] text-white' : gateState === 'ok' ? 'bg-mint text-black' : reached && !blocked ? 'bg-blue text-white' : 'bg-ink/10 text-mute'}`}>
                  {gateState === 'stop' ? '✕' : gateState === 'ok' ? '✓' : i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold">{s.t}</div>
                  <div className="text-[12.5px] text-mute">{gateState === 'stop' ? 'Check failed → action blocked, escalated to a human' : s.d}</div>
                </div>
              </Motion.li>
            );
          })}
        </ol>
        <p className="mt-4 text-[13px] leading-relaxed text-mute">
          At Citigroup: <span className="text-ink">12 multi-step financial processes automated, −30% manual steps</span>. Simplified illustration of the pattern, not production code.
        </p>
      </div>
    </WidgetFrame>
  );
};

export default GuardrailSim;
