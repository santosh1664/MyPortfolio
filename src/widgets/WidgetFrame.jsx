import React from 'react';

// Shared chrome for the interactive "file" widgets: mono filename + live dot.
const WidgetFrame = ({ file, status = 'live', children, className = '' }) => (
  <div className={`panel relative overflow-hidden p-3 ${className}`}>
    <div className="flex items-center justify-between px-2 pb-2">
      <span className="label">{file}</span>
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mint">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> {status}
      </span>
    </div>
    {children}
  </div>
);

export default WidgetFrame;
