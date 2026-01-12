'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sun, Shield, Eye, TreeDeciduous } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getMediaUrl } from '@/lib/mediaUrl'

interface TreeSolutionsPageClientProps {
  treeSolutionsPage: any
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
  Sun,
  Shield,
  Eye,
  TreeDeciduous,
}

export function TreeSolutionsPageClient({ treeSolutionsPage }: TreeSolutionsPageClientProps) {
  const heroRef = useScrollAnimation<HTMLElement>()
  const processRef = useScrollAnimation<HTMLElement>()
  const materialsRef = useScrollAnimation<HTMLElement>()
  const maintenanceRef = useScrollAnimation<HTMLElement>()
  const ctaRef = useScrollAnimation<HTMLElement>()

  const heroSection = treeSolutionsPage?.heroSection || {}
  const processSection = treeSolutionsPage?.processSection || {}
  const materialsSection = treeSolutionsPage?.materialsSection || {}
  const maintenanceSection = treeSolutionsPage?.maintenanceSection || {}
  const consultationSection = treeSolutionsPage?.consultationSection || {}

  // Get image URLs using getMediaUrl utility
  const getImageUrl = (image: any): string => {
    if (!image) return ''
    if (typeof image === 'string') {
      return getMediaUrl(image)
    }
    if (image.url) {
      return getMediaUrl(image.url)
    }
    return ''
  }
  
  // Get image URLs with fallbacks
  let heroImageUrl = getImageUrl(heroSection?.backgroundImage)
  if (!heroImageUrl) {
    heroImageUrl = getMediaUrl('/api/media/file/olive-tree.jpg')
  }

  let materialsImageUrl = getImageUrl(materialsSection?.image)
  if (!materialsImageUrl) {
    materialsImageUrl = getMediaUrl('/api/media/file/tree-detail.jpg')
  }

  let maintenanceImageUrl = getImageUrl(maintenanceSection?.image)
  if (!maintenanceImageUrl) {
    maintenanceImageUrl = getMediaUrl('/api/media/file/maintenance-tech.jpg')
  }

  const scrollToForm = () => {
    const formSection = document.getElementById('consultation-form')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
      {/* Hero Section */}
      <section ref={heroRef.ref} className="relative min-h-[80vh] bg-night-green overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-night-green via-night-green/90 to-night-green/60 z-10" />
          <motion.img
            src={heroImageUrl}
            alt="Custom tree installation"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            onError={(e) => {
              // Fallback to solid color if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.innerHTML = '<div class="absolute inset-0 bg-night-green"></div>'
              }
            }}
          />
        </div>
        <div className="absolute inset-0 pattern-overlay z-20 opacity-20" />

        <div className="relative z-30 min-h-[80vh] flex items-center">
          <div className="container-luxury px-6 md:px-12 lg:px-20 py-32">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-ivory mb-6"
              >
                {heroSection?.headline || 'Trees that Transform Spaces'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-stone mb-6"
              >
                {heroSection?.description || 'From custom creation to restoration, we design, craft, and install trees that bring enduring beauty to homes and businesses alike.'}
              </motion.p>
              {heroSection?.subDescription && (
                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-body text-stone/80 mb-10"
                >
                  {heroSection.subDescription}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button variant="hero" size="lg" onClick={scrollToForm}>
                  {heroSection?.ctaText || 'Book Your Consultation'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      {processSection?.enabled !== false && (
        <section ref={processRef.ref} className="section-padding bg-ivory">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={processRef.isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              {processSection?.eyebrow && (
                <span className="text-sm uppercase tracking-widest text-slate-moss mb-4 block">
                  {processSection.eyebrow}
                </span>
              )}
              <h2 className="text-night-green">
                {processSection?.headline || 'How We Bring Tree Projects to Life'}
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-night-green/20 -translate-x-1/2" />

              <div className="space-y-12 lg:space-y-0">
                {(processSection?.steps || []).map((step: any, index: number) => (
                  <motion.div
                    key={step?.step || index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={processRef.isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className={`lg:grid lg:grid-cols-2 lg:gap-12 items-center ${
                      index % 2 === 0 ? '' : 'lg:direction-rtl'
                    }`}
                  >
                    <div
                      className={`${
                        index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:order-2 lg:pl-12'
                      }`}
                    >
                      <div className="bg-pear/30 p-8 rounded-sm">
                        <span className="text-4xl font-display text-night-green/30 block mb-2">
                          0{step?.step || index + 1}
                        </span>
                        <h3 className="text-night-green mb-3 text-2xl">
                          {step?.title || 'Step Title'}
                        </h3>
                        <p className="text-slate-moss">{step?.description || ''}</p>
                      </div>
                    </div>
                    <div
                      className={`hidden lg:flex justify-center ${
                        index % 2 === 0 ? '' : 'lg:order-1'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-night-green border-4 border-ivory" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Materials Section */}
      {materialsSection?.enabled !== false && (
        <section ref={materialsRef.ref} className="section-padding bg-night-green pattern-overlay">
          <div className="container-luxury relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={materialsRef.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-ivory mb-6">
                  {materialsSection?.headline || 'Built for Beauty and Longevity'}
                </h2>
                <p className="text-xl text-stone mb-4">
                  {materialsSection?.description ||
                    'We engineer every tree to thrive where it\'s planted, indoors or out.'}
                </p>
                {materialsSection?.subDescription && (
                  <p className="text-body text-stone/80 mb-8">
                    {materialsSection.subDescription}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-6">
                  {(materialsSection?.features || []).map((feature: any, index: number) => {
                    const IconComponent = iconMap[feature?.icon] || Sun
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={materialsRef.isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-sm bg-pear/20 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-pear" />
                        </div>
                        <span className="text-ivory text-sm">
                          {feature?.label || 'Feature'}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={materialsRef.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-sm overflow-hidden">
                  <img
                    src={materialsImageUrl}
                    alt="Tree craftsmanship detail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = ''
                      target.style.display = 'none'
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<div class="aspect-[4/3] rounded-sm bg-night-green/50 flex items-center justify-center"><p class="text-stone/40 text-sm">Image placeholder</p></div>'
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Maintenance Section */}
      {maintenanceSection?.enabled !== false && (
        <section ref={maintenanceRef.ref} className="section-padding bg-ivory">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={maintenanceRef.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <div className="aspect-[4/3] rounded-sm overflow-hidden">
                  <img
                    src={maintenanceImageUrl}
                    alt="Tree maintenance"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = ''
                      target.style.display = 'none'
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<div class="aspect-[4/3] rounded-sm bg-stone/20 flex items-center justify-center"><p class="text-slate-moss/40 text-sm">Image placeholder</p></div>'
                      }
                    }}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={maintenanceRef.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-night-green mb-6">
                  {maintenanceSection?.headline || 'We Don\'t Just Install. We Preserve.'}
                </h2>
                <p className="text-xl text-slate-moss mb-4">
                  {maintenanceSection?.description ||
                    'Because every great tree deserves lasting care.'}
                </p>
                {maintenanceSection?.subDescription && (
                  <p className="text-body text-slate-moss/80 mb-8">
                    {maintenanceSection.subDescription}
                  </p>
                )}
                <Button variant="default" size="lg">
                  {maintenanceSection?.ctaText || 'Ask About Maintenance'}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Consultation Form Section */}
      {consultationSection?.enabled !== false && (
        <section ref={ctaRef.ref} id="consultation-form" className="section-padding bg-stone relative">
          <div className="absolute inset-0 pattern-overlay opacity-10" />
          <div className="container-luxury relative z-10">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={ctaRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-night-green mb-4">
                  {consultationSection?.headline || 'Ready to Begin Your Tree Project?'}
                </h2>
                <p className="text-xl text-slate-moss mb-2">
                  {consultationSection?.description || 'Let\'s design something extraordinary together.'}
                </p>
                {consultationSection?.subDescription && (
                  <p className="text-slate-moss/80">{consultationSection.subDescription}</p>
                )}
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 40 }}
                animate={ctaRef.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-ivory p-8 md:p-12 rounded-sm shadow-xl"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                      Project Type
                    </label>
                    <select className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors">
                      <option value="">Select type...</option>
                      {(consultationSection?.projectTypeOptions || []).map((option: any) => (
                        <option key={option?.value} value={option?.value || ''}>
                          {option?.label || option?.value || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                      Preferred Tree Type
                    </label>
                    <select className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors">
                      <option value="">Select type...</option>
                      {(consultationSection?.treeTypeOptions || []).map((option: any) => (
                        <option key={option?.value} value={option?.value || ''}>
                          {option?.label || option?.value || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                      Timeline
                    </label>
                    <select className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors">
                      <option value="">Select timeline...</option>
                      {(consultationSection?.timelineOptions || []).map((option: any) => (
                        <option key={option?.value} value={option?.value || ''}>
                          {option?.label || option?.value || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-sm text-night-green mb-2 uppercase tracking-wider">
                    Project Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-stone/40 rounded-sm bg-transparent focus:border-night-green focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your vision..."
                  />
                </div>
                <Button variant="default" size="lg" className="w-full">
                  {consultationSection?.ctaText || 'Book a Free Consultation'}
                </Button>
              </motion.form>
            </div>
          </div>
        </section>
      )}
      </main>
      <Footer />
    </div>
  )
}

