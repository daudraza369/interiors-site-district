'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

interface AboutPageClientProps {
  aboutPage: any
}

export function AboutPageClient({ aboutPage }: AboutPageClientProps) {
  const heroRef = useScrollAnimation<HTMLElement>()
  const storyRef = useScrollAnimation<HTMLElement>()
  const valuesRef = useScrollAnimation<HTMLElement>()
  const teamRef = useScrollAnimation<HTMLElement>()

  const heroSection = aboutPage?.heroSection || {}
  const storySection = aboutPage?.storySection || {}
  const valuesSection = aboutPage?.valuesSection || {}
  const teamSection = aboutPage?.teamSection || {}

  // Get image URLs
  const getImageUrl = (image: any): string => {
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

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'

  let heroImageUrl = getImageUrl(heroSection?.backgroundImage)
  if (!heroImageUrl) {
    heroImageUrl = `${serverUrl}/api/media/file/hotel-atrium.jpg`
  }

  let storyImageUrl = getImageUrl(storySection?.image)
  if (!storyImageUrl) {
    storyImageUrl = `${serverUrl}/api/media/file/hero-interior.jpg`
  }

  let teamImageUrl = getImageUrl(teamSection?.image)
  if (!teamImageUrl) {
    teamImageUrl = `${serverUrl}/api/media/file/maintenance-tech.jpg`
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        {/* Hero Section */}
        <section ref={heroRef.ref} className="relative min-h-[60vh] bg-night-green overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-night-green via-night-green/90 to-night-green/60 z-10" />
            <motion.img
              src={heroImageUrl}
              alt="About District Interiors"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.parentElement) {
                  target.parentElement.innerHTML =
                    '<div class="absolute inset-0 bg-night-green"></div>'
                }
              }}
            />
          </div>
          <div className="absolute inset-0 pattern-overlay z-20 opacity-20" />

          <div className="relative z-30 min-h-[60vh] flex items-center">
            <div className="container-luxury px-6 md:px-12 lg:px-20 py-32">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-ivory mb-6"
              >
                {heroSection?.headline || 'About District Interiors'}
              </motion.h1>
              {heroSection?.description && (
                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-stone max-w-2xl"
                >
                  {heroSection.description}
                </motion.p>
              )}
            </div>
          </div>
        </section>

        {/* Story Section */}
        {storySection?.enabled !== false && (
          <section ref={storyRef.ref} className="section-padding bg-ivory">
            <div className="container-luxury">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={storyRef.isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  {storySection?.eyebrow && (
                    <span className="text-sm uppercase tracking-widest text-slate-moss mb-4 block">
                      {storySection.eyebrow}
                    </span>
                  )}
                  <h2 className="text-night-green mb-6">
                    {storySection?.headline || 'Designed to Breathe Life Into Spaces'}
                  </h2>
                  {storySection?.paragraph1 && (
                    <p className="text-body text-slate-moss mb-6 leading-relaxed">
                      {storySection.paragraph1}
                    </p>
                  )}
                  {storySection?.paragraph2 && (
                    <p className="text-body text-slate-moss mb-6 leading-relaxed">
                      {storySection.paragraph2}
                    </p>
                  )}
                  {storySection?.paragraph3 && (
                    <p className="text-body text-slate-moss leading-relaxed">
                      {storySection.paragraph3}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={storyRef.isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  {storyImageUrl ? (
                    <div className="aspect-[4/5] rounded-sm overflow-hidden">
                      <img
                        src={storyImageUrl}
                        alt="Our story"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          if (target.parentElement) {
                            target.parentElement.innerHTML =
                              '<div class="aspect-[4/5] rounded-sm bg-stone/20 flex items-center justify-center"><p class="text-slate-moss/40 text-sm">Image placeholder</p></div>'
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] rounded-sm bg-stone/20" />
                  )}
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pear/30 rounded-sm -z-10" />
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Values Section */}
        {valuesSection?.enabled !== false && (
          <section ref={valuesRef.ref} className="section-padding bg-blush">
            <div className="container-luxury">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={valuesRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-night-green mb-4">
                  {valuesSection?.headline || 'Our Values'}
                </h2>
                {valuesSection?.description && (
                  <p className="text-xl text-slate-moss max-w-2xl mx-auto">
                    {valuesSection.description}
                  </p>
                )}
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(valuesSection?.values || []).map((value: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={valuesRef.isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-ivory p-8 rounded-sm"
                  >
                    <h3 className="text-night-green mb-4 text-xl">
                      {value?.title || 'Value Title'}
                    </h3>
                    <p className="text-slate-moss/80">{value?.description || ''}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team Section */}
        {teamSection?.enabled !== false && (
          <section ref={teamRef.ref} className="section-padding bg-night-green pattern-overlay">
            <div className="container-luxury relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={teamRef.isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className="order-2 lg:order-1"
                >
                  {teamImageUrl ? (
                    <div className="aspect-[4/3] rounded-sm overflow-hidden">
                      <img
                        src={teamImageUrl}
                        alt="Our team"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          if (target.parentElement) {
                            target.parentElement.innerHTML =
                              '<div class="aspect-[4/3] rounded-sm bg-night-green/50 flex items-center justify-center"><p class="text-stone/40 text-sm">Image placeholder</p></div>'
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] rounded-sm bg-night-green/50" />
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={teamRef.isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="order-1 lg:order-2"
                >
                  {teamSection?.eyebrow && (
                    <span className="text-sm uppercase tracking-widest text-stone mb-4 block">
                      {teamSection.eyebrow}
                    </span>
                  )}
                  <h2 className="text-ivory mb-6">
                    {teamSection?.headline || 'Experts in Green Design'}
                  </h2>
                  {teamSection?.paragraph1 && (
                    <p className="text-stone mb-6">{teamSection.paragraph1}</p>
                  )}
                  {teamSection?.paragraph2 && (
                    <p className="text-stone/80 mb-8">{teamSection.paragraph2}</p>
                  )}
                  <Link href={teamSection?.ctaLink || '/contact'}>
                    <Button variant="hero" size="lg">
                      {teamSection?.ctaText || 'Work With Us'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}


