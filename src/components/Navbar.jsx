import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { personalInfo } from '../data/portfolioData.jsx';
import { FaBars, FaTimes, FaSun, FaMoon, FaUsers, FaCertificate } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';

const navItems = [
  { name: 'Home', to: 'hero' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Certifications', to: 'certifications'},
  { name: 'Experience', to: 'experience' },
  { name: 'Involvement', to: 'involvement'},
  { name: 'Contact', to: 'contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-secondary-bg shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          className="text-2xl font-bold font-mono text-accent-1 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {personalInfo.name}
          {/* <span className="text-text-primary">.</span> */}
        </ScrollLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              smooth={true}
              duration={500}
              offset={-70} // Adjust offset based on navbar height
              className="text-text-secondary hover:text-accent-1 font-mono transition-colors cursor-pointer flex items-center gap-2"
              activeClass="text-accent-1"
              spy={true}
            >
              {item.icon ? <item.icon className="text-sm" /> : null}
              {item.name}
            </ScrollLink>
          ))}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 px-3 py-2 font-mono text-sm border-2 border-accent-1 text-accent-1 rounded hover:bg-accent-1 hover:text-primary-bg transition-all duration-300"
            aria-label="Toggle color theme"
            type="button"
          >
            {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
            <span className="hidden lg:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <a
            href={personalInfo.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 font-mono border-2 border-accent-1 text-accent-1 rounded hover:bg-accent-1 hover:text-primary-bg transition-all duration-300"
          >
            Resume
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-accent-1 focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-secondary-bg mt-2 py-2"
        >
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              smooth={true}
              duration={500}
              offset={-70}
              className="block px-4 py-3 text-text-secondary hover:text-accent-1 hover:bg-primary-bg font-mono transition-colors cursor-pointer"
              activeClass="text-accent-1 bg-primary-bg"
              spy={true}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">
                {item.icon ? <item.icon className="text-sm" /> : null}
                {item.name}
              </span>
            </ScrollLink>
          ))}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex-1 mr-3 flex items-center justify-center gap-2 px-4 py-2 font-mono border-2 border-accent-1 text-accent-1 rounded hover:bg-accent-1 hover:text-primary-bg transition-all duration-300"
              aria-label="Toggle color theme"
              type="button"
            >
              {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <a
              href={personalInfo.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 ml-3 text-center px-4 py-2 font-mono border-2 border-accent-1 text-accent-1 rounded hover:bg-accent-1 hover:text-primary-bg transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Resume
            </a>
          </div>
        </Motion.div>
      )}
    </Motion.nav>
  );
};

export default Navbar;
