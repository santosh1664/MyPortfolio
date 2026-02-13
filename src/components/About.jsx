import React from 'react';
import SectionTitle from './SectionTitle.jsx';
import { education } from '../data/portfolioData.jsx';
import { motion as Motion } from 'framer-motion';
import { FaUniversity, FaSchool } from 'react-icons/fa'; // Example icons

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const About = () => {
  return (
    <section id="about" className="py-20 bg-secondary-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle id="about-title">About Me</SectionTitle>
        
        <Motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg text-text-secondary leading-relaxed">
           Hi, I'm Durgasantosh — a software engineer skilled in building scalable, user-focused applications. I love solving real-world problems through technology and thrive in collaborative, fast-paced environments.
          </p>
          {/* <p className="text-lg text-text-secondary leading-relaxed mt-4">
            Outside of code, you'll find me shooting photos—capturing street scenes, candid moments, and campus life, then polishing them in Lightroom. It's my way to stay curious about composition, light, and storytelling.
          </p> */}
        </Motion.div>

        <h3 className="text-2xl font-semibold text-center text-accent-1 mb-8 font-mono">Education</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center justify-center">
          {education.map((edu, index) => (
            <Motion.div
              key={index}
              className="w-full max-w-sm bg-primary-bg p-6 rounded-lg shadow-xl hover:shadow-accent-1/20 transition-shadow duration-300"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-center mb-3">
                {edu.institution.toLowerCase().includes("university") ? 
                  <FaUniversity className="text-accent-1 mr-3 text-2xl" /> : 
                  <FaSchool className="text-accent-1 mr-3 text-2xl" />
                }
                <h4 className="text-xl font-semibold text-text-primary">{edu.institution}</h4>
              </div>
              <p className="text-text-secondary font-medium">{edu.degree}</p>
              <p className="text-sm text-text-secondary font-mono">{edu.duration}</p>
              <p className="text-sm text-accent-1 font-mono mt-1">{edu.score}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
