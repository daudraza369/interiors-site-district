'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

interface ComparisonPoint {
  id?: string
  label: string
  us: string
  them: string
  displayOrder?: number | null
}

interface DifferentiationSectionProps {
  enabled?: boolean
  headline?: string | null
  headlineSecond?: string | null
  subheadline?: string | null
  comparisonPoints?: ComparisonPoint[]
  ctaText?: string | null
  ctaLink?: string | null
}

// Default comparison points matching reference
const defaultComparisons: ComparisonPoint[] = [
  {
    label: 'Design Approach',
    us: 'Custom concepts tailored to your space and brand',
    them: 'Generic catalog selections',
  },
  {
    label: 'Plant Quality',
    us: 'Premium specimens with health guarantees',
    them: 'Standard nursery stock',
  },
  {
    label: 'Installation',
    us: 'White-glove service with minimal disruption',
    them: 'Basic drop-off delivery',
  },
  {
    label: 'Maintenance',
    us: 'Proactive care plans with dedicated technicians',
    them: 'Reactive service on request',
  },
  {
    label: 'Consultation',
    us: 'In-depth discovery and strategic planning',
    them: 'Quick product recommendations',
  },
]

export function DifferentiationSection({
  enabled = true,
  headline = 'Not All Plantscaping',
  headlineSecond = 'Is Created Equal',
  subheadline = 'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.',
  comparisonPoints = defaultComparisons,
  ctaText = "Ready to experience the difference? Let's talk →",
  ctaLink = '/contact',
}: DifferentiationSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()
  const sectionRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure sectionRef is hydrated before useScroll
  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  })

  const cardRotate = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5])

  if (!enabled) {
    return null
  }

  // Use default comparisons if none provided or empty array
  const displayComparisons =
    comparisonPoints && comparisonPoints.length > 0
      ? [...comparisonPoints].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      : defaultComparisons

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-36 lg:py-44 overflow-hidden bg-slate-moss"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-moss via-night-green/20 to-slate-moss" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, hsl(72 46% 83% / 0.1), transparent 50%)',
              'radial-gradient(circle at 80% 70%, hsl(72 46% 83% / 0.1), transparent 50%)',
              'radial-gradient(circle at 20% 30%, hsl(72 46% 83% / 0.1), transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div ref={ref} className="container-luxury px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-ivory mb-6 uppercase font-heading leading-tight">
            <span className="block text-3xl md:text-4xl lg:text-5xl break-words">
              {headline || 'Not All Plantscaping'}
            </span>
            <span className="block text-shimmer text-4xl md:text-5xl lg:text-6xl mt-2">
              {headlineSecond || 'Is Created Equal'}
            </span>
          </h2>

          <p className="text-xl text-stone/80 max-w-2xl mx-auto">
            {subheadline ||
              'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.'}
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          style={{ rotateX: cardRotate }}
          className="max-w-4xl mx-auto perspective-1000"
        >
          <div className="bg-night-green/60 backdrop-blur-sm rounded-sm border border-ivory/10 overflow-hidden shadow-cinematic-lg">
            {/* Table header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-night-green/80 border-b border-ivory/10">
              <div className="text-stone/60 text-sm uppercase tracking-widest font-nav">Criteria</div>
              <div className="text-center">
                <span className="text-pear text-sm uppercase tracking-widest font-nav">District</span>
              </div>
              <div className="text-center">
                <span className="text-stone/40 text-sm uppercase tracking-widest font-nav">Others</span>
              </div>
            </div>

            {/* Table rows */}
            {displayComparisons.map((item, index) => (
              <motion.div
                key={item.id || item.label || index}
                initial={{ opacity: 0, x: -40 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`grid grid-cols-3 gap-4 p-6 ${
                  index !== displayComparisons.length - 1 ? 'border-b border-ivory/5' : ''
                } hover:bg-ivory/5 transition-colors duration-300`}
              >
                <div className="text-ivory font-nav text-sm md:text-base">{item.label}</div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-pear flex-shrink-0 mt-0.5" />
                  <span className="text-stone text-sm leading-relaxed">{item.us}</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="w-5 h-5 text-stone/40 flex-shrink-0 mt-0.5" />
                  <span className="text-stone/50 text-sm leading-relaxed">{item.them}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-stone/60 text-sm">
            {ctaText && ctaText.includes("Let's talk") ? (
              <>
                {ctaText.split("Let's talk")[0].trim()}{' '}
                {ctaLink && (
                  <Link
                    href={ctaLink}
                    className="text-pear underline-reveal cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    Let&apos;s talk →
                  </Link>
                )}
              </>
            ) : ctaText ? (
              <>
                {ctaText.includes('→') ? ctaText.split('→')[0].trim() : ctaText}
                {ctaLink && ctaText.includes('→') && (
                  <Link
                    href={ctaLink}
                    className="text-pear underline-reveal cursor-pointer hover:opacity-80 transition-opacity ml-1"
                  >
                    {' '}→
                  </Link>
                )}
              </>
            ) : (
              <>
                Ready to experience the difference?{' '}
                <Link
                  href="/contact"
                  className="text-pear underline-reveal cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Let&apos;s talk →
                </Link>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

