import { getPayload } from 'payload'
import config from '@payload-config'
import { TreeSolutionsPageClient } from './TreeSolutionsPageClient'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TreeSolutionsPage() {
  const payload = await getPayload({ config })

  let treeSolutionsPage
  try {
    const result = await payload.findGlobal({
      slug: 'tree-solutions-page',
      depth: 2,
    })
    treeSolutionsPage = result
  } catch (error) {
    console.error('Error fetching Tree Solutions page:', error)
    treeSolutionsPage = null
  }

  // Default fallback structure
  const defaultTreeSolutionsPage = {
    heroSection: {
      headline: 'Trees that Transform Spaces',
      description: 'From custom creation to restoration, we design, craft, and install trees that bring enduring beauty to homes and businesses alike.',
      subDescription: 'Every project starts with a conversation. Our consultation experience makes tree selection effortless, guiding you from defining your vision to fine-tuning size, species, and finishes.',
      ctaText: 'Book Your Consultation',
    },
    processSection: {
      enabled: true,
      eyebrow: 'Our Process',
      headline: 'How We Bring Tree Projects to Life',
      steps: [],
    },
    materialsSection: {
      enabled: true,
      headline: 'Built for Beauty and Longevity',
      description: 'We engineer every tree to thrive where it\'s planted, indoors or out.',
      subDescription: 'From UV-resistant foliage to fire-rated olive leaves, each material is chosen for safety, durability, and realism. Whether exposed to sunlight, humidity, or heavy foot traffic, our trees are crafted to endure.',
      features: [],
    },
    maintenanceSection: {
      enabled: true,
      headline: 'We Don\'t Just Install. We Preserve.',
      description: 'Because every great tree deserves lasting care.',
      subDescription: 'Our maintenance programs include scheduled cleaning, leaf replacement, and branch realignment to ensure your trees stay flawless over time. We also offer upgrade options for clients expanding their greenery portfolio.',
      ctaText: 'Ask About Maintenance',
    },
    consultationSection: {
      enabled: true,
      headline: 'Ready to Begin Your Tree Project?',
      description: 'Let\'s design something extraordinary together.',
      subDescription: 'Whether you\'re outfitting a villa courtyard, a restaurant lobby, or a corporate space, our team is ready to guide you.',
      ctaText: 'Book a Free Consultation',
    },
  }

  const pageData = treeSolutionsPage || defaultTreeSolutionsPage

  return <TreeSolutionsPageClient treeSolutionsPage={pageData} />
}


