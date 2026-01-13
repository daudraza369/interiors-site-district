'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Play } from 'lucide-react'
import greenWall from '@/assets/green-wall.jpg'
import treeDetail from '@/assets/tree-detail.jpg'
import heroInterior from '@/assets/hero-interior.jpg'
import oliveTree from '@/assets/olive-tree.jpg'
import hotelAtrium from '@/assets/hotel-atrium.jpg'

const galleryItems = [
  { type: 'image', title: 'Green wall detail', span: 'col-span-1', image: greenWall },
  { type: 'video', title: 'Walk-through visual tour', span: 'col-span-2 row-span-2', image: heroInterior },
  { type: 'image', title: 'Tree detail', span: 'col-span-1', image: treeDetail },
  { type: 'image', title: 'Olive tree installation', span: 'col-span-1', image: oliveTree },
  { type: 'image', title: 'Hotel atrium', span: 'col-span-1', image: hotelAtrium },
]

export function GallerySection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()

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
          <h2 className="text-ivory mb-4">A Glimpse Into Our World</h2>
          <p className="text-body-large text-stone max-w-2xl mx-auto">
            See how nature inspires our every creation.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(140px,1fr)]">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`${item.span} relative group cursor-pointer perspective-1000 rounded-sm overflow-hidden`}
            >
              <div className={`${item.type === 'video' ? 'aspect-video md:aspect-auto md:h-full min-h-[500px] md:min-h-[600px]' : 'aspect-square'} relative`}>
                <img
                  src={typeof item.image === 'string' ? item.image : (item.image as any)?.src || item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
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
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 bg-gradient-to-t from-night-green/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-ivory text-sm font-semibold">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
