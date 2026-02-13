import React from 'react';
import SectionTitle from './SectionTitle.jsx';
import { experience } from '../data/portfolioData.jsx';
import { motion as Motion } from 'framer-motion';

const experienceItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const Experience = () => (
  <section id="experience" className="py-20 bg-secondary-bg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle id="experience-title">Experience</SectionTitle>

      <div className="max-w-5xl mx-auto mt-12 space-y-8">
        {experience.map((item, index) => (
          <Motion.div
            key={`${item.company}-${item.role}`}
            className="p-5 sm:p-6 bg-primary-bg rounded-lg shadow-xl hover:shadow-accent-1/20 transition-shadow duration-300"
            custom={index}
            variants={experienceItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-md sm:text-lg lg:text-xl font-semibold text-accent-1 font-mono">
                  {item.role}
                </h3>
                <p className="text-sm sm:text-md text-accent-2/90 font-semibold">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ''}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary/80 font-mono">
                {item.duration}
              </p>
            </div>

            {item.points?.length ? (
              <ul className="list-disc list-inside space-y-1.5 text-text-secondary mt-3">
                {item.points.map((point, i) => (
                  <li key={`${item.company}-${i}`} className="text-xs sm:text-sm leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}

            {item.tech?.length ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tech.map((tech) => (
                  <span
                    key={`${item.company}-${tech}`}
                    className="px-3 py-1 text-xs font-mono rounded-full bg-secondary-bg text-accent-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </Motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
