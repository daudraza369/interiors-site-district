'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/mediaUrl'
import { ServicesSection } from '@/components/sections/ServicesSection'

interface Service {
  id: string | number
  title: string
  description: string
  image: any
  link: string
}

interface ServicesPageClientProps {
  servicesPage: any
  services: Service[]
}

export function ServicesPageClient({ servicesPage, services }: ServicesPageClientProps) {
  const heroRef = useScrollAnimation<HTMLElement>()

  const heroSection = servicesPage?.heroSection
  const servicesSection = servicesPage?.servicesSection
  const ctaSection = servicesPage?.ctaSection

  // Transform services to match ServicesSection format
  const transformedServices = services.map((service: any) => {
    let imageUrl = ''
    let imageAlt = service.title

    if (service.image) {
      if (typeof service.image === 'object' && service.image.url) {
        imageUrl = getMediaUrl(service.image.url)
        imageAlt = service.image.alt || service.title
      } else if (typeof service.image === 'number') {
        console.warn(`Image for ${service.title} is not populated. Ensure depth: 1 is set.`)
      }
    }

    return {
      id: String(service.id),
      title: service.title,
      description: service.description,
      cta: 'Learn More',
      href: service.link || '/services',
      image: imageUrl ? { url: imageUrl, alt: imageAlt } : undefined,
    }
  })

  // Get hero background image URL
  let heroImageUrl = ''
  if (heroSection?.backgroundImage) {
    if (typeof heroSection.backgroundImage === 'object' && heroSection.backgroundImage.url) {
      heroImageUrl = getMediaUrl(heroSection.backgroundImage.url)
    } else if (typeof heroSection.backgroundImage === 'number') {
      console.warn('Hero background image is not populated. Ensure depth: 2 is set.')
    }
  }
  
  // Fallback: Use a placeholder or default image URL if none is set
  if (!heroImageUrl) {
    heroImageUrl = getMediaUrl('/api/media/file/hero-interior.jpg')
  }

  return (
    <>
      {/* Hero Section */}
      {heroSection?.enabled !== false && (
        <section ref={heroRef.ref} className="relative min-h-[60vh] bg-night-green overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-night-green via-night-green/95 to-night-green/70 z-10" />
            <Image
              src={heroImageUrl}
              alt="Interior plantscaping"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 pattern-overlay z-20 opacity-20" />
          
          <div className="relative z-30 min-h-[60vh] flex items-center">
            <div className="container-luxury px-6 md:px-12 lg:px-20 py-32">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-ivory mb-6"
              >
                {heroSection?.headline || 'Our Services'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-stone max-w-2xl"
              >
                {heroSection?.description ||
                  'Comprehensive greenery solutions for every space, from bespoke installations to ongoing maintenance.'}
              </motion.p>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid - Using new ServicesSection component */}
      {servicesSection?.enabled !== false && (
        <ServicesSection
          enabled={servicesSection?.enabled ?? true}
          headline={servicesSection?.headline || 'Explore Our Services'}
          services={transformedServices}
        />
      )}

      {/* CTA Section */}
      {ctaSection?.enabled !== false && (
        <section className="section-padding bg-night-green pattern-overlay">
          <div className="container-luxury relative z-10 text-center">
            <h2 className="text-ivory mb-6">
              {ctaSection?.headline || 'Ready to Transform Your Space?'}
            </h2>
            <p className="text-xl text-stone mb-8 max-w-2xl mx-auto">
              {ctaSection?.description || "Let's discuss how our services can bring your vision to life."}
            </p>
            <Link href={ctaSection?.ctaLink || '/contact'}>
              <Button variant="hero" size="lg">
                {ctaSection?.ctaText || 'Request a Consultation'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
