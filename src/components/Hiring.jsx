import React from 'react';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import RoleFit from '../widgets/RoleFit.jsx';
import ImpactDiff from '../widgets/ImpactDiff.jsx';

// A section written for recruiters and hiring managers: role fit + measurable impact.
const Hiring = () => (
  <section id="hiring" className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionTitle id="hiring-title" index="00" file="for_hiring_managers/" aside="Pick the role you're hiring for to see the matching pitch, skills and proof. Every line comes from his résumé.">
        Hiring? Start here.
      </SectionTitle>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Reveal><RoleFit /></Reveal>
        <Reveal delay={0.1}><ImpactDiff /></Reveal>
      </div>
    </div>
  </section>
);

export default Hiring;
