'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useCallback } from 'react'
import { getMediaUrl } from '@/lib/mediaUrl'

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

// Helper function to detect and convert YouTube/Vimeo URLs to embed format
function getVideoEmbedUrl(url: string): { isEmbed: boolean; embedUrl: string } {
  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  // Vimeo URL patterns
  const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
  
  // Check if it's a YouTube URL
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
    }
  }
  
  // Check if it's a Vimeo URL
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    const videoId = vimeoMatch[1]
    return {
      isEmbed: true,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
    }
  }
  
  // Not an embed URL, return as-is for direct video files
  return {
    isEmbed: false,
    embedUrl: url,
  }
}

export function VideoModal({ project, onClose }: VideoModalProps) {
  // Handle escape key
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

  // Get poster image URL
  const posterUrl = project.heroImage ? getMediaUrl(project.heroImage) : undefined
  
  // Check if video URL is YouTube/Vimeo or direct video file
  const videoInfo = getVideoEmbedUrl(project.videoUrl)
  const isEmbed = videoInfo.isEmbed

  return (
    <AnimatePresence>
      {project && project.videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

          {/* Close button - positioned outside content */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Modal Content - centered video */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-[90vw] max-w-[1400px] bg-black rounded-lg overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with title */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-night-green to-night-green/80">
              <div>
                <h3 id="video-modal-title" className="text-lg font-semibold text-ivory">
                  {project.title}
                </h3>
                <p className="text-pear/80 text-sm">{project.location}</p>
              </div>
            </div>

            {/* Video with full controls */}
            <div className="relative w-full" style={{ height: '75vh' }}>
              {isEmbed ? (
                // YouTube/Vimeo embed
                <iframe
                  src={videoInfo.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  title={`${project.title} video`}
                />
              ) : (
                // Direct video file
                <video
                  src={videoInfo.embedUrl}
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                  playsInline
                  controlsList="nodownload"
                  poster={posterUrl}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
