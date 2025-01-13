'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button/Button';
import { HeroBackground } from '@/components/hero/HeroBackground';
import { FeaturesSection } from '@/components/features/FeaturesSection';
import { Footer } from '@/components/common/Footer';
import { getSafeFeatures } from '@/utils/featureFlags';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = getSafeFeatures();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const HeroSection = () => {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <HeroBackground />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Plan Your Perfect Trip
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us help you create unforgettable travel experiences with personalized itineraries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/trip-planner">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                  withAnimation={features.enableAnimations}
                >
                  Start Planning
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  withAnimation={features.enableAnimations}
                >
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
