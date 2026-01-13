'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import {
  Globe,
  CalendarClock,
  Star,
  Truck,
  Award,
  Flower2,
  Download,
} from 'lucide-react'
import { getMediaUrl } from '@/lib/mediaUrl'

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
  Globe,
  CalendarClock,
  Star,
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

  // Get catalog preview image URL using getMediaUrl utility
  let catalogPreviewUrl = ''
  if (catalogSection?.previewImage) {
    if (typeof catalogSection.previewImage === 'object' && catalogSection.previewImage.url) {
      catalogPreviewUrl = getMediaUrl(catalogSection.previewImage.url)
    }
  }
  if (!catalogPreviewUrl) {
    catalogPreviewUrl = getMediaUrl('/api/media/file/flowers-catalog-preview.png') // Fallback
  }

  return (
    <main>
      {/* Section 1: Value Proposition Hero */}
      {heroSection?.enabled !== false && (
        <section
          ref={heroRef.ref}
          className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-lavender"
        >

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
                className="text-night-green font-heading text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight mb-6 leading-none"
              >
                {heroSection?.headline
                  ? heroSection.headline.split('\n').map((line: string, i: number) => (
                      <span key={i}>
                        {line}
                        {i < heroSection.headline.split('\n').length - 1 && <br />}
                      </span>
                    ))
                  : (
                    <>
                      PREMIUM WHOLESALE FLOWERS,<br />
                      CATERING RIYADH
                    </>
                  )}
              </motion.h1>

              {/* Subheadline */}
              {heroSection?.subheadline && (
                <motion.p
                  variants={fadeUpVariants}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="text-night-green/80 font-subhead text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl mx-auto leading-8"
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
                    const IconComponent = iconMap[badge?.icon] || Globe
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 bg-ivory/90 backdrop-blur-sm px-4 py-2.5 rounded-full text-night-green font-body text-sm md:text-base shadow-sm"
                      >
                        <IconComponent className="w-4 h-4 text-mauve" />
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
        <section id="catalog" ref={catalogRef.ref} className="py-20 md:py-28 bg-ivory">
          <div className="container px-6">
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
                  className="text-slate-moss/70 text-xs md:text-sm uppercase tracking-[0.3em] font-heading mb-3"
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
                  {catalogSection.headline.includes('\n') ? (
                    catalogSection.headline.split('\n').map((line: string, i: number) => (
                      <span key={i}>
                        {line}
                        {i < catalogSection.headline.split('\n').length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    catalogSection.headline
                  )}
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
                      <img
                        src={catalogPreviewUrl}
                        alt="District Flowers Wholesale Catalog Preview"
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-stone/10 flex items-center justify-center">
                        <p className="text-slate-moss text-sm">Catalog preview image</p>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-night-green/0 group-hover:bg-night-green/5 transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>

              {/* Download Buttons */}
              <motion.div
                variants={fadeUpVariants}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="flex flex-col items-center gap-4"
              >
                {catalogSection?.catalogUrl && (
                  <Button
                    asChild
                    size="xl"
                    className="w-full sm:w-auto sm:min-w-[280px] gap-2 sm:gap-3 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-3 sm:py-4 whitespace-normal text-center leading-tight bg-lavender hover:bg-mauve text-ivory"
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
                          'Download Full Catalogue for Latest Arrivals'}
                      </span>
                    </a>
                  </Button>
                )}

                <span className="text-slate-moss/60 font-body text-sm">or</span>

                <Button
                  asChild
                  size="xl"
                  className="w-full sm:w-auto sm:min-w-[280px] gap-2 sm:gap-3 text-xs sm:text-sm md:text-base px-4 sm:px-6 py-3 sm:py-4 whitespace-normal text-center leading-tight bg-lavender hover:bg-mauve text-ivory"
                >
                  <a
                    href="https://wa.me/966500606506?text=Hi%2C%20I'd%20like%20to%20receive%20weekly%20updates%20on%20your%20fresh%20flower%20shipments"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Get Weekly Updates via WhatsApp</span>
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Section 3: Why Choose District Flowers */}
      {benefitsSection?.enabled !== false && (
        <section ref={benefitsRef.ref} className="py-20 md:py-28 bg-stone/10">
          <div className="container px-6">
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
                  <p className="text-slate-moss/70 text-xs md:text-sm uppercase tracking-[0.3em] font-heading mb-3">
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

