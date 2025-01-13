'use client';

import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';

export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="absolute inset-0">
        <HeroContent />
      </div>
    </section>
  );
}; 