'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HospitalityPageClient({ hospitalityPage }: { hospitalityPage: any }) {
  const comingSoon = hospitalityPage?.comingSoonSection || {}

  if (comingSoon?.enabled === false) return null

  return (
    <main className="pt-20">
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="container-luxury px-6 md:px-12 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-2 bg-pear/20 text-pear text-sm font-nav uppercase tracking-widest rounded-sm mb-6">
              {comingSoon?.badgeText || 'Coming Soon'}
            </span>
            <h1 className="text-ivory mb-6 font-heading uppercase">{comingSoon?.headline || 'HOSPITALITY'}</h1>
            <p className="text-xl text-stone max-w-2xl mx-auto mb-10">
              {comingSoon?.description ||
                "We're crafting exceptional greenery solutions tailored for the hospitality industry. Premium plantscaping for hotels, resorts, and luxury venues is on its way."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="hero" size="lg">
                <Link href={comingSoon?.primaryCtaLink || '/contact'}>
                  {comingSoon?.primaryCtaText || 'Get in Touch'}
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="lg">
                <Link href={comingSoon?.secondaryCtaLink || '/'}>
                  {comingSoon?.secondaryCtaText || 'Explore Interiors'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}



