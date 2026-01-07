'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Brain, TrendingDown, Flame, CalendarX, LucideIcon } from 'lucide-react'

interface ProblemCard {
  icon: string
  headline: string
  stat: string
  label: string
  description: string
  source: string
}

interface ProblemFramingSectionProps {
  enabled?: boolean
  badgeText?: string
  headline?: string
  description?: string
  problems?: ProblemCard[]
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Brain,
  TrendingDown,
  Flame,
  CalendarX,
  AlertTriangle,
}

export function ProblemFramingSection({
  enabled = true,
  badgeText = 'The Hidden Cost',
  headline = 'The Hidden Cost of Sterile Spaces',
  description = 'Bland interiors are not neutral. They are actively suppressing your team\'s performance. Science confirms the difference.',
  problems = [],
}: ProblemFramingSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [sectionElement, setSectionElement] = useState<HTMLElement | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setSectionElement(sectionRef.current)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionElement ? sectionRef : undefined,
    offset: ['start end', 'end start'],
    layoutEffect: false,
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  if (!enabled || !problems || problems.length === 0) {
    return null
  }

  return (
    <section
      ref={(el) => {
        if (el) {
          sectionRef.current = el
          if (!sectionElement) {
            setSectionElement(el)
          }
        }
      }}
      className="relative py-20 md:py-28 lg:py-36 overflow-hidden bg-deep-forest content-auto"
    >
      {/* Simplified parallax background - GPU accelerated, unified color */}
      <motion.div
        className="absolute inset-0 opacity-20 transform-gpu"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-deep-forest" />
      </motion.div>

      {/* Simplified grid pattern - hidden on mobile for performance */}
      <div
        className="absolute inset-0 opacity-5 hidden md:block"
        style={{
          backgroundImage: `linear-gradient(hsl(72 46% 83% / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(72 46% 83% / 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Static glow accent - no animation for performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden md:block">
        <div
          className="w-full h-full opacity-40"
          style={{
            background: 'radial-gradient(circle, hsl(72 46% 83% / 0.08), transparent 60%)',
          }}
        />
      </div>

      <div ref={ref} className="container-luxury px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pear/10 border border-pear/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-pear" />
            <span className="text-sm text-pear uppercase tracking-widest font-nav">
              {badgeText}
            </span>
          </div>

          <h2 className="text-ivory mb-6 uppercase font-heading leading-tight">
            {headline.includes(' of ') ? (
              <>
                <span className="block text-3xl md:text-4xl lg:text-5xl mb-2">
                  {headline.split(' of ')[0]} of
                </span>
                <span className="text-shimmer text-4xl md:text-5xl lg:text-6xl">
                  {headline.split(' of ')[1]}
                </span>
              </>
            ) : (
              <span className="text-shimmer text-4xl md:text-5xl lg:text-6xl">
                {headline}
              </span>
            )}
          </h2>

          <p className="text-xl md:text-2xl text-stone/80 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Problem stats grid - 2x2 layout */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const IconComponent = iconMap[problem.icon] || Brain

            return (
              <motion.div
                key={`${problem.headline}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                <div className="relative p-6 md:p-8 rounded-sm bg-night-green/50 backdrop-blur-sm border border-ivory/5 hover:border-pear/30 transition-all duration-500 h-full flex flex-col">
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at 50% 0%, hsl(72 46% 83% / 0.1), transparent 60%)',
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header row with icon and headline */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-pear/10 flex items-center justify-center group-hover:bg-pear/20 transition-colors duration-300 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-pear" />
                      </div>
                      <span className="text-sm text-pear uppercase tracking-widest font-nav">
                        {problem.headline}
                      </span>
                    </div>

                    {/* Stat */}
                    <div className="text-5xl md:text-6xl lg:text-7xl font-heading text-ivory mb-2">
                      {problem.stat}
                    </div>

                    {/* Label */}
                    <p className="text-base md:text-lg text-pear font-nav uppercase tracking-wide mb-4">
                      {problem.label}
                    </p>

                    {/* Description */}
                    <p className="text-stone/70 text-sm md:text-base leading-relaxed flex-grow mb-4">
                      {problem.description}
                    </p>

                    {/* Source citation */}
                    <div className="pt-4 border-t border-ivory/10">
                      <p className="text-xs text-stone/50 italic">
                        Source: {problem.source}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-forest to-transparent pointer-events-none" />
    </section>
  )
}

