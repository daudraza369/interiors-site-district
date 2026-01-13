'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/mediaUrl'

interface MaintenanceSectionProps {
  enabled?: boolean
  headline?: string
  subheadline?: string
  description?: string
  ctaText?: string
  image?: {
    url?: string
    alt?: string
  } | string
}

export function MaintenanceSection({
  enabled = true,
  headline = "We Don't Just Install. We Maintain.",
  subheadline = 'Ensuring your trees stay in shape, season after season.',
  description = 'Our maintenance programs cover scheduled cleaning, branch alignment, and replacements to preserve perfection. We also offer upgrade paths for expanding greenery programs, so your space can grow with you.',
  ctaText = 'Ask About Our Maintenance Plans',
  image,
}: MaintenanceSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  if (!enabled) {
    return null
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Get image URL
  let imageUrl = ''
  let imageAlt = 'Technician maintaining plants in office'
  
  if (image) {
    if (typeof image === 'string') {
      imageUrl = getMediaUrl(image)
    } else if (typeof image === 'object' && image.url) {
      imageUrl = getMediaUrl(image.url)
      imageAlt = image.alt || imageAlt
    }
  }

  return (
    <section ref={ref} className="section-padding bg-stone relative overflow-hidden">
      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-xl">
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
            </div>
            {/* Floating accent */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-pear/40 rounded-sm -z-10"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-night-green mb-6">{headline}</h2>
            <p className="text-xl text-slate-moss mb-4">{subheadline}</p>
            <p className="text-body text-slate-moss/80 leading-relaxed mb-8">{description}</p>
            <Button variant="default" size="lg" onClick={scrollToContact}>
              {ctaText}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


