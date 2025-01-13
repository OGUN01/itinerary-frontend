
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const HeroContent = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-8"
    >
      <motion.span
        variants={itemVariants}
        className="text-sm md:text-base font-medium text-emerald-400 uppercase tracking-wider mb-4"
      >
        Your Next Adventure Awaits
      </motion.span>
      
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
      >
        Discover the World&apos;s
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500">
          Hidden Treasures
        </span>
      </motion.h1>
      
      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
      >
        Create personalized travel itineraries powered by AI. Experience seamless planning
        for unforgettable journeys across the globe.
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto"
      >
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto flex-1 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
        >
          Start Planning
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto flex-1 border-white/20 hover:bg-white/10"
        >
          Learn More
        </Button>
      </motion.div>
    </motion.div>
  );
}; 
