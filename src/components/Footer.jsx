import React from 'react';
import { personalInfo } from '../data/portfolioData.jsx';

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row sm:px-8">
      <span className="eyebrow">© {new Date().getFullYear()} {personalInfo.name} G</span>
      <span className="eyebrow">Built with React · Tailwind · Framer Motion</span>
    </div>
  </footer>
);

export default Footer;
