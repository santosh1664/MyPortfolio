import React from 'react';
import Reveal from './Reveal.jsx';
import SectionTitle from './SectionTitle.jsx';
import ImpactDiff from '../widgets/ImpactDiff.jsx';

// Measurable results, before → after.
const Hiring = () => (
  <section id="impact" className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionTitle id="impact-title" index="00" file="impact.diff" aside="Before and after, from his résumé. Every number is a measured outcome, not an estimate.">
        Impact, measured.
      </SectionTitle>
      <Reveal><ImpactDiff /></Reveal>
    </div>
  </section>
);

export default Hiring;
