import React from 'react';
import SectionTitle from './SectionTitle.jsx';
import { skills } from '../data/portfolioData.jsx';
import { motion as Motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaCode, FaHtml5, FaCss3Alt, FaWordpress, FaPython, FaJava, FaCloud, FaProjectDiagram, FaAws, FaDocker, FaGitAlt, FaLinux, FaWindows, FaLightbulb, FaSitemap, FaPlug, FaUsers, FaRunning, FaComments, FaChalkboardTeacher, FaEye, FaLanguage, FaCogs, FaStream } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiFirebase, SiTailwindcss, SiJavascript, SiCplusplus, SiTypescript, SiGo, SiMysql, SiPostgresql, SiAmazondynamodb, SiSpringboot, SiNextdotjs, SiFlask, SiDjango, SiGooglecloud, SiKubernetes, SiGithubactions, SiJenkins, SiTerraform, SiGnubash, SiJira, SiPostman, SiVscodium, SiIntellijidea, SiTensorflow, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiApachekafka, SiApachespark } from 'react-icons/si';

// Map icon names to components
const iconMap = {
  FaReact,
  FaJava,
  
  FaPython,
  FaNodeJs,
  SiAmazondynamodb,
  FaDatabase,
  FaCode,
  FaCloud,
  FaProjectDiagram,
  FaAws,
  FaDocker,
  FaGitAlt,
  FaLinux,
  FaWindows,
  FaLightbulb,
  FaSitemap,
  FaPlug,
  FaUsers,
  FaRunning,
  FaComments,
  FaChalkboardTeacher,
  FaEye,
  FaLanguage,
  FaCogs,
  FaStream,
  FaHtml5,
  FaCss3Alt,
  FaWordpress,
  SiSpringboot,
  SiNextdotjs,
  SiFlask,
  SiDjango,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiTailwindcss,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiGo,
  SiMysql,
  SiPostgresql,
  SiGooglecloud,
  SiKubernetes,
  SiGithubactions,
  SiJenkins,
  SiTerraform,
  SiGnubash,
  SiJira,
  SiPostman,
  SiVscodium,
  SiIntellijidea,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiApachekafka,
  SiApachespark,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={28} className="text-accent-1" /> : null;
};

const skillCategoryVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { staggerChildren: 0.1, duration: 0.5 }
  },
};

const skillItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SkillCard = ({ name, iconName }) => (
  <Motion.div
    variants={skillItemVariants}
    className="flex flex-col items-center p-4 bg-secondary-bg rounded-lg shadow-md hover:shadow-accent-1/10 transition-shadow duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="text-accent-1 text-3xl mb-2">{getIcon(iconName)}</div>
    <span className="text-text-primary text-sm font-mono text-center">{name}</span>
  </Motion.div>
);

const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-primary-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle id="skills-title">My Tech Arsenal</SectionTitle>
        
        <div className="space-y-12">
          {/* Languages */}
          <Motion.div variants={skillCategoryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-2xl font-semibold text-accent-2 mb-6 font-mono text-center sm:text-left">Languages & Databases</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.languages.map((skill, index) => (
                <SkillCard key={index} name={skill.name} iconName={skill.iconName} />
              ))}
            </div>
          </Motion.div>

          {/* Frameworks & Libraries */}
          <Motion.div variants={skillCategoryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-2xl font-semibold text-accent-2 mb-6 font-mono text-center sm:text-left">Frameworks & Libraries</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.frameworksAndLibraries.map((skill, index) => (
                <SkillCard key={index} name={skill.name} iconName={skill.iconName} />
              ))}
            </div>
          </Motion.div>
                    {/* Tools & Platforms */}
          <Motion.div variants={skillCategoryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-2xl font-semibold text-accent-2 mb-6 font-mono text-center sm:text-left">AI/ML & Data Engineering</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.aiAndDataEngineering.map((skill, index) => (
                <SkillCard key={index} name={skill.name} iconName={skill.iconName} />
              ))}
            </div>
          </Motion.div>

          {/* Tools & Platforms */}
          <Motion.div variants={skillCategoryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-2xl font-semibold text-accent-2 mb-6 font-mono text-center sm:text-left">Tools & Platforms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {skills.toolsAndPlatforms.map((skill, index) => (
                <SkillCard key={index} name={skill.name} iconName={skill.iconName} />
              ))}
            </div>
          </Motion.div>

          {/* Core Competencies */}
          <Motion.div variants={skillCategoryVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h3 className="text-2xl font-semibold text-accent-2 mb-6 font-mono text-center sm:text-left">Core Competencies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {skills.coreCompetencies.map((competency, index) => (
                <Motion.div
                  key={index}
                  variants={skillItemVariants}
                  className="flex items-center gap-3 bg-secondary-bg text-text-secondary p-4 rounded-lg text-sm font-mono shadow-md hover:bg-secondary-bg/80 hover:shadow-accent-1/10 transition-shadow transition-colors duration-300"
                  whileHover={{ y: -5 }}
                >
                  <span className="text-accent-1 text-xl">{getIcon(competency.iconName)}</span>
                  <span className="leading-snug">{competency.name}</span>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
