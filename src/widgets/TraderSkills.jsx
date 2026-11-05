import React, { useEffect, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import WidgetFrame from './WidgetFrame.jsx';

// Angel One Trader: 11 Claude agent skills that hand off to each other, with a human approval gate.
const SKILLS = [
  { k: 'scanner', d: 'Scans hundreds of NSE charts for setups (opening-range breakouts, flags, oversold bounces) and builds the watchlist.' },
  { k: 'news', d: 'NSE corporate announcements, upcoming results board meetings, headlines and today\'s move for every stock on the list.' },
  { k: 'entry', d: 'Watches the setup bar by bar and triggers on a 5-minute close above the opening range or a chosen level.' },
  { k: 'exit', d: 'Plans the stop and target before entry (range, %, price or ATR), tick-rounded, flat by 15:00.' },
  { k: 'timemachine', d: '10,000 replays from the stock\'s own 5-minute bars, plus the same rule re-run on every past session, before risking a rupee.' },
  { k: 'budget', d: 'Sizes whole shares inside the max loss per trade including charges, with a position cap and cash buffer.' },
  { k: 'risk', d: 'PASS / BLOCK on stop, max loss, reward:risk, daily loss limit, trades per day, entry window and duplicates.' },
  { k: 'broker', d: 'Paper trades by default; sends to Angel One only after the user\'s explicit yes, with the stop-loss placed at the broker.', gate: true },
  { k: 'alerts', d: 'Manages the open trade with price, stop, target and flat-by-close alerts that ring once.', side: true },
  { k: 'analyst', d: 'Reads quarterly results filed with NSE and lines up revenue, margins and profit, quarter over quarter.', side: true },
  { k: 'insider', d: 'Promoter and director buys and sells disclosed under SEBI PIT, alerting once per filing.', side: true },
];
const MAIN = SKILLS.filter((s) => !s.side);
const SIDE = SKILLS.filter((s) => s.side);

const TraderSkills = () => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (reduce || hold) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % SKILLS.length), 2000);
    return () => clearInterval(t);
  }, [reduce, hold]);
  const cur = SKILLS[i];

  return (
    <WidgetFrame file="angel_one_trader.skills" status="paper mode">
      <div className="rounded-xl bg-paper/60 p-4 sm:p-5" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="font-display text-lg font-bold">11 Claude agent skills that trade like a team</div>
            <div className="text-[13px] text-mute">Angel One SmartAPI · NSE intraday · standard-library Python · Claude Code plugin</div>
          </div>
          <a href="https://github.com/santosh1664/Angle-agent-skills" target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-3 py-1 text-[12.5px] hover:border-blue hover:text-blue">GitHub ↗</a>
        </div>
        {[['one trade', MAIN], ['alongside', SIDE]].map(([lane, list]) => (
          <div key={lane} className="mt-4">
            <div className="label mb-1.5">{lane}</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {list.map((s, n) => {
                const idx = SKILLS.indexOf(s);
                return (
                  <React.Fragment key={s.k}>
                    <button onClick={() => setI(idx)} onMouseEnter={() => setI(idx)}
                            className={`rounded-lg border px-2.5 py-1.5 font-mono text-[12px] transition ${idx === i ? 'border-blue bg-blue text-white shadow-[0_8px_24px_-8px_rgba(76,107,255,0.9)]' : 'border-line text-mute hover:text-ink'} ${s.gate && idx !== i ? 'border-mint/50 text-mint' : ''}`}>
                      {s.k}{s.gate && <span className="ml-1.5 rounded bg-mint/20 px-1 text-[9.5px] uppercase tracking-wide text-mint">human ok</span>}
                    </button>
                    {lane === 'one trade' && n < list.length - 1 && <span className="text-[10px] text-mute">→</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
        <Motion.div key={cur.k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    className="mt-4 flex gap-3 rounded-lg border border-blue/30 bg-blue/10 px-4 py-3">
          <span className="font-mono text-[12px] text-blue">/{cur.k}</span>
          <p className="text-[13.5px] leading-relaxed text-ink/85">{cur.d}</p>
        </Motion.div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[['11', 'agent skills'], ['10,000', 'simulated replays per trade'], ['Paper', 'by default · human yes to go live']].map(([k, v]) => (
            <div key={v} className="rounded-lg border border-line px-2 py-3">
              <div className="font-display text-xl font-bold text-ink">{k}</div>
              <div className="text-[11.5px] leading-snug text-mute">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </WidgetFrame>
  );
};

export default TraderSkills;
