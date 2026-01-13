'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/mediaUrl'

interface Service {
  id?: string
  title: string
  description: string
  cta?: string
  href?: string
  image?: {
    url?: string
    alt?: string
  } | string
}

interface ServicesSectionProps {
  enabled?: boolean
  headline?: string
  services?: Service[]
}

const defaultServices: Service[] = [
  {
    title: 'Office & F&B Plantscaping',
    description: 'Greenery that works as hard as your space. Purposeful greenery that improves focus, comfort, and the way people experience space.',
    cta: 'Learn More',
    href: '/services/plantscaping',
  },
  {
    title: 'Tree Customization',
    description: 'Your vision, brought to life in green. We design custom artificial trees with bespoke sizing, foliage density, and finishes that match your project\'s scale and aesthetic.',
    cta: 'Book a Consultation',
    href: '/services/tree-customization',
  },
  {
    title: 'Tree Restoration',
    description: 'Breathe new life into your existing trees. Our specialists revive artificial and natural trees with UV-graded materials, extending beauty and lifespan.',
    cta: 'View More',
    href: '/services/tree-restoration',
  },
  {
    title: 'Green Wall Installations',
    description: 'Design vertical landscapes that inspire. We create artificial, natural, and preserved moss walls, integrating irrigation and lighting for lasting impact.',
    cta: 'Discover',
    href: '/services/green-walls',
  },
  {
    title: 'Custom Planter Design',
    description: 'Planters made to match your design vision. Crafted in GRC, acrylic, or stone, our planters complement interiors and exteriors with elegance and durability.',
    cta: 'See Collection',
    href: '/services/planters',
  },
  {
    title: 'Natural Plant Maintenance',
    description: 'Keeping every plant at its best. Routine watering, pruning, and replacement programs ensure your greenery remains vibrant and flawless.',
    cta: 'Learn More',
    href: '/services/maintenance',
  },
]

export function ServicesSection({
  enabled = true,
  headline = 'Explore Our Services',
  services = defaultServices,
}: ServicesSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  if (!enabled) {
    return null
  }

  return (
    <section ref={ref} className="section-padding bg-ivory">
      <div className="container-luxury">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-night-green">{headline}</h2>
        </motion.div>

        {/* Services Grid - 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            // Get image URL
            let imageUrl = ''
            let imageAlt = service.title
            
            if (service.image) {
              if (typeof service.image === 'string') {
                imageUrl = getMediaUrl(service.image)
              } else if (typeof service.image === 'object' && service.image.url) {
                imageUrl = getMediaUrl(service.image.url)
                imageAlt = service.image.alt || imageAlt
              }
            }

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group h-full"
              >
                <div className="bg-ivory border border-stone/30 rounded-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-moss/20" />
                    )}
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-night-green/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-night-green mb-3 text-lg">{service.title}</h4>
                    <p className="text-slate-moss text-sm leading-relaxed mb-5 flex-grow">
                      {service.description}
                    </p>
                    <Link href={service.href || '#'}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="group/btn w-full sm:w-auto"
                      >
                        {service.cta || 'Learn More'}
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


