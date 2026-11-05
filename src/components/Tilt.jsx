import React, { useRef } from 'react';
import { motion as Motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';

// Section wrapper: content starts tilted back in 3D and flattens as it scrolls into view.
const Tilt = ({ children, className = '', strength = 1 }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const rotateX = useTransform(p, [0, 1], [24 * strength, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const opacity = useTransform(p, [0, 0.6, 1], [0.25, 0.85, 1]);
  const y = useTransform(p, [0, 1], [60, 0]);

  if (reduce) return <div ref={ref} className={className}>{children}</div>;

  return (
    <div ref={ref} style={{ perspective: 1400 }} className={className}>
      <Motion.div style={{ rotateX, scale, opacity, y, transformOrigin: 'center top', willChange: 'transform' }}>
        {children}
      </Motion.div>
    </div>
  );
};

export default Tilt;
