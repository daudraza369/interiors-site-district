'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { getMediaUrl } from '@/lib/mediaUrl'

interface Project {
  id?: string
  title: string
  projectType: string
  description: string
  heroImage?: {
    url?: string
    alt?: string
  } | string
  location?: string
}

interface PortfolioSectionProps {
  enabled?: boolean
  ctaText?: string
  ctaLink?: string
  projects?: Project[]
}

// Default projects if none provided - matches reference repository exactly
const defaultProjects: Project[] = [
  {
    title: 'Modern Corporate Lobby',
    description: 'Custom planters, preserved wall, and focal tree installation.',
    projectType: 'Offices',
  },
  {
    title: 'Fine Dining Restaurant',
    description: 'Living green wall with preserved moss accents.',
    projectType: 'F&B',
  },
  {
    title: 'Private Villa Garden',
    description: 'Custom olive trees and Mediterranean plantscaping.',
    projectType: 'Private Villa',
  },
  {
    title: 'Co-Working Space',
    description: 'Biophilic design with desk planters and partition walls.',
    projectType: 'Offices',
  },
]

export function PortfolioSection({
  enabled = true,
  ctaText = 'View All Projects',
  ctaLink = '/projects',
  projects = defaultProjects,
}: PortfolioSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>()

  if (!enabled) {
    return null
  }

  // Use default projects if none provided or empty array
  const displayProjects = projects && projects.length > 0 
    ? projects 
    : defaultProjects

  return (
    <section 
      id="portfolio" 
      className="relative py-28 md:py-36 lg:py-44 overflow-hidden gradient-section-light"
    >
      <div ref={ref} className="container-luxury px-6 md:px-12 lg:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-night-green mb-6 uppercase font-heading">
            <span className="block text-3xl md:text-4xl lg:text-5xl">Transformations</span>
            <span className="block text-gradient text-4xl md:text-5xl lg:text-6xl">In Action</span>
          </h2>
          <p className="text-xl text-slate-moss max-w-2xl mx-auto">
            A showcase of spaces we&apos;ve brought to life across the region.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProjects.map((project, index) => {
            // Use getMediaUrl utility for consistent URL handling
            let imageUrl = ''
            let imageAlt = project.title
            
            if (project.heroImage) {
              if (typeof project.heroImage === 'string') {
                imageUrl = getMediaUrl(project.heroImage)
              } else if (typeof project.heroImage === 'object') {
                if (project.heroImage.url) {
                  imageUrl = getMediaUrl(project.heroImage.url)
                } else if (project.heroImage.filename) {
                  imageUrl = getMediaUrl(`/media/${project.heroImage.filename}`)
                }
                imageAlt = project.heroImage.alt || project.title
              }
            }

            return (
              <motion.div
                key={project.id || project.title || index}
                initial={{ opacity: 0, y: 80, filter: 'blur(10px)' }}
                animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={ctaLink}
                  className="group block relative rounded-sm overflow-hidden card-cinematic"
                >
                  <div className="aspect-[9/16]">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={imageAlt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-night-green/20" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-night-green/90 via-night-green/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block px-3 py-1 bg-pear/90 text-night-green text-xs uppercase tracking-wider font-nav rounded-sm mb-3">
                        {project.projectType}
                      </span>
                      <h4 className="text-ivory mb-2 text-lg font-heading">{project.title}</h4>
                      <p className="text-stone/90 text-sm mb-3 line-clamp-2">{project.description}</p>
                      <span className="text-pear flex items-center gap-2 text-sm font-nav uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Project
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link 
            href={ctaLink}
            className="inline-flex items-center gap-2 text-night-green font-nav uppercase tracking-wider hover:text-slate-moss transition-colors group"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

