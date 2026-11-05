import React from 'react';
import { personalInfo } from '../data/portfolioData.jsx';

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-[13px] text-mute sm:flex-row sm:px-8">
      <span>© {new Date().getFullYear()} {personalInfo.name} G · Dallas, TX</span>
      <span className="font-mono text-[12px]">built with React · Tailwind · Framer Motion · an in-browser AI assistant</span>
    </div>
  </footer>
);

export default Footer;
