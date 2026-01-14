'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface ProjectsHeroSectionProps {
  enabled?: boolean
  badgeText?: string | null
  headline?: string | null
  description?: string | null
}

export function ProjectsHeroSection({
  enabled = true,
  badgeText = 'Portfolio',
  headline = 'Our Projects',
  description = 'Spaces transformed through green design. A showcase of curated interiors and custom installations.',
}: ProjectsHeroSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  if (!enabled) {
    return null
  }

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-40 bg-night-green overflow-hidden"
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-20" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pear/5 blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-pear/5 blur-3xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="container-luxury relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="inline-block text-pear uppercase tracking-[0.3em] text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {badgeText}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-ivory mb-6"
          >
            {headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-stone max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}





