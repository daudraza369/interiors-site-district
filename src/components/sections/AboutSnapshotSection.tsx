'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/mediaUrl'

interface AboutSnapshotSectionProps {
  enabled?: boolean
  headline?: string
  subheadline?: string
  description?: string
  image?: {
    url?: string
    alt?: string
  } | string
}

export function AboutSnapshotSection({
  enabled = true,
  headline = 'Designed to Breathe Life Into Spaces',
  subheadline = 'A design-driven approach to greenery.',
  description = 'District Interiors specializes in transforming indoor and outdoor environments through expert plantscaping, luxury softscaping, and custom tree fabrication. Our mission is simple: to merge natural aesthetics with architectural precision to deliver beauty, sustainability, and comfort.',
  image,
}: AboutSnapshotSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  if (!enabled) {
    return null
  }

  // Get image URL
  let imageUrl = ''
  let imageAlt = 'Luxury hotel atrium with greenery installations'
  
  if (image) {
    if (typeof image === 'string') {
      imageUrl = getMediaUrl(image)
    } else if (typeof image === 'object' && image.url) {
      imageUrl = getMediaUrl(image.url)
      imageAlt = image.alt || imageAlt
    }
  }

  return (
    <section ref={ref} className="section-padding bg-night-green pattern-overlay relative overflow-hidden">
      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-ivory mb-6">{headline}</h2>
            <p className="text-xl text-stone mb-4">{subheadline}</p>
            <p className="text-body text-stone/80 leading-relaxed">{description}</p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-sm overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-moss/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-night-green/30 to-transparent" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pear/20 rounded-sm -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border border-ivory/20 rounded-sm -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Background decorative element */}
      <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-gradient-to-l from-pear/5 to-transparent -translate-y-1/2" />
    </section>
  )
}



