import React from 'react';
import SectionTitle from './SectionTitle.jsx';
import { projects } from '../data/portfolioData.jsx';
import { FaGithub, FaExternalLinkAlt, FaReact, FaDatabase, FaUniversalAccess, FaCode, FaComments } from 'react-icons/fa';
import { SiFirebase } from 'react-icons/si';
import { motion as Motion } from 'framer-motion';

// Map icon names to components
const projectIconMap = {
  FaUniversalAccess,
  FaReact,
  SiFirebase,
  FaDatabase,
  FaComments,
  FaCode,
};

const getProjectIcon = (iconName) => {
  const IconComponent = projectIconMap[iconName] || FaCode; // fallback to FaCode
  return <IconComponent size={24} className="text-accent-1" />;
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: i => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    },
  }),
};

const ProjectCard = ({ project, index }) => {
  return (
    <Motion.div
      className="relative bg-secondary-bg rounded-lg shadow-xl overflow-hidden flex flex-col h-full group transform hover:-translate-y-2 hover:bg-secondary-bg/80 hover:shadow-accent-1/10 transition-all transition-colors duration-300"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      custom={index}
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Hover light / glow background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(400px 200px at 10% 20%, rgba(16,185,129,0.10), rgba(99,102,241,0.06), transparent)'
        }}
      />
      {/* Bottom glow bar (like other sections) */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 transform -translate-x-1/2 bottom-4 w-3/4 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(16,185,129,0.85), rgba(99,102,241,0.65))',
          filter: 'blur(18px)',
        }}
      />
      {/* Optional: Add an image for each project */}
      {/* <img src={project.image || '/src/assets/project-bg-1.jpg'} alt={project.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/> */}
      <div className="p-6 flex flex-col flex-grow gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-xl sm:text-2xl font-semibold text-accent-1 font-mono">{project.title}</h3>
          {project.iconName && <div>{getProjectIcon(project.iconName)}</div>}
        </div>
        <p className="text-xs text-text-secondary font-mono">{project.date} | {project.category}</p>
        <p className="text-sm text-text-secondary leading-relaxed text-left">{project.description}</p>

        <div className="mt-auto pt-1">
          <h4 className="text-sm font-semibold text-text-primary font-mono mb-2">Tech Stack:</h4>
          <div className="flex flex-wrap gap-2 pb-1">
            {(project.tech || []).map((tech, i) => (
              <span key={i} className="text-xs bg-primary-bg text-accent-1 px-2 py-1 rounded-full font-mono">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-primary-bg">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-1 transition-colors flex items-center"
                aria-label={`GitHub repository for ${project.title}`}
              >
                <FaGithub size={20} className="mr-1" /> <span className="font-mono text-sm">Code</span>
              </a>
            )}
            {project.award && (
              <a
                href={project.award}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-1 transition-colors flex items-center"
                aria-label={`Certificate for ${project.title}`}
              >
                <FaExternalLinkAlt size={18} className="mr-1" /> <span className="font-mono text-sm">Certificate</span>
              </a>
            )}
            {project.liveLink2 && (
              <a
                href={project.liveLink2}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-1 transition-colors flex items-center"
                aria-label={`Live demo of ${project.title}`}
              >
                <FaExternalLinkAlt size={18} className="mr-1" /> <span className="font-mono text-sm">Demo</span>
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-1 transition-colors flex items-center"
                aria-label={`Live demo of ${project.title}`}
              >
                <FaExternalLinkAlt size={18} className="mr-1" /> <span className="font-mono text-sm">Live</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-primary-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle id="projects-title">My Creations</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
