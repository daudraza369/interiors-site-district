'use client'

import { motion } from 'framer-motion'

export function StylingPageClient({ stylingPage }: { stylingPage: any }) {
  const comingSoon = stylingPage?.comingSoonSection || {}

  if (comingSoon?.enabled === false) return null

  return (
    <main className="pt-32 pb-20">
      <div className="container-luxury px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {comingSoon?.eyebrow && (
            <p className="text-xs tracking-[0.3em] uppercase text-slate-moss mb-4">
              {comingSoon.eyebrow}
            </p>
          )}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-night-green mb-6">
            {comingSoon?.headline || 'Styling'}
          </h1>
          {comingSoon?.description && (
            <p className="text-slate-moss max-w-2xl mx-auto text-lg">
              {comingSoon.description}
            </p>
          )}
        </motion.div>
      </div>
    </main>
  )
}


