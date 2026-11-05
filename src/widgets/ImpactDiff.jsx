import React from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import WidgetFrame from './WidgetFrame.jsx';
import { impactDiff } from '../data/portfolioData.jsx';

// Before → after results, styled as a git diff.
const ImpactDiff = () => {
  const reduce = useReducedMotion();
  return (
    <WidgetFrame file="impact.diff" status="merged">
      <div className="overflow-hidden rounded-xl bg-paper/60 font-mono text-[12.5px]">
        <div className="border-b border-line px-4 py-2.5 text-mute">@@ results.yml · measured outcomes @@</div>
        <div className="grid lg:grid-cols-2 lg:[&>*:nth-child(odd)]:border-r lg:[&>*]:border-line">
        {impactDiff.map((d, i) => (
          <div key={d.metric} className="border-b border-line">
            <div className="flex gap-3 bg-[#ff5c7a]/[0.07] px-4 py-1.5 text-[#ff8da2]"><span className="select-none">-</span><span>{d.metric}: {d.before}</span></div>
            <div className="flex gap-3 bg-mint/[0.08] px-4 py-1.5 text-mint"><span className="select-none">+</span><span>{d.metric}: {d.after}</span></div>
            <div className="flex items-center gap-3 px-4 py-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                <Motion.div className="h-full rounded-full bg-blue" initial={{ width: reduce ? `${d.gain}%` : 0 }} whileInView={{ width: `${d.gain}%` }}
                            viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.12, ease: 'easeOut' }} />
              </div>
              <span className="w-12 text-right font-semibold text-ink">−{d.gain}%</span>
            </div>
            <div className="px-4 pb-2.5 text-[11px] text-mute"># {d.where}</div>
          </div>
        ))}
          <div className="flex flex-col justify-center gap-2 border-b border-line bg-mint/[0.05] px-4 py-4 text-mint">
            <div className="flex gap-3"><span>+</span><span>requests_per_day: 50K+</span></div>
            <div className="flex gap-3"><span>+</span><span>features_shipped_to: 500+ internal users</span></div>
          </div>
        </div>
        <div className="flex gap-3 bg-mint/[0.08] px-4 py-2 text-mint"><span>+</span><span>availability: 99.9% @ 50K+ req/day</span></div>
        <div className="flex gap-3 bg-mint/[0.08] px-4 py-2 text-mint"><span>+</span><span>production_incidents_resolved: 20+ (each with a regression test)</span></div>
      </div>
    </WidgetFrame>
  );
};

export default ImpactDiff;
