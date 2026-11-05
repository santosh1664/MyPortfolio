import React from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';

// Gentle fade-up as content enters the viewport.
const Reveal = ({ children, delay = 0, className = '' }) => {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <Motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Motion.div>
  );
};

export default Reveal;
