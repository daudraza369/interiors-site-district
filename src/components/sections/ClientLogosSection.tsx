'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

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
      <div className="flex-shrink-0 mx-10 md:mx-14 lg:mx-20 flex items-center justify-center group">
        <div className="w-32 md:w-40 h-16 flex items-center justify-center">
          {logoUrl ? (
            client.websiteUrl ? (
              <a 
                href={client.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full"
              >
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={160}
                  height={64}
                  className="max-w-full max-h-10 md:max-h-12 object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </a>
            ) : (
              <Image
                src={logoUrl}
                alt={logoAlt}
                width={160}
                height={64}
                className="max-w-full max-h-10 md:max-h-12 object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            )
          ) : (
            // Text fallback for missing logos
            <a 
              href={client.websiteUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-full"
            >
              <span className="text-sm md:text-base font-nav uppercase tracking-wider text-slate-moss/40 group-hover:text-night-green transition-colors duration-500 whitespace-nowrap">
                {client.clientName}
              </span>
            </a>
          )}
        </div>
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
        {headline && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
            animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-slate-moss/60 font-nav mb-3">
              Trusted By
            </p>
            <h3 className="text-night-green text-2xl md:text-3xl font-heading uppercase tracking-wide">
              {headline}
            </h3>
          </motion.div>
        )}
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
          className="flex items-center py-6 hover:[animation-play-state:paused]"
          style={{
            animation: 'logo-scroll 35s linear infinite',
            width: 'fit-content'
          }}
        >
          {repeatedLogos.map((client, index) => (
            <LogoItem key={`${client.id}-${index}`} client={client} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Keyframes are in globals.css */}
    </section>
  )
}

