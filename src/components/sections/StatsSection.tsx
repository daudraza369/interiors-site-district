'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  id?: string
  label: string
  number: string
  description?: string
  icon?: string
}

interface StatsSectionProps {
  enabled?: boolean
  headline?: string
  stats?: Stat[]
}

// Default stats if none provided
const defaultStats: Stat[] = [
  {
    label: 'Projects Completed',
    number: '500+',
  },
  {
    label: 'Years Experience',
    number: '12+',
  },
  {
    label: 'Client Satisfaction',
    number: '98%',
  },
  {
    label: 'Corporate Clients',
    number: '150+',
  },
]

// Animated counter component - matches reference implementation
function AnimatedCounter({ 
  value, 
  suffix, 
  duration, 
  isVisible 
}: { 
  value: number
  suffix: string
  duration: number
  isVisible: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, value, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export function StatsSection({
  enabled = true,
  headline,
  stats = defaultStats,
}: StatsSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  if (!enabled) {
    return null
  }

  // Use default stats if none provided or empty array
  const displayStats = stats && stats.length > 0 ? stats : defaultStats

  // Parse stats for counter (extract value and suffix)
  const parsedStats = displayStats.map((stat) => {
    const numStr = stat.number.replace(/[^0-9]/g, '')
    const value = parseInt(numStr, 10) || 0
    const suffix = stat.number.replace(/[0-9]/g, '')
    return {
      ...stat,
      value,
      suffix,
      duration: 2000, // Default duration
    }
  })

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-night-green">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse, hsl(72 46% 83% / 0.2), transparent 60%)',
          }}
        />
      </div>

      {/* Horizontal lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pear/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pear/30 to-transparent" />

      <div ref={ref} className="container-luxury px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {parsedStats.map((stat, index) => (
            <motion.div
              key={stat.id || stat.label || index}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center group"
            >
              <div className="relative inline-block">
                {/* Glow behind number */}
                <div 
                  className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ background: 'hsl(72 46% 83% / 0.3)' }}
                />
                <div className="text-5xl md:text-6xl lg:text-7xl font-heading text-ivory relative">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    duration={stat.duration}
                    isVisible={isInView}
                  />
                </div>
              </div>
              <p className="text-stone/70 text-sm md:text-base uppercase tracking-widest font-nav mt-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

