'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const AnimatedBackground: React.FC = () => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      const diagonal = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
      setSize({ width: diagonal, height: diagonal });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useGSAP(() => {
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        rotate: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        ref={gradientRef}
        className="absolute bg-gradient-light dark:bg-gradient-dark"
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          left: `${(window.innerWidth - size.width) / 2}px`,
          top: `${(window.innerHeight - size.height) / 2}px`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;