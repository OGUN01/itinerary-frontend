'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapIcon, 
  GlobeAltIcon,
  HeartIcon,
  // Social icons from Heroicons
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  RssIcon,
  LinkIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { 
      name: 'Twitter', 
      href: 'https://twitter.com',
      icon: ChatBubbleLeftEllipsisIcon,
      hoverColor: 'hover:text-[#1DA1F2]'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com',
      icon: UserGroupIcon,
      hoverColor: 'hover:text-[#E4405F]'
    },
    { 
      name: 'Facebook', 
      href: 'https://facebook.com',
      icon: RssIcon,
      hoverColor: 'hover:text-[#1877F2]'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com',
      icon: LinkIcon,
      hoverColor: 'hover:text-[#0A66C2]'
    },
    { 
      name: 'YouTube', 
      href: 'https://youtube.com',
      icon: VideoCameraIcon,
      hoverColor: 'hover:text-[#FF0000]'
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-4">
            <Link href="/" className="inline-flex items-center space-x-2">
              <GlobeAltIcon className="w-8 h-8 text-sky-400" />
              <span className="text-xl font-bold text-white">TravelAI</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Embark on extraordinary journeys with AI-powered travel planning that turns your dreams into unforgettable adventures.
            </p>
          </motion.div>

          {/* Links Sections */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-sky-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-sky-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-sky-400 transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex items-center space-x-5">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 ${social.hoverColor} transition-colors duration-300`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} TravelAI. All rights reserved.
            <span className="inline-flex items-center ml-1">
              Made with <HeartIcon className="w-4 h-4 mx-1 text-red-500" /> for adventurers
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}; 