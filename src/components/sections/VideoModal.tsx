'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useCallback } from 'react'

interface Project {
  id: string
  title: string
  projectType: string | null
  location: string | null
  description: string | null
  heroImage: string | null
  videoUrl: string | null
}

interface VideoModalProps {
  project: Project | null
  onClose: () => void
}

export function VideoModal({ project, onClose }: VideoModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (project) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }
  }, [project, handleEscape])

  if (!project || !project.videoUrl) {
    return null
  }

  const getImageUrl = (image: string | null | { url?: string; filename?: string }): string => {
    if (!image) return ''
    if (typeof image === 'string') {
      // If it's already a full URL, return it
      if (image.startsWith('http')) return image
      // If it's a relative path, make it absolute
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
      return `${serverUrl}${image.startsWith('/') ? '' : '/'}${image}`
    }
    // If it's a Payload media object
    if (image.url) {
      if (image.url.startsWith('http')) return image.url
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'
      return `${serverUrl}${image.url.startsWith('/') ? '' : '/'}${image.url}`
    }
    return ''
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
        aria-labelledby="video-modal-title"
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
              <h3 id="video-modal-title" className="text-lg font-semibold text-ivory">
                {project.title}
              </h3>
              {project.location && (
                <p className="text-pear/80 text-sm">{project.location}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-ivory/10 hover:bg-ivory/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-ivory" />
            </button>
          </div>

          {/* Video */}
          <video
            src={project.videoUrl}
            className="max-w-[90vw] max-h-[80vh] object-contain"
            controls
            autoPlay
            playsInline
            poster={getImageUrl(project.heroImage) || undefined}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


