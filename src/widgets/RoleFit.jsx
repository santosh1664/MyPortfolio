import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import WidgetFrame from './WidgetFrame.jsx';
import { roleVariants, experience, projects } from '../data/portfolioData.jsx';
import { SKILLS_HAVE } from '../assistant/engine.js';
import { askSantosh } from '../assistant/events.js';

const allBullets = [
  ...experience.flatMap((j) => j.points.map((t) => ({ t, src: `${j.company}` }))),
  ...projects.flatMap((p) => (p.highlights || []).map((t) => ({ t, src: p.title.split('—')[0].trim() }))),
];
const pick = (keys) => keys.map((k) => allBullets.find((b) => b.t.toLowerCase().includes(k.toLowerCase()))).filter(Boolean);

const RoleFit = () => {
  const [id, setId] = useState('ai');
  const role = roleVariants.find((r) => r.id === id);
  const proof = useMemo(() => pick(role.proof), [role]);
  const have = role.core.filter((s) => SKILLS_HAVE.has(s)).length;

  return (
    <WidgetFrame file="role_fit.select">
      <div className="rounded-xl bg-paper/60 p-4 sm:p-5">
        <div className="font-display text-xl font-bold">Hiring for…</div>
        <div role="tablist" className="mt-3 flex flex-wrap gap-1.5">
          {roleVariants.map((r) => (
            <button key={r.id} role="tab" aria-selected={id === r.id} onClick={() => setId(r.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13.5px] transition ${id === r.id ? 'border-blue bg-blue text-white shadow-[0_8px_24px_-10px_rgba(76,107,255,0.9)]' : 'border-line text-mute hover:border-ink/30 hover:text-ink'}`}>
              {r.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <Motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/85">{role.pitch}</p>

            <div className="mt-5 flex items-center justify-between">
              <span className="label">core skills for this role</span>
              <span className="font-mono text-[12px] text-blue">{have}/{role.core.length} on résumé</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
              <Motion.div className="h-full rounded-full bg-blue" initial={{ width: 0 }} animate={{ width: `${(have / role.core.length) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.core.map((s) => (
                <span key={s} className={`chip ${SKILLS_HAVE.has(s) ? 'border-blue/30' : 'opacity-50'}`}>
                  <span className={`mr-1.5 ${SKILLS_HAVE.has(s) ? 'text-mint' : 'text-mute'}`}>{SKILLS_HAVE.has(s) ? '✓' : '·'}</span>{s}
                </span>
              ))}
            </div>

            <div className="label mt-6">proof</div>
            <ul className="mt-2 space-y-2.5">
              {proof.map((b) => (
                <li key={b.t} className="flex gap-3 text-[14px] leading-relaxed text-ink/80">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                  <span>{b.t} <span className="font-mono text-[11px] text-mute">— {b.src}</span></span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => askSantosh(`Why is he a good fit for a ${role.label} role?`.replace(' a AI', ' an AI'))} className="btn-ink !px-4 !py-2 text-[13px]">Ask about this role</button>
              <button onClick={() => askSantosh('', 'fit')} className="btn-line !px-4 !py-2 text-[13px]">Paste your job description</button>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
    </WidgetFrame>
  );
};

export default RoleFit;
