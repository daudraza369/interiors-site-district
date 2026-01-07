'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface Showroom {
  id: string
  title: string
  description: string
  tourUrl: string
  location: string
  thumbnail: string | { url?: string; filename?: string } | null
}

interface VirtualShowroomSectionProps {
  enabled?: boolean
  badgeText?: string
  headline?: string
  description?: string
  showrooms?: Showroom[]
}

interface TourModalProps {
  isOpen: boolean
  onClose: () => void
  showroom: Showroom | null
}

const TourModal = ({ isOpen, onClose, showroom }: TourModalProps) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen || !showroom) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-night-green/80 backdrop-blur-sm" />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-[95vw] h-[80vh] md:w-[90vw] md:h-[85vh] max-w-[1400px] bg-card rounded-xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-night-green/90 to-transparent">
            <h3 id="modal-title" className="text-lg font-semibold text-ivory">
              {showroom.title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-ivory/10 hover:bg-ivory/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-ivory" />
            </button>
          </div>

          {/* Iframe */}
          <iframe
            src={showroom.tourUrl}
            title={`Virtual tour of ${showroom.title}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface ShowroomCardProps {
  showroom: Showroom
  index: number
  onOpenTour: (showroom: Showroom) => void
}

const ShowroomCard = ({ showroom, index, onOpenTour }: ShowroomCardProps) => {
  const handleClick = () => {
    onOpenTour(showroom)
  }

  const getImageUrl = (
    image: string | { url?: string; filename?: string } | null,
  ): string => {
    if (!image) return ''
    if (typeof image === 'string') {
      if (image.startsWith('http')) return image
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
      return `${serverUrl}${image.startsWith('/') ? '' : '/'}${image}`
    }
    if (image.url) {
      if (image.url.startsWith('http')) return image.url
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
      return `${serverUrl}${image.url.startsWith('/') ? '' : '/'}${image.url}`
    }
    return ''
  }

  const thumbnailUrl = getImageUrl(showroom.thumbnail)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail - clickable */}
      <button
        onClick={handleClick}
        className="relative aspect-video overflow-hidden bg-muted w-full cursor-pointer"
        aria-label={`Open virtual tour of ${showroom.title}`}
      >
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={`${showroom.title} preview`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* 360° Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-ivory/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-pear transition-colors duration-300">
            <span className="text-xl md:text-2xl font-bold text-night-green">360°</span>
          </div>
        </div>

        {/* Virtual Tour Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-night-green/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-pear" />
          <span className="text-xs font-medium text-ivory">Virtual Tour</span>
        </div>

        {/* Location Badge */}
        {showroom.location && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-ivory/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 pointer-events-none">
            <MapPin className="w-3.5 h-3.5 text-night-green" />
            <span className="text-xs font-medium text-night-green">{showroom.location}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-night-green/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="text-ivory font-medium">Click to explore</span>
        </div>
      </button>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-foreground mb-2 font-display">{showroom.title}</h3>
        {showroom.description && (
          <p className="text-muted-foreground text-sm leading-relaxed flex-1 text-balance">
            {showroom.description}
          </p>
        )}

        <Button
          onClick={handleClick}
          className="w-full h-12 font-semibold gap-2 mt-6"
          aria-label={`Take virtual tour of ${showroom.title}`}
        >
          <Eye className="w-4 h-4" />
          Take Virtual Tour
        </Button>
      </div>
    </motion.div>
  )
}

export function VirtualShowroomSection({
  enabled = true,
  badgeText = '360° Experience',
  headline = 'Explore Our Projects Virtually',
  description = 'Take a 360° virtual tour of our interior plantscaping projects, real spaces we\'ve styled with premium plants and floral arrangements',
  showrooms = [],
}: VirtualShowroomSectionProps) {
  const [selectedShowroom, setSelectedShowroom] = useState<Showroom | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  const handleOpenTour = (showroom: Showroom) => {
    setSelectedShowroom(showroom)
    setIsModalOpen(true)
  }

  const handleCloseTour = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedShowroom(null), 300)
  }

  if (!enabled) {
    return null
  }

  // Don't return null if showrooms is empty - let it render empty state
  const displayShowrooms = showrooms || []

  return (
    <>
      <section
        ref={ref}
        className="relative section-padding overflow-hidden"
        aria-labelledby="virtual-showroom-heading"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-sage/10 to-ivory" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pear/5 via-transparent to-transparent" />

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-pear/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-sage/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {badgeText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block px-4 py-1.5 bg-night-green/10 text-night-green rounded-full text-sm font-medium mb-4"
              >
                {badgeText}
              </motion.span>
            )}

            {headline && (
              <h2
                id="virtual-showroom-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-night-green mb-4"
              >
                {headline}
              </h2>
            )}

            {description && (
              <p className="text-lg md:text-xl text-charcoal/70 max-w-3xl mx-auto text-balance">
                {description}
              </p>
            )}
          </motion.div>

          {/* Cards Grid */}
          {displayShowrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayShowrooms.map((showroom, index) => (
                <ShowroomCard key={showroom.id} showroom={showroom} index={index} onOpenTour={handleOpenTour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-moss text-lg">No virtual showrooms available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tour Modal */}
      <TourModal isOpen={isModalOpen} onClose={handleCloseTour} showroom={selectedShowroom} />
    </>
  )
}

