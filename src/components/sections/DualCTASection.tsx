'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DualCTASectionProps {
  enabled?: boolean
  leftPanel?: {
    title?: string
    description?: string
    ctaText?: string
    ctaLink?: string
  }
  rightPanel?: {
    title?: string
    description?: string
    ctaText?: string
    ctaLink?: string
  }
}

export function DualCTASection({
  enabled = true,
  leftPanel = {
    title: 'Interior Plantscaping',
    description: 'For offices, hotels, and restaurants',
    ctaText: 'Explore Plantscaping',
    ctaLink: '/services/plantscaping',
  },
  rightPanel = {
    title: 'Tree Customization & Restoration',
    description: 'For villas, malls, and public spaces',
    ctaText: 'View Tree Solutions',
    ctaLink: '/tree-solutions',
  },
}: DualCTASectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  if (!enabled) {
    return null
  }

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="grid md:grid-cols-2 md:h-[450px]">
        {/* Left Panel - Interior Plantscaping */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group h-full"
        >
          <div className="bg-lavender section-padding h-full flex flex-col justify-center items-center text-center transition-colors duration-500 group-hover:bg-lavender/90">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-night-green/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md">
              <h3 className="text-night-green mb-3">{leftPanel.title}</h3>
              <p className="text-slate-moss mb-8">{leftPanel.description}</p>
              <Link href={leftPanel.ctaLink || '/services/plantscaping'}>
                <Button variant="default" className="group/btn">
                  {leftPanel.ctaText || 'Explore Plantscaping'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Tree Customization */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative group h-full"
        >
          <div className="bg-mauve section-padding h-full flex flex-col justify-center items-center text-center transition-colors duration-500 group-hover:bg-mauve/90">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-bl from-night-green/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-md">
              <h3 className="text-night-green mb-3">{rightPanel.title}</h3>
              <p className="text-slate-moss mb-8">{rightPanel.description}</p>
              <Link href={rightPanel.ctaLink || '/tree-solutions'}>
                <Button variant="default" className="group/btn">
                  {rightPanel.ctaText || 'View Tree Solutions'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


