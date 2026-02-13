import React from 'react';
import SectionTitle from './SectionTitle.jsx';
import { certifications } from '../data/portfolioData.jsx';
import { motion as Motion } from 'framer-motion';

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

const Certifications = () => (
  <section id="certifications" className="py-20 bg-primary-bg">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle id="certifications-title">Certifications</SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {certifications.map((cert, index) => (
          <Motion.div
            key={cert.title}
            className="bg-secondary-bg rounded-lg shadow-xl overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true, amount: 0.2 }}
          >
            {cert.image ? (
              <img
                src={cert.image}
                alt={`${cert.title} certificate`}
                className="w-full h-auto object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold text-accent-1 font-mono">
                {cert.title}
              </h3>
              <p className="text-text-secondary">{cert.issuer}</p>
              <div className="text-sm text-text-secondary font-mono space-y-1">
                <p>Issued: {cert.issued}</p>
                <p>Expires: {cert.expires}</p>
                <p>Validation ID: {cert.validationId}</p>
              </div>
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent-1 hover:underline font-mono text-sm"
              >
                Verify Certification
              </a>
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Certifications;
