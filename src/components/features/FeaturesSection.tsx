'use client';

import { motion } from 'framer-motion';
import { GlobeAltIcon, MapIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: GlobeAltIcon,
    title: 'Discover Hidden Wonders',
    description: 'From ancient temples to untouched beaches, uncover the world\'s most extraordinary destinations.',
    image: '/images/hero/adventure-2.jpg' as string,
    gradient: 'from-sky-400/80 to-blue-900/80',
    link: '/trip-planner'
  },
  {
    icon: MapIcon,
    title: 'Personalized Journeys',
    description: 'Your adventure, your way. AI-crafted itineraries that adapt to your unique travel style.',
    image: '/images/hero/adventure-3.jpg' as string,
    gradient: 'from-amber-400/80 to-orange-900/80',
    link: '/trip-planner'
  },
  {
    icon: SparklesIcon,
    title: 'Local Experiences',
    description: 'Immerse yourself in authentic local culture with curated experiences and hidden gems.',
    image: '/images/hero/adventure-8.jpg' as string,
    gradient: 'from-emerald-400/80 to-teal-900/80',
    link: '/trip-planner'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const FeaturesSection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gray-900">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Dark Textured Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a365d_0%,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#042f2e_0%,transparent_50%)] opacity-40" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-20" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-20"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                Your Journey
              </span>
              <span className="text-white"> Begins Here</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Experience travel reimagined through the perfect blend of technology and wanderlust.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} href={feature.link}>
                <motion.div
                  variants={itemVariants}
                  className="relative group h-[400px] md:h-[500px] cursor-pointer"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-end transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-xl">
                      <div className="inline-flex p-3 rounded-lg bg-white/10 backdrop-blur-sm mb-4 ring-1 ring-white/20">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-200">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 group-hover:ring-2 group-hover:ring-sky-400/50 transition-all duration-300 shadow-lg group-hover:shadow-sky-400/20" />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <Link href="/trip-planner">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-sky-500/25 transition-all duration-300"
              >
                Start Planning Your Adventure
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 