'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import {
  Plane,
  CalendarClock,
  Building2,
  Truck,
  Award,
  Flower2,
  Download,
} from 'lucide-react'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
  Plane,
  CalendarClock,
  Building2,
  Truck,
  Award,
  Flower2,
  Download,
}

interface FlowersPageClientProps {
  flowersPage: any
}

export function FlowersPageClient({ flowersPage }: FlowersPageClientProps) {
  const heroRef = useScrollAnimation<HTMLElement>()
  const catalogRef = useScrollAnimation<HTMLElement>()
  const benefitsRef = useScrollAnimation<HTMLElement>()

  const heroSection = flowersPage?.heroSection || {}
  const catalogSection = flowersPage?.catalogSection || {}
  const benefitsSection = flowersPage?.benefitsSection || {}

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'

  // Get catalog preview image URL
  let catalogPreviewUrl = ''
  if (catalogSection?.previewImage) {
    if (typeof catalogSection.previewImage === 'object' && catalogSection.previewImage.url) {
      catalogPreviewUrl = catalogSection.previewImage.url.startsWith('http')
        ? catalogSection.previewImage.url
        : `${serverUrl}${catalogSection.previewImage.url.startsWith('/') ? '' : '/'}${catalogSection.previewImage.url}`
    }
  }
  if (!catalogPreviewUrl) {
    catalogPreviewUrl = `${serverUrl}/api/media/file/flowers-catalog-preview.png` // Fallback
  }

  return (
    <main>
      {/* Section 1: Value Proposition Hero */}
      {heroSection?.enabled !== false && (
        <section
          ref={heroRef.ref}
          className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-mauve via-lavender/40 to-blush" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-green/10 to-transparent" />
          {/* Darker overlay in upper-left for logo contrast */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[hsl(270,25%,55%)] via-mauve/60 to-transparent" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-ivory/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pear/20 rounded-full blur-3xl" />

          <div className="container relative z-10 px-6 py-24 md:py-32">
            <motion.div
              initial="hidden"
              animate={heroRef.isVisible ? 'visible' : 'hidden'}
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Headline */}
              <motion.h1
                variants={fadeUpVariants}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-night-green font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mb-6"
              >
                {heroSection?.headline
                  ? heroSection.headline.split('\\n').map((line: string, i: number) => (
                      <span key={i}>
                        {line}
                        {i < heroSection.headline.split('\\n').length - 1 && <br />}
                      </span>
                    ))
                  : 'Premium Wholesale Flowers,\nFresh from Source'}
              </motion.h1>

              {/* Subheadline */}
              {heroSection?.subheadline && (
                <motion.p
                  variants={fadeUpVariants}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="text-night-green/80 font-body text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl mx-auto"
                >
                  {heroSection.subheadline}
                </motion.p>
              )}

              {/* Differentiator Badges */}
              {heroSection?.badges && heroSection.badges.length > 0 && (
                <motion.div
                  variants={fadeUpVariants}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-3 md:gap-4"
                >
                  {heroSection.badges.map((badge: any, index: number) => {
                    const IconComponent = iconMap[badge?.icon] || Plane
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-ivory/90 backdrop-blur-sm px-4 py-2.5 rounded-full text-night-green font-body text-sm md:text-base shadow-sm"
                      >
                        <IconComponent className="w-4 h-4 text-lavender" />
                        <span>{badge?.text || ''}</span>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Section 2: Catalog Download CTA */}
      {catalogSection?.enabled !== false && (
        <section ref={catalogRef.ref} className="section-padding bg-ivory">
          <div className="container-luxury">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center"
            >
              {/* Section Heading */}
              {catalogSection?.eyebrow && (
                <motion.p
                  variants={fadeUpVariants}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-slate-moss/70 text-xs md:text-sm uppercase tracking-[0.25em] font-body mb-3"
                >
                  {catalogSection.eyebrow}
                </motion.p>
              )}
              {catalogSection?.headline && (
                <motion.h2
                  variants={fadeUpVariants}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className="text-night-green font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight mb-10"
                >
                  {catalogSection.headline}
                </motion.h2>
              )}

              {/* Catalog Preview Card */}
              <motion.div
                variants={fadeUpVariants}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="relative group mb-10"
              >
                <div className="relative max-w-md mx-auto">
                  {/* Shadow/glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-lavender/20 to-mauve/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card */}
                  <div className="relative bg-white rounded-xl shadow-xl border border-stone/20 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    {catalogPreviewUrl ? (
                      <div className="w-full aspect-[3/4] bg-stone/10 relative overflow-hidden">
                        <img
                          src={catalogPreviewUrl}
                          alt="District Flowers Wholesale Catalog Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><p class="text-slate-moss text-sm">Catalog preview image</p></div>'
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[3/4] bg-stone/10 flex items-center justify-center">
                        <p className="text-slate-moss text-sm">Catalog preview image</p>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-night-green/0 group-hover:bg-night-green/5 transition-colors duration-300 pointer-events-none" />
                  </div>
                </div>
              </motion.div>

              {/* Download Button */}
              {catalogSection?.catalogUrl && (
                <motion.div
                  variants={fadeUpVariants}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                >
                  <Button
                    asChild
                    size="xl"
                    className="w-full sm:w-auto sm:min-w-[280px] gap-2 sm:gap-3 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-3 sm:py-4 whitespace-normal text-center leading-tight"
                  >
                    <a
                      href={catalogSection.catalogUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span>
                        {catalogSection?.buttonText ||
                          'Download the Full Catalogue for Latest Arrivals'}
                      </span>
                    </a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Section 3: Why Choose District Flowers */}
      {benefitsSection?.enabled !== false && (
        <section ref={benefitsRef.ref} className="section-padding bg-stone/10">
          <div className="container-luxury">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
            >
              {/* Section Header */}
              <motion.div
                variants={fadeUpVariants}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-14"
              >
                {benefitsSection?.eyebrow && (
                  <p className="text-slate-moss/70 text-xs md:text-sm uppercase tracking-[0.25em] font-body mb-3">
                    {benefitsSection.eyebrow}
                  </p>
                )}
                {benefitsSection?.headline && (
                  <h2 className="text-night-green font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight">
                    {benefitsSection.headline}
                  </h2>
                )}
              </motion.div>

              {/* 3-Column Grid */}
              {benefitsSection?.benefits && benefitsSection.benefits.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
                  {benefitsSection.benefits.map((benefit: any, index: number) => {
                    const IconComponent = iconMap[benefit?.icon] || Truck
                    return (
                      <motion.div
                        key={index}
                        variants={fadeUpVariants}
                        transition={{
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.1 + index * 0.1,
                        }}
                        className="text-center group"
                      >
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 group-hover:opacity-75 transition-colors duration-300 ${
                            index === 2 ? 'bg-mauve/30 group-hover:bg-mauve/50' : 'bg-lavender/30 group-hover:bg-lavender/50'
                          }`}
                        >
                          <IconComponent className="w-7 h-7 text-night-green" />
                        </div>
                        {benefit?.title && (
                          <h3 className="text-night-green font-heading text-xl md:text-2xl uppercase tracking-tight mb-3">
                            {benefit.title}
                          </h3>
                        )}
                        {benefit?.description && (
                          <p className="text-slate-moss font-body text-base md:text-lg leading-relaxed">
                            {benefit.description}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </main>
  )
}

