'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { getMediaUrl } from '@/lib/mediaUrl'

interface GalleryItem {
  id?: string
  type: 'image' | 'video'
  title: string
  span?: string
  image?: {
    url?: string
    alt?: string
  } | string
  videoUrl?: string
}

interface GallerySectionProps {
  enabled?: boolean
  headline?: string
  description?: string
  items?: GalleryItem[]
}

const defaultItems: GalleryItem[] = [
  { type: 'image', title: 'Green wall detail', span: 'col-span-1' },
  { type: 'video', title: 'Walk-through visual tour', span: 'col-span-2 row-span-2' },
  { type: 'image', title: 'Tree detail', span: 'col-span-1' },
  { type: 'image', title: 'Olive tree installation', span: 'col-span-1' },
  { type: 'image', title: 'Hotel atrium', span: 'col-span-1' },
]

export function GallerySection({
  enabled = true,
  headline = 'A Glimpse Into Our World',
  description = 'See how nature inspires our every creation.',
  items = defaultItems,
}: GallerySectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

  if (!enabled) {
    return null
  }

  return (
    <section ref={ref} className="section-padding bg-night-green pattern-overlay relative overflow-hidden">
      <div className="container-luxury relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-ivory mb-4">{headline}</h2>
          <p className="text-body-large text-stone max-w-2xl mx-auto">{description}</p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, index) => {
            // Get image URL
            let imageUrl = ''
            let imageAlt = item.title
            
            if (item.image) {
              if (typeof item.image === 'string') {
                imageUrl = getMediaUrl(item.image)
              } else if (typeof item.image === 'object' && item.image.url) {
                imageUrl = getMediaUrl(item.image.url)
                imageAlt = item.image.alt || imageAlt
              }
            }

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`${item.span || 'col-span-1'} relative group cursor-pointer rounded-sm overflow-hidden`}
              >
                <div className={`${item.type === 'video' ? 'aspect-video md:aspect-auto md:h-full' : 'aspect-square'} relative`}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-moss/20" />
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-night-green/40 group-hover:bg-night-green/20 transition-colors duration-500" />
                  
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-ivory/20 flex items-center justify-center group-hover:bg-ivory/30 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                        <Play className="w-8 h-8 text-ivory ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Title on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-night-green/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-ivory text-sm font-semibold">{item.title}</p>
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


