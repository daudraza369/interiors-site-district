'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ServiceSubPageClient({ serviceData }: { serviceData: any }) {
  const heroRef = useScrollAnimation<HTMLElement>()

  return (
    <main>
      {/* Hero Section */}
      <section
        ref={heroRef.ref}
        className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-night-green via-slate-moss to-night-green"
      >
        <div className="container-luxury px-6 md:px-12 lg:px-20 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {serviceData?.eyebrow && (
              <p className="text-xs tracking-[0.3em] uppercase text-pear mb-4">{serviceData.eyebrow}</p>
            )}
            <h1 className="text-ivory mb-6 font-heading text-4xl md:text-5xl lg:text-6xl uppercase">
              {serviceData?.title || 'Service'}
            </h1>
            {serviceData?.description && (
              <p className="text-xl text-stone max-w-2xl mx-auto mb-10">{serviceData.description}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="hero" size="lg">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="lg">
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Content Section */}
      <section className="section-padding bg-ivory">
        <div className="container-luxury px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-slate-moss text-lg">
              Detailed information about this service is coming soon. We're crafting comprehensive content to help you
              understand our offerings.
            </p>
            <p className="text-slate-moss mt-4">
              In the meantime, feel free to{' '}
              <Link href="/contact" className="text-night-green underline hover:text-slate-moss">
                contact us
              </Link>{' '}
              to learn more about this service.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

