import React from 'react';
import { FaAws, FaCheckCircle } from 'react-icons/fa';
import Tilt from './Tilt.jsx';
import SectionTitle from './SectionTitle.jsx';
import { certifications } from '../data/portfolioData.jsx';

const Certifications = () => (
  <section id="certifications" className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Tilt strength={0.6}>
        <SectionTitle id="certifications-title" index="05" kicker="Credentials">Certifications</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          {certifications.map((c) => (
            <div key={c.title} className="card relative overflow-hidden p-7">
              <FaAws className="absolute -right-4 -top-4 text-[9rem] text-white/[0.04]" aria-hidden />
              <div className="eyebrow">{c.issuer}</div>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-bone">{c.title}</h3>
              <dl className="mt-5 grid grid-cols-2 gap-4 font-mono text-[11px] text-mute">
                <div><dt className="uppercase tracking-[0.16em] text-bone/50">Issued</dt><dd className="mt-1">{c.issued}</dd></div>
                <div><dt className="uppercase tracking-[0.16em] text-bone/50">Expires</dt><dd className="mt-1">{c.expires}</dd></div>
                <div className="col-span-2"><dt className="uppercase tracking-[0.16em] text-bone/50">Validation ID</dt><dd className="mt-1 break-all">{c.validationId}</dd></div>
              </dl>
              <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer"
                 className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent hover:underline">
                <FaCheckCircle /> Verify credential
              </a>
            </div>
          ))}
        </div>
      </Tilt>
    </div>
  </section>
);

export default Certifications;
