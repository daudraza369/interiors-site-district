'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Lightbulb, Ruler, Wrench, Sparkles, ArrowRight, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SectionGuard } from './SectionGuard'

interface ApproachPoint {
  number?: string
  icon?: string
  title: string
  description?: string
  accent?: string
}

interface OurApproachSectionProps {
  enabled?: boolean
  badgeText?: string
  headline?: string
  subheadline?: string
  description?: string
  approachPoints?: ApproachPoint[]
  ctaText?: string
  ctaLink?: string
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Ruler,
  Wrench,
  Sparkles,
}

export function OurApproachSection({
  enabled = true,
  badgeText = 'The Solution',
  headline = 'This Is Where District Steps In',
  subheadline = 'We\'ve seen the cost of sterile spaces—and we\'ve spent years perfecting the antidote.',
  description = 'Our approach transforms these hidden liabilities into competitive advantages. Through strategic biophilic design, we create environments where people don\'t just work—they thrive.',
  approachPoints = [],
  ctaText = 'Start Your Transformation',
  ctaLink = '/contact',
}: OurApproachSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionElement, setSectionElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setSectionElement(sectionRef.current)
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: sectionElement ? sectionRef : undefined,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  })

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  const hasData = approachPoints && approachPoints.length > 0
  // REMOVED: Early return on empty data - let SectionGuard handle this

  return (
    <SectionGuard enabled={enabled} hasData={hasData}>
      <section
      ref={sectionRef}
      className="relative py-28 md:py-36 lg:py-44 overflow-hidden gradient-section-light"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pear/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-slate-moss/10 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="container-luxury px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header with transition from problem to solution */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-night-green/5 border border-night-green/10 mb-6">
            <span className="text-sm text-night-green uppercase tracking-widest font-nav">
              {badgeText}
            </span>
          </div>
          
          <h2 className="text-night-green mb-6 uppercase font-heading">
            {headline ? (
              headline.split(' ').length > 3 ? (
                // If headline has more than 3 words, split into two lines
                <>
                  <span className="block text-3xl md:text-4xl lg:text-5xl">{headline.split(' ').slice(0, 3).join(' ')}</span>
                  <span className="block text-gradient text-4xl md:text-5xl lg:text-6xl">{headline.split(' ').slice(3).join(' ')}</span>
                </>
              ) : (
                // If headline has 3 or fewer words, show on one line with gradient
                <span className="block text-gradient text-4xl md:text-5xl lg:text-6xl">{headline}</span>
              )
            ) : (
              // Default fallback
              <>
                <span className="block text-3xl md:text-4xl lg:text-5xl">This Is Where</span>
                <span className="block text-gradient text-4xl md:text-5xl lg:text-6xl">District Steps In</span>
              </>
            )}
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-moss leading-relaxed mb-4">
            {subheadline}
          </p>
          
          <p className="text-body text-slate-moss/80 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Process steps with connecting line */}
        <div className="relative">
          {/* Vertical connecting line - visible on larger screens */}
          <div className="hidden lg:block absolute left-[50px] top-0 bottom-0 w-px bg-stone/30">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-pear via-moss-glow to-pear"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8 lg:space-y-16">
            {approachPoints.map((step, index) => {
              const IconComponent = step.icon ? (iconMap[step.icon] || Lightbulb) : Lightbulb
              const stepNumber = step.number || String(index + 1).padStart(2, '0')

              return (
                <motion.div
                  key={stepNumber}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, filter: 'blur(10px)' }}
                  animate={isVisible ? { opacity: 1, x: 0, filter: 'blur(0)' } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative flex items-start gap-8 lg:gap-16 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse lg:text-right' : ''
                  }`}
                >
                  {/* Step number node */}
                  <div className="relative flex-shrink-0">
                    <div className="w-[100px] h-[100px] rounded-full bg-ivory border-2 border-pear/30 flex items-center justify-center shadow-cinematic">
                      <span className="text-3xl font-heading text-night-green">{stepNumber}</span>
                    </div>
                    {/* Glow ring on hover */}
                    <div className="absolute inset-0 rounded-full bg-pear/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 max-w-xl ${index % 2 === 1 ? 'lg:mr-8' : 'lg:ml-8'}`}>
                    <div className="group card-cinematic p-8 rounded-sm bg-ivory border border-stone/20">
                      <div className={`flex items-center gap-4 mb-4 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-pear/20 flex items-center justify-center group-hover:bg-pear/40 transition-colors">
                          <IconComponent className="w-5 h-5 text-night-green" />
                        </div>
                        <span className="text-xs text-pear uppercase tracking-widest font-nav">{step.accent || ''}</span>
                      </div>
                      
                      <h3 className="text-night-green mb-3 text-2xl md:text-3xl">{step.title}</h3>
                      <p className="text-slate-moss leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA after steps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-slate-moss mb-6 text-lg">
              Ready to transform your space into an environment where people thrive?
            </p>
            <Link href={ctaLink || '/contact'}>
              <Button variant="default" size="lg" className="group">
                {ctaText}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
    </SectionGuard>
  )
}
