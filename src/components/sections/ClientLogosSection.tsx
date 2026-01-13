'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ClientLogo {
  id: string
  clientName: string
  logo?: {
    url?: string
    alt?: string
  } | string
  websiteUrl?: string | null
}

interface ClientLogosSectionProps {
  enabled?: boolean
  headline?: string
  maxLogos?: number
  logos?: ClientLogo[]
}

export function ClientLogosSection({ 
  enabled = true, 
  headline,
  maxLogos = 10,
  logos = []
}: ClientLogosSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  if (!enabled || !logos || logos.length === 0) {
    return null
  }

  // Limit logos to maxLogos
  const displayLogos = logos.slice(0, maxLogos)
  
  // Quadruple for seamless loop
  const repeatedLogos = [...displayLogos, ...displayLogos, ...displayLogos, ...displayLogos]

  const LogoItem = ({ client, index }: { client: ClientLogo; index: number }) => {
    const logoUrl = typeof client.logo === 'string' 
      ? client.logo 
      : client.logo?.url || ''
    const logoAlt = typeof client.logo === 'object' 
      ? client.logo?.alt || client.clientName 
      : client.clientName

    return (
      <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20 flex items-center justify-center group h-12 md:h-14">
        {logoUrl ? (
          client.websiteUrl ? (
            <a 
              href={client.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center h-full"
            >
              <img 
                src={logoUrl} 
                alt={logoAlt}
                className="h-10 md:h-12 w-auto max-w-[160px] md:max-w-[200px] object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-out"
              />
            </a>
          ) : (
            <img 
              src={logoUrl} 
              alt={logoAlt}
              className="h-10 md:h-12 w-auto max-w-[160px] md:max-w-[200px] object-contain opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-out"
            />
          )
        ) : (
          // Text fallback for missing logos
          <a 
            href={client.websiteUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center h-full"
          >
            <span className="text-xs md:text-sm font-nav uppercase tracking-wider text-slate-moss/40 group-hover:text-night-green transition-colors duration-500 whitespace-nowrap">
              {client.clientName}
            </span>
          </a>
        )}
      </div>
    )
  }

  return (
    <section 
      ref={ref} 
      className="relative py-16 md:py-20 overflow-hidden bg-ivory"
    >
      {/* Subtle decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone to-transparent" />

      <div className="container-luxury px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header - matching the cinematic style */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
          animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-night-green/50 font-body mb-4">
            TRUSTED BY GLOBAL LEADERS
          </p>
          <h3 
            className="text-xl md:text-2xl lg:text-3xl font-heading font-bold tracking-wide text-night-green"
            style={{
              textShadow: '0 0 40px hsl(72 46% 83% / 0.6), 0 0 80px hsl(72 46% 83% / 0.3)'
            }}
          >
            Transforming the Region's Premier Work Spaces
          </h3>
        </motion.div>
      </div>

      {/* Logo Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        {/* Edge fades - using ivory to match section background */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 lg:w-56 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, hsl(60 30% 98%) 0%, transparent 100%)' }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 lg:w-56 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, hsl(60 30% 98%) 0%, transparent 100%)' }}
        />

        {/* Scrolling container */}
        <div 
          className="flex items-center py-6"
          style={{
            animation: 'logo-scroll 40s linear infinite',
            width: 'fit-content',
            willChange: 'transform'
          }}
        >
          {repeatedLogos.map((client, index) => (
            <LogoItem key={`${client.id}-${index}`} client={client} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </section>
  )
}

