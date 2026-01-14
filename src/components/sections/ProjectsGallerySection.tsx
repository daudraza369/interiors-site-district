'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { ProjectCard } from './ProjectCard'
import { VideoModal } from './VideoModal'

interface Category {
  label: string
  value: string
}

interface Project {
  id: string
  title: string
  projectType: string | null
  location: string | null
  description: string | null
  heroImage: string | null | { url?: string; filename?: string }
  videoUrl: string | null
}

interface ProjectsGallerySectionProps {
  enabled?: boolean
  categories?: Category[]
  projects: Project[]
}

export function ProjectsGallerySection({
  enabled = true,
  categories = [
    { label: 'All', value: 'All' },
    { label: 'Office', value: 'Office' },
    { label: 'Hospitality', value: 'Hospitality' },
    { label: 'F&B', value: 'F&B' },
    { label: 'Villa', value: 'Villa' },
  ],
  projects = [],
}: ProjectsGallerySectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeVideoProject, setActiveVideoProject] = useState<Project | null>(null)

  if (!enabled) {
    return null
  }

  // Filter projects by category
  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.projectType === activeCategory)

  // Ensure categories array exists and has at least "All"
  const displayCategories =
    categories && categories.length > 0
      ? categories
      : [{ label: 'All', value: 'All' }]

  return (
    <>
      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoProject && activeVideoProject.videoUrl && (
          <VideoModal
            project={activeVideoProject}
            onClose={() => setActiveVideoProject(null)}
          />
        )}
      </AnimatePresence>

      <section ref={ref} className="section-padding bg-ivory" id="gallery">
        <div className="container-luxury">
          {/* Category Filter - pill style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {displayCategories.map((category, i) => (
              <motion.button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full text-sm uppercase tracking-wider transition-all duration-500 ${
                  activeCategory === category.value
                    ? 'bg-night-green text-ivory shadow-lg shadow-night-green/20'
                    : 'bg-transparent text-night-green border border-night-green/20 hover:border-night-green hover:bg-night-green/5'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(140px,1fr)]"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isVisible={isVisible}
                  onPlayClick={setActiveVideoProject}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-slate-moss text-lg">
                No projects found in this category.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

