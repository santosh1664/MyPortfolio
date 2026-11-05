import React from 'react';

const SectionTitle = ({ id, index, kicker, children }) => (
  <div className="mb-12 sm:mb-16">
    <div className="eyebrow mb-4 flex items-center gap-3">
      {index && <span className="text-accent">{index}</span>}
      <span className="h-px w-10 bg-white/20" />
      <span>{kicker}</span>
    </div>
    <h2 id={id} className="font-display text-4xl sm:text-6xl font-bold tracking-tightest leading-[0.95] text-bone">
      {children}<span className="text-accent">.</span>
    </h2>
  </div>
);

export default SectionTitle;
