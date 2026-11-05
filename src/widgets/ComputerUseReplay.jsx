import React, { useEffect, useRef, useState } from 'react';
import WidgetFrame from './WidgetFrame.jsx';

// Computer-use automation: LLM discovers a UI workflow once, replays it deterministically forever.
const PHASES = [
  { k: 'discover', t: 'Discover', tag: 'LLM online', lines: [
    '> goal: "look up member 10001 and read savings balance"',
    '  observe: screenshot + accessibility tree',
    '  decide (LLM): click #member-search',
    '  act: fill member_id = 10001 → submit',
    '  decide (LLM): read #savings-balance',
  ] },
  { k: 'artifact', t: 'Record', tag: 'typed JSON', lines: [
    '{ "capability": "member.read-balance",',
    '  "params": ["member_id"],',
    '  "steps": [ {"click": ["#member-search", "role=button"]}, …],',
    '  "outcomes": ["SUCCESS", "BUSINESS_RESULT", "HARD_FAILURE"] }',
  ] },
  { k: 'replay', t: 'Replay', tag: 'no LLM', lines: [
    '> replay member.read-balance --member-id 12345',
    '  multi-locator fallback ✓  param substitution ✓',
    '  policy guard ✓',
    '  result: SUCCESS { balance: "$4,210.55" }',
  ] },
  { k: 'handoff', t: 'Hand off', tag: 'human in loop', lines: [
    '> replay member.open-sub-account   (risky)',
    '  paused at confirmation step → escalate',
    '  operator attaches to the live browser over CDP',
    '  human confirms → replay resumes ✓',
  ] },
];

const ComputerUseReplay = () => {
  const [phase, setPhase] = useState(0);
  const [shown, setShown] = useState(0);
  const [auto, setAuto] = useState(true);
  const t = useRef(null);
  const cur = PHASES[phase];

  useEffect(() => {
    setShown(0);
    clearInterval(t.current);
    t.current = setInterval(() => setShown((n) => {
      if (n >= cur.lines.length) {
        clearInterval(t.current);
        if (auto) setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), 1600);
        return n;
      }
      return n + 1;
    }), 420);
    return () => clearInterval(t.current);
  }, [phase, auto, cur.lines.length]);

  return (
    <WidgetFrame file="computer_use.replay" status={cur.tag}>
      <div className="rounded-xl bg-paper/60 p-4">
        <div className="font-display text-lg font-bold">AI that drives legacy apps, safely</div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {PHASES.map((p, i) => (
            <button key={p.k} onClick={() => { setAuto(false); setPhase(i); }}
                    className={`rounded-lg border px-2 py-2 text-left transition ${i === phase ? 'border-blue bg-blue/15' : i < phase ? 'border-blue/30' : 'border-line hover:border-ink/30'}`}>
              <div className="font-mono text-[10px] text-mute">0{i + 1}</div>
              <div className="text-[13px] font-semibold">{p.t}</div>
            </button>
          ))}
        </div>
        <pre className="mt-3 h-[150px] overflow-hidden whitespace-pre-wrap rounded-lg border border-line bg-black/60 p-3 font-mono text-[11.5px] leading-[1.6] text-ink/85">
          {cur.lines.slice(0, shown).map((l) => (
            <div key={l} className={l.includes('✓') || l.includes('SUCCESS') ? 'text-mint' : l.startsWith('>') ? 'text-blue' : ''}>{l}</div>
          ))}
          <span className="inline-block h-3.5 w-[7px] translate-y-[2px] animate-blink bg-blue" />
        </pre>
        <p className="mt-3 text-[13px] leading-relaxed text-mute">
          An LLM discovers the workflow once and records a typed capability artifact; production replays it deterministically with no LLM in the loop, and pauses for a human on risky steps. Playwright + CDP · TypeScript and Python (Claude) versions.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[12.5px]">
          <a href="https://github.com/santosh1664/computer-use-automation-system" target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-3 py-1 hover:border-blue hover:text-blue">TypeScript repo ↗</a>
          <a href="https://github.com/santosh1664/interface-ai-assignment" target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-3 py-1 hover:border-blue hover:text-blue">Python + Claude repo ↗</a>
        </div>
      </div>
    </WidgetFrame>
  );
};

export default ComputerUseReplay;
