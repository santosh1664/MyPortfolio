import React, { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import { personalInfo } from '../data/portfolioData.jsx';
import { askSantosh } from '../assistant/events.js';

const navItems = [
  { name: 'About', to: 'about' },
  { name: 'Stack', to: 'skills' },
  { name: 'Work', to: 'projects' },
  { name: 'Experience', to: 'experience' },
  { name: 'Contact', to: 'contact' },
];

const Logo = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
    <circle cx="4" cy="4" r="3" fill="#111" /><circle cx="18" cy="4" r="3" fill="#2B44FF" /><circle cx="11" cy="18" r="3" fill="#111" />
    <path d="M4 4 L18 4 L11 18" fill="none" stroke="#111" strokeWidth="1.4" />
  </svg>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const link = (item, onClick) => (
    <ScrollLink key={item.to} to={item.to} href={`#${item.to}`} smooth duration={600} offset={-72} spy activeClass="!text-ink !bg-ink/5"
                onClick={onClick} className="cursor-pointer rounded-full px-3 py-1.5 text-[14px] text-mute transition hover:text-ink">
      {item.name}
    </ScrollLink>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-4 transition-all duration-300 sm:px-5 ${scrolled ? 'border-line bg-card/85 shadow-[0_10px_30px_-20px_rgba(17,17,17,0.4)] backdrop-blur-md' : 'border-transparent'}`}>
        <ScrollLink to="hero" href="#hero" smooth duration={600} className="flex cursor-pointer items-center gap-2.5">
          <Logo />
          <span className="font-display text-[17px] font-bold tracking-tight">santosh<span className="text-blue">.</span>info</span>
        </ScrollLink>
        <div className="hidden items-center gap-1 md:flex">{navItems.map((i) => link(i))}</div>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => askSantosh()} className="flex items-center gap-2 rounded-full border border-ink/20 px-3.5 py-1.5 text-[13.5px] transition hover:border-blue hover:text-blue">
            Ask AI <kbd className="rounded bg-ink/5 px-1.5 font-mono text-[10.5px] text-mute">⌘K</kbd>
          </button>
          <a href={personalInfo.resumeLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-4 py-1.5 text-[13.5px] text-paper transition hover:bg-blue">Résumé</a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </nav>
      {open && (
        <div className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl border border-line bg-card p-3 md:hidden">
          {navItems.map((i) => link(i, () => setOpen(false)))}
          <div className="mt-2 flex gap-2">
            <button onClick={() => { setOpen(false); askSantosh(); }} className="flex-1 rounded-full border border-ink/20 py-2 text-sm">Ask AI</button>
            <a href={personalInfo.resumeLink} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-ink py-2 text-center text-sm text-paper">Résumé</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
