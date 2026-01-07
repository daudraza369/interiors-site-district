import { getPayload } from 'payload'
import config from '@payload-config'
import { AboutPageClient } from './AboutPageClient'

export default async function AboutPage() {
  const payload = await getPayload({ config })

  let aboutPage
  try {
    const result = await payload.findGlobal({
      slug: 'about-page',
      depth: 2,
    })
    aboutPage = result
  } catch (error) {
    console.error('Error fetching About page:', error)
    aboutPage = null
  }

  // Default fallback structure
  const defaultAboutPage = {
    heroSection: {
      headline: 'About District Interiors',
      description:
        'A design-driven approach to greenery, merging natural aesthetics with architectural precision.',
    },
    storySection: {
      enabled: true,
      eyebrow: 'Our Story',
      headline: 'Designed to Breathe Life Into Spaces',
      paragraph1: '',
      paragraph2: '',
      paragraph3: '',
    },
    valuesSection: {
      enabled: true,
      headline: 'Our Values',
      description: 'The principles that guide every project we undertake.',
      values: [],
    },
    teamSection: {
      enabled: true,
      eyebrow: 'Our Team',
      headline: 'Experts in Green Design',
      paragraph1: '',
      paragraph2: '',
      ctaText: 'Work With Us',
      ctaLink: '/contact',
    },
  }

  const pageData = aboutPage || defaultAboutPage

  return <AboutPageClient aboutPage={pageData} />
}


