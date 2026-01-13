'use client'

import { motion } from 'framer-motion'

export function DesignPageClient({ designPage }: { designPage: any }) {
  const comingSoon = designPage?.comingSoonSection || {}

  // Default values matching new repo
  const heroEyebrow = comingSoon?.eyebrow || 'Interior Design'
  const heroHeadline = comingSoon?.headline || 'Design'
  const heroDescription =
    comingSoon?.description ||
    "Bespoke interior design solutions that seamlessly integrate living greenery into your architectural vision."
  const contentText = comingSoon?.contentText || "Content coming soon. We're crafting something beautiful for this page."

  return (
    <>
      {/* Dark Green Hero Section - matching Collection page */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-night-green">
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, hsl(155 22% 14%) 0%, hsl(155 22% 18%) 50%, hsl(155 22% 22%) 100%)',
          }}
        />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pear/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-moss/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container-luxury px-6 md:px-12 lg:px-20 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs tracking-[0.3em] uppercase text-pear mb-4"
            >
              {heroEyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-ivory mb-6"
            >
              {heroHeadline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-ivory/70 max-w-2xl mx-auto text-lg"
            >
              {heroDescription}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      {comingSoon?.enabled !== false && contentText && (
        <main className="py-20">
          <div className="container-luxury px-6 md:px-12 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-slate-moss max-w-2xl mx-auto text-lg">
                {contentText}
              </p>
            </motion.div>
          </div>
        </main>
      )}
    </>
  )
}
