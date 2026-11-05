import React from 'react';
import Reveal from './Reveal.jsx';

// Section header styled like a graph node label: "[03] work.case_studies"
const SectionTitle = ({ id, index, file, children, aside }) => (
  <Reveal className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <div className="mb-4 flex items-center gap-2 font-mono text-[12px] text-mute">
        <span className="rounded-md bg-ink px-1.5 py-0.5 text-paper">{index}</span>
        <span>{file}</span>
      </div>
      <h2 id={id} className="h-section">{children}</h2>
    </div>
    {aside && <div className="max-w-sm text-[15px] leading-relaxed text-mute">{aside}</div>}
  </Reveal>
);

export default SectionTitle;
