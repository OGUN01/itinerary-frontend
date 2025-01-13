'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const images = [
  {
    src: '/images/hero/adventure-1.jpg', // Mountain landscape
    alt: 'Majestic mountain peaks at sunset',
    className: 'col-span-6 md:col-span-5 row-span-3',
    priority: true
  },
  {
    src: '/images/hero/adventure-2.jpg', // Venice canal
    alt: 'Beautiful Venice canal at dusk',
    className: 'col-span-6 md:col-span-4 row-span-2',
    priority: true
  },
  {
    src: '/images/hero/adventure-3.jpg', // Desert road
    alt: 'Scenic desert road journey',
    className: 'col-span-4 md:col-span-3 row-span-2',
    priority: false
  },
  {
    src: '/images/hero/adventure-8.jpg', // Japanese temple
    alt: 'Traditional Japanese temple',
    className: 'col-span-4 md:col-span-3 row-span-2',
    priority: false
  },
  {
    src: '/images/hero/adventure-4.jpg', // Tropical beach
    alt: 'Tropical beach paradise',
    className: 'col-span-4 md:col-span-3 row-span-2',
    priority: false
  },
  {
    src: '/images/hero/adventure-7.jpg', // Northern lights
    alt: 'Northern lights over mountains',
    className: 'col-span-8 md:col-span-4 row-span-2',
    priority: false
  },
  {
    src: '/images/hero/adventure-5.jpg', // Ancient temple
    alt: 'Ancient temple at dawn',
    className: 'col-span-6 md:col-span-3 row-span-2',
    priority: false
  },
  {
    src: '/images/hero/adventure-6.jpg', // Safari landscape
    alt: 'Desert safari adventure',
    className: 'col-span-6 md:col-span-3 row-span-2',
    priority: false
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const HeroBackground = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      return newSet;
    });
  };

  const handleImageError = (src: string) => {
    console.error(`Failed to load image: ${src}`);
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(src);
      return newSet;
    });
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gray-900">
      {/* Image Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-2 md:gap-3 h-full p-3 md:p-4"
      >
        {images.map((image, index) => (
          <motion.div
            key={image.src}
            variants={itemVariants}
            className={`relative overflow-hidden rounded-xl shadow-lg ${image.className} ${
              failedImages.has(image.src) ? 'bg-gray-800' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover transition-opacity duration-700 ${
                loadedImages.has(image.src) ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={image.priority}
              quality={90}
              onLoad={() => handleImageLoad(image.src)}
              onError={() => handleImageError(image.src)}
            />
            {failedImages.has(image.src) && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-sm">Image unavailable</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
    </div>
  );
}; 