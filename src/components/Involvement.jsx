import React from 'react';
import Tilt from './Tilt.jsx';
import SectionTitle from './SectionTitle.jsx';
import { leadershipAndInvolvement } from '../data/portfolioData.jsx';

const Involvement = () => (
  <section id="involvement" className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Tilt strength={0.6}>
        <SectionTitle id="involvement-title" index="06" kicker="Beyond code">Leadership</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          {leadershipAndInvolvement.map((x) => (
            <div key={x.role} className="card p-7">
              <h3 className="font-display text-xl font-bold tracking-tight text-bone">{x.role}</h3>
              <p className="mt-2 text-sm text-mute">{x.organization}</p>
              <ul className="mt-5 space-y-2.5">
                {x.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm leading-relaxed text-mute">
                    <span className="mt-2 h-px w-4 shrink-0 bg-accent" />{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Tilt>
    </div>
  </section>
);

export default Involvement;
