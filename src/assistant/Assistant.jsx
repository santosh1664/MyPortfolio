import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { FaArrowUp, FaTimes, FaRegCopy, FaCheck, FaBriefcase, FaComments, FaRedo } from 'react-icons/fa';
import { answer, fitCheck, STARTERS, recruiterSummary, ME } from './engine.js';

// Opened from anywhere via askSantosh() in ./events.js

// ---- tiny, safe markdown: **bold**, _italic_, `code`, [text](url), "- " bullets ----
const inline = (s, key) => {
  const out = [];
  const re = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0; let m; let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) out.push(<strong key={`${key}-${i++}`} className="font-semibold text-bone">{t.slice(2, -2)}</strong>);
    else if (t.startsWith('_')) out.push(<em key={`${key}-${i++}`} className="not-italic text-mute/80 text-[12px]">{t.slice(1, -1)}</em>);
    else if (t.startsWith('`')) out.push(<code key={`${key}-${i++}`} className="rounded bg-white/10 px-1 font-mono text-[11px]">{t.slice(1, -1)}</code>);
    else {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/);
      out.push(<a key={`${key}-${i++}`} href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">{label}</a>);
    }
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
};

const Rich = ({ text }) => {
  const blocks = text.split(/\n\n+/);
  return blocks.map((b, bi) => {
    // group consecutive "- " lines into lists, everything else into paragraphs
    const groups = [];
    b.split('\n').forEach((l) => {
      const isLi = l.startsWith('- ');
      const g = groups[groups.length - 1];
      if (g && g.list === isLi) g.lines.push(l); else groups.push({ list: isLi, lines: [l] });
    });
    return (
      <div key={bi} className="my-2 first:mt-0 last:mb-0">
        {groups.map((g, gi) => (g.list ? (
          <ul key={gi} className="my-1.5 space-y-1.5">
            {g.lines.map((l, li) => (
              <li key={li} className="flex gap-2"><span className="mt-[9px] h-px w-3 shrink-0 bg-accent" /><span>{inline(l.slice(2), `${bi}-${gi}-${li}`)}</span></li>
            ))}
          </ul>
        ) : (
          <p key={gi}>{g.lines.map((l, li) => <React.Fragment key={li}>{li > 0 && <br />}{inline(l, `${bi}-${gi}-${li}`)}</React.Fragment>)}</p>
        )))}
      </div>
    );
  });
};

const ScoreRing = ({ score }) => {
  const r = 26; const c = 2 * Math.PI * r;
  return (
    <div className="relative mb-2 flex items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
        <circle cx="32" cy="32" r={r} stroke="#ff2d55" strokeWidth="6" fill="none" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center font-display text-lg font-bold text-bone">{score}%</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">Job fit score</div>
    </div>
  );
};

