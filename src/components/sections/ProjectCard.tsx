'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState, useRef } from 'react'
import { getMediaUrl } from '@/lib/mediaUrl'

interface Project {
  id: string
  title: string
  projectType: string | null
  location: string | null
  description: string | null
  heroImage: string | null | { url?: string; filename?: string }
  videoUrl: string | null
}

interface ProjectCardProps {
  project: Project
  index: number
  isVisible: boolean
  onPlayClick: (project: Project) => void
}

export function ProjectCard({
  project,
  index,
  isVisible,
  onPlayClick,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
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
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (project.videoUrl) {
      onPlayClick(project)
    }
  }

  const getImageUrl = (
    image: string | null | { url?: string; filename?: string },
  ): string => {
    if (!image) return ''
    if (typeof image === 'string') {
      // Use getMediaUrl utility for consistent URL handling
      return getMediaUrl(image)
    }
    if (image.url) {
      // Use getMediaUrl utility for consistent URL handling
      return getMediaUrl(image.url)
    }
    if (image.filename) {
      // Construct URL from filename using utility
      return getMediaUrl(`/media/${image.filename}`)
    }
    return ''
  }

  // Staggered layout - alternating sizes
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
  const hasVideo = !!project.videoUrl
  const imageUrl = getImageUrl(project.heroImage)

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
                delay: index * 0.12,
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${layoutClass} group cursor-pointer perspective-1000`}
      style={{
        transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div
        className={`relative overflow-hidden rounded-sm h-full ${
          isTall ? 'min-h-[500px] md:min-h-[600px]' : 'min-h-[280px] md:min-h-[320px]'
        }`}
      >
        {/* Media with parallax effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={project.videoUrl || undefined}
              className="w-full h-full object-cover pointer-events-none"
              muted
              loop
              playsInline
              controlsList="nodownload"
              poster={imageUrl || undefined}
            />
          ) : (
            imageUrl ? (
              <img
                src={imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-moss/20" />
            )
          )}
        </motion.div>

        {/* Color overlay on hover */}
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

        {/* Video play button */}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.button
              onClick={handlePlayClick}
              className="pointer-events-auto relative"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0.7,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-pear/30"
                animate={{
                  scale: isHovered ? [1, 1.5, 1] : 1,
                  opacity: isHovered ? [0.5, 0, 0.5] : 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-ivory/20 backdrop-blur-md flex items-center justify-center border border-ivory/30 hover:bg-pear/90 hover:border-pear transition-all duration-500">
                <Play
                  className="w-6 h-6 md:w-8 md:h-8 text-ivory ml-1 group-hover:text-night-green transition-colors duration-500"
                  fill="currentColor"
                />
              </div>
            </motion.button>
          </div>
        )}

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
            {project.projectType || 'Project'}
          </motion.span>

          {/* Title */}
          <motion.h3
            className="text-ivory text-xl md:text-2xl font-heading mb-1"
            initial={{ y: 20 }}
            animate={{ y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            {project.title}
          </motion.h3>

          {/* Location */}
          {project.location && (
            <motion.span
              className="text-pear/80 text-sm mb-2"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              {project.location}
            </motion.span>
          )}

          {/* Description */}
          {project.description && (
            <motion.p
              className="text-stone/90 text-sm leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {project.description}
            </motion.p>
          )}

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


