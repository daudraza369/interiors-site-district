import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HospitalityPageClient } from './HospitalityPageClient'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHospitalityPageData() {
  try {
    const payload = await getPayload({ config })
    const hospitalityPage = await payload.findGlobal({
      slug: 'hospitality-page',
      depth: 1,
    })
    return { hospitalityPage }
  } catch (error: any) {
    console.error('Error fetching Hospitality Page data:', error)
    return {
      hospitalityPage: {
        comingSoonSection: {
          enabled: true,
          badgeText: 'Coming Soon',
          headline: 'HOSPITALITY',
          description:
            "We're crafting exceptional greenery solutions tailored for the hospitality industry. Premium plantscaping for hotels, resorts, and luxury venues is on its way.",
          primaryCtaText: 'Get in Touch',
          primaryCtaLink: '/contact',
          secondaryCtaText: 'Explore Interiors',
          secondaryCtaLink: '/',
        },
      },
    }
  }
}

export default async function HospitalityPage() {
  const { hospitalityPage } = await getHospitalityPageData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-green via-slate-moss to-night-green">
      <Header />
      <HospitalityPageClient hospitalityPage={hospitalityPage} />
      <Footer />
    </div>
  )
}