const Assistant = () => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('chat');
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [jd, setJd] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timer = useRef(null);

  const scrollDown = () => requestAnimationFrame(() => {
    const el = listRef.current; if (!el) return;
    const bots = el.querySelectorAll('[data-bot]');
    const lastBot = bots[bots.length - 1];
    const target = el.scrollHeight - el.clientHeight;
    if (lastBot && lastBot.offsetTop - 12 < target) el.scrollTop = Math.min(target, lastBot.offsetTop - 12 - (lastBot.previousElementSibling?.offsetHeight || 0) - 16);
    else el.scrollTop = target;
  });

  const respond = useCallback((q, res) => {
    setBusy(true);
    const id = Date.now();
    setMsgs((m) => [...m, ...(q ? [{ id: id - 1, role: 'user', text: q }] : []), { id, role: 'bot', text: '', full: res.text, follow: res.follow, score: res.score ?? null, done: false }]);
    scrollDown();
    const full = res.text;
    if (reduce) {
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: full, done: true } : x)));
      setBusy(false); scrollDown(); return;
    }
    let i = 0;
    const step = Math.max(3, Math.round(full.length / 90));
    clearInterval(timer.current);
    setTimeout(() => {
      timer.current = setInterval(() => {
        i = Math.min(full.length, i + step);
        setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: full.slice(0, i), done: i >= full.length } : x)));
        scrollDown();
        if (i >= full.length) { clearInterval(timer.current); setBusy(false); }
      }, 16);
    }, 380);
  }, [reduce]);

  const ask = useCallback((q) => {
    const text = q.trim();
    if (!text || busy) return;
    if (/check fit|job fit|paste a job/i.test(text)) { setMode('fit'); return; }
    respond(text, answer(text));
    setInput('');
  }, [busy, respond]);

  const runFit = () => {
    if (!jd.trim() || busy) return;
    setMode('chat');
    respond('Here is a job description — how well does he fit?', fitCheck(jd));
    setJd('');
  };

  // greet once on first open
  useEffect(() => {
    if (open && msgs.length === 0) respond('', answer('hi'));
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // global open event + keyboard shortcut
  useEffect(() => {
    const onAsk = (e) => {
      const { q, mode: m } = e.detail || {};
      setOpen(true);
      if (m === 'fit') setMode('fit');
      else if (q) { setMode('chat'); setTimeout(() => ask(q), msgs.length ? 0 : 1300); }
    };
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('ask-santosh', onAsk);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('ask-santosh', onAsk); window.removeEventListener('keydown', onKey); };
  }, [ask, msgs.length]);

  useEffect(() => () => clearInterval(timer.current), []);

  const copySummary = async () => {
    try { await navigator.clipboard.writeText(recruiterSummary()); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };

  const reset = () => { clearInterval(timer.current); setBusy(false); setMsgs([]); setTimeout(() => respond('', answer('hi')), 50); };

  const last = msgs[msgs.length - 1];

  return (
    <>
      {/* launcher */}
      <AnimatePresence>
        {!open && (
          <Motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            onClick={() => setOpen(true)}
            className="group fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-white/15 bg-panel/90 py-2 pl-2 pr-5 shadow-[0_20px_60px_-15px_rgba(255,45,85,0.55)] backdrop-blur-md transition hover:border-accent"
            aria-label={`Open ${ME}'s assistant`}>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
              DG<span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-panel bg-emerald-400" />
            </span>
            <span className="text-left">
              <span className="block font-display text-sm font-semibold text-bone">Ask about {ME}</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-mute">AI assistant · ⌘K</span>
            </span>
          </Motion.button>
        )}
      </AnimatePresence>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <Motion.section
            role="dialog" aria-label={`${ME}'s assistant`}
            initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed inset-x-3 bottom-3 top-16 z-[60] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d11]/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:top-auto sm:bottom-5 sm:h-[min(680px,calc(100vh-40px))] sm:w-[420px]">
            {/* header */}
            <header className="relative border-b border-white/10 px-5 pb-3 pt-4">
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
                  DG<span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#0d0d11] bg-emerald-400" />
                </span>
                <div className="flex-1">
                  <div className="font-display text-[15px] font-semibold text-bone">{ME}'s assistant</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Answers from his real résumé</div>
                </div>
                <button onClick={copySummary} className="rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-bone" title="Copy recruiter summary" aria-label="Copy recruiter summary">
                  {copied ? <FaCheck className="text-emerald-400" /> : <FaRegCopy />}
                </button>
                <button onClick={reset} className="rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-bone" title="New conversation" aria-label="New conversation"><FaRedo size={12} /></button>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 text-mute transition hover:bg-white/5 hover:text-bone" aria-label="Close"><FaTimes /></button>
              </div>
              <div className="relative mt-3 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
                {[['chat', 'Chat', FaComments], ['fit', 'Job fit check', FaBriefcase]].map(([k, label, I]) => (
                  <button key={k} onClick={() => setMode(k)}
                          className={`flex items-center justify-center gap-2 rounded-full py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition ${mode === k ? 'bg-bone text-ink' : 'text-mute hover:text-bone'}`}>
                    {React.createElement(I, { size: 11 })} {label}
                  </button>
                ))}
              </div>
              {copied && <div className="relative mt-2 text-center font-mono text-[10px] text-emerald-400">Recruiter summary copied to clipboard</div>}
            </header>

            {mode === 'chat' ? (
              <>
                <div ref={listRef} className="relative flex-1 space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:thin]" aria-live="polite">
                  {msgs.map((m) => (m.role === 'user' ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-bone px-4 py-2.5 text-[13.5px] leading-relaxed text-ink">{m.text}</div>
                    </div>
                  ) : (
                    <div key={m.id} data-bot className="flex gap-2.5">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-[9px] font-bold text-accent">DG</span>
                      <div className="min-w-0 max-w-[88%]">
                        <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-[13.5px] leading-relaxed text-bone/85">
                          {m.score != null && <ScoreRing score={m.score} />}
                          {m.text ? <Rich text={m.text} /> : (
                            <span className="flex gap-1 py-1" aria-label="typing">
                              {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-mute" style={{ animationDelay: `${d * 120}ms` }} />)}
                            </span>
                          )}
                        </div>
                        {m.done && m === last && m.follow?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {m.follow.map((f) => (
                              <button key={f} onClick={() => ask(f)}
                                      className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-bone/75 transition hover:border-accent hover:text-bone">{f}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )))}
                  {msgs.length <= 1 && last?.done && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {STARTERS.map((s) => (
                        <button key={s} onClick={() => ask(s)}
                                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-[12.5px] leading-snug text-bone/80 transition hover:border-accent/60 hover:bg-white/[0.05]">{s}</button>
                      ))}
                    </div>
                  )}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="border-t border-white/10 p-3">
                  <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 pl-4 focus-within:border-accent/60">
                    <textarea ref={inputRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); } }}
                              placeholder={`Ask anything about ${ME}…`}
                              className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[13.5px] text-bone placeholder:text-mute focus:outline-none" />
                    <button type="submit" disabled={!input.trim() || busy} aria-label="Send"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white transition disabled:opacity-30"><FaArrowUp size={13} /></button>
                  </div>
                  <p className="mt-2 text-center font-mono text-[9.5px] uppercase tracking-[0.14em] text-mute/70">Tip: paste a full job description to get a fit score</p>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-bold tracking-tight text-bone">Is {ME} a fit for your role?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-mute">Paste a job description. You'll get a match score, the skills he has and doesn't have, and the parts of his experience that back it up. Gaps are shown honestly, not hidden.</p>
                <textarea value={jd} onChange={(e) => setJd(e.target.value)}
                          placeholder="Paste the job description here…"
                          className="mt-4 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[13px] leading-relaxed text-bone placeholder:text-mute focus:border-accent/60 focus:outline-none" />
                <button onClick={runFit} disabled={jd.trim().length < 40 || busy}
                        className="mt-3 flex items-center justify-center gap-2 rounded-full bg-bone py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:bg-white disabled:opacity-30">
                  <FaBriefcase /> Check fit
                </button>
              </div>
            )}
          </Motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default Assistant;
