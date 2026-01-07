'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  'All',
  'Trees',
  'Flowers',
  'Leaves/Foliage',
  'Green Walls',
  'Trunks & Branches',
  'Planters',
]

interface CollectionItem {
  id: string
  name: string
  category: string
  image: any
  price: string
}

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  item: CollectionItem | null
  allItems: CollectionItem[]
  onNavigate: (item: CollectionItem) => void
}

const ImageModal = ({ isOpen, onClose, item, allItems, onNavigate }: ImageModalProps) => {
  const currentIndex = item ? allItems.findIndex((i) => i.id === item.id) : -1

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(allItems[currentIndex - 1])
    }
  }, [currentIndex, allItems, onNavigate])

  const handleNext = useCallback(() => {
    if (currentIndex < allItems.length - 1) {
      onNavigate(allItems[currentIndex + 1])
    }
  }, [currentIndex, allItems, onNavigate])

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    },
    [onClose, handlePrev, handleNext],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
  let imageUrl = ''
  if (item?.image) {
    if (typeof item.image === 'object' && item.image.url) {
      imageUrl = item.image.url.startsWith('http')
        ? item.image.url
        : `${serverUrl}${item.image.url.startsWith('/') ? '' : '/'}${item.image.url}`
    }
  }

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-modal-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-night-green/90 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative max-w-[95vw] max-h-[95vh] bg-night-green rounded-xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-night-green to-night-green/80">
              <div>
                <h3 id="image-modal-title" className="text-lg font-semibold text-ivory">
                  {item.name}
                </h3>
                <p className="text-pear/80 text-sm">
                  {item.category} • {item.price}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-ivory/10 hover:bg-ivory/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-ivory" />
              </button>
            </div>

            {/* Image container */}
            <div className="relative flex items-center justify-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="max-w-[90vw] max-h-[75vh] object-contain"
                />
              )}

              {/* Navigation buttons */}
              {currentIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrev()
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-night-green/70 hover:bg-night-green/90 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-ivory" />
                </button>
              )}
              {currentIndex < allItems.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNext()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-night-green/70 hover:bg-night-green/90 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-ivory" />
                </button>
              )}
            </div>

            {/* Footer with counter */}
            <div className="p-3 text-center text-ivory/60 text-sm">
              {currentIndex + 1} / {allItems.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Interactive collection card with magnetic hover effect
const CollectionCard = ({
  item,
  index,
  isVisible,
  onImageClick,
}: {
  item: CollectionItem
  index: number
  isVisible: boolean
  onImageClick: (item: CollectionItem) => void
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 20
    const y = (e.clientY - rect.top - rect.height / 2) / 20
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  // Staggered layout - alternating sizes for visual interest
  const layoutVariants = [
    'col-span-1 row-span-2', // Tall portrait
    'col-span-1 row-span-1', // Square-ish
    'col-span-1 row-span-2', // Tall portrait
    'col-span-1 row-span-1', // Square-ish
    'col-span-1 row-span-1', // Square-ish
    'col-span-1 row-span-2', // Tall portrait
  ]

  const layoutClass = layoutVariants[index % layoutVariants.length]
  const isTall = layoutClass.includes('row-span-2')

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
  let imageUrl = ''
  if (item?.image) {
    if (typeof item.image === 'object' && item.image.url) {
      imageUrl = item.image.url.startsWith('http')
        ? item.image.url
        : `${serverUrl}${item.image.url.startsWith('/') ? '' : '/'}${item.image.url}`
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, rotateX: 15 }}
      animate={
        isVisible
          ? {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              },
            }
          : {}
      }
      whileHover={{
        z: 50,
        transition: { duration: 0.3 },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onImageClick(item)}
      className={`${layoutClass} group cursor-pointer perspective-1000`}
      style={{
        transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div
        className={`relative overflow-hidden rounded-sm h-full ${
          isTall ? 'min-h-[450px] md:min-h-[550px]' : 'min-h-[260px] md:min-h-[300px]'
        }`}
      >
        {/* Image with parallax effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Color overlay on hover - transitions from grayscale to vibrant */}
        <motion.div
          className="absolute inset-0 bg-night-green mix-blend-color"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHovered ? 0 : 0.6 }}
          transition={{ duration: 0.5 }}
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-night-green via-night-green/50 to-transparent"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: isHovered ? 0.9 : 0.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* Decorative corner accents */}
        <motion.div
          className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-pear/60"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.div
          className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-pear/60"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          {/* Category pill */}
          <motion.span
            className="inline-block self-start px-3 py-1 bg-pear/90 text-night-green text-xs uppercase tracking-wider font-nav rounded-sm mb-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{
              x: isHovered ? 0 : -20,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {item.category}
          </motion.span>

          {/* Title with slide-up effect */}
          <motion.h3
            className="text-ivory text-xl md:text-2xl font-heading mb-1"
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            {item.name}
          </motion.h3>

          {/* Price */}
          <motion.span
            className="text-pear/80 text-sm mb-2"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            {item.price}
          </motion.span>

          {/* View details - only visible on hover */}
          <motion.p
            className="text-stone/90 text-sm leading-relaxed uppercase tracking-wider"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 20,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            View Details
          </motion.p>

          {/* Animated line */}
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-pear via-pear/50 to-transparent"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

interface CollectionPageClientProps {
  collectionPage: any
  collectionItems: any[]
}

export function CollectionPageClient({ collectionPage, collectionItems }: CollectionPageClientProps) {
  const heroSection = collectionPage?.heroSection || {}
  const heroRef = useScrollAnimation<HTMLElement>()
  const gridRef = useScrollAnimation<HTMLElement>()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageClick = (item: CollectionItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300)
  }

  const handleNavigate = (item: CollectionItem) => {
    setSelectedItem(item)
  }

  const filteredItems: CollectionItem[] =
    activeCategory === 'All'
      ? collectionItems
      : collectionItems.filter((item) => item.category === activeCategory)

  return (
    <>
      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        allItems={filteredItems}
        onNavigate={handleNavigate}
      />

      <main>
        {/* Hero Section with parallax */}
        {heroSection?.enabled !== false && (
          <section
            ref={heroRef.ref}
            className="relative py-32 md:py-40 bg-night-green overflow-hidden"
          >
            <div className="absolute inset-0 pattern-overlay opacity-20" />

            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pear/5 blur-3xl"
              animate={{
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-pear/5 blur-3xl"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="container-luxury relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroRef.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {heroSection?.eyebrow && (
                  <motion.span
                    className="inline-block text-pear uppercase tracking-[0.3em] text-sm mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {heroSection.eyebrow}
                  </motion.span>
                )}
                <motion.h1
                  initial={{ opacity: 0, y: 60 }}
                  animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-ivory mb-6"
                >
                  {heroSection?.headline || 'Our Collection'}
                </motion.h1>
                {heroSection?.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-xl text-stone max-w-2xl mx-auto"
                  >
                    {heroSection.description}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {/* Filter & Grid */}
        <section ref={gridRef.ref} className="section-padding bg-ivory" id="gallery">
          <div ref={containerRef} className="container-luxury">
            {/* Category Filter - pill style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={gridRef.isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
              {categories.map((category, i) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2.5 rounded-full text-sm uppercase tracking-wider transition-all duration-500 ${
                    activeCategory === category
                      ? 'bg-night-green text-ivory shadow-lg shadow-night-green/20'
                      : 'bg-transparent text-night-green border border-night-green/20 hover:border-night-green hover:bg-night-green/5'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Artistic Masonry Grid */}
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(130px,1fr)]"
            >
              {filteredItems.map((item, index) => (
                <CollectionCard
                  key={item.id}
                  item={item}
                  index={index}
                  isVisible={gridRef.isVisible}
                  onImageClick={handleImageClick}
                />
              ))}
            </motion.div>

            {/* Empty state */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-slate-moss text-lg">No items found in this category.</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

