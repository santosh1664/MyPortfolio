import React, { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import { personalInfo } from '../data/portfolioData.jsx';

const navItems = [
  { name: 'Home', to: 'hero' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Experience', to: 'experience' },
  { name: 'Contact', to: 'contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const link = (item, onClick) => (
    <ScrollLink
      key={item.to}
      to={item.to}
      href={`#${item.to}`}
      smooth
      duration={600}
      offset={-64}
      spy
      activeClass="!text-bone"
      onClick={onClick}
      className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition hover:text-bone"
    >
      {item.name}
    </ScrollLink>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-line bg-ink/75 backdrop-blur-md' : ''}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <ScrollLink to="hero" href="#hero" smooth duration={600} className="flex cursor-pointer items-center gap-3">
          <span className="h-[2px] w-6 bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-bone">{personalInfo.name} G</span>
        </ScrollLink>
        <div className="hidden items-center gap-8 md:flex">{navItems.map((i) => link(i))}</div>
        <a href={personalInfo.resumeLink} target="_blank" rel="noopener noreferrer"
           className="hidden rounded-full border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone transition hover:border-accent hover:text-accent md:inline-flex">
          Résumé
        </a>
        <button className="text-bone md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </nav>
      {open && (
        <div className="flex flex-col gap-5 border-t border-line bg-ink/95 px-5 py-6 backdrop-blur-md md:hidden">
          {navItems.map((i) => link(i, () => setOpen(false)))}
          <a href={personalInfo.resumeLink} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Résumé ↗</a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
