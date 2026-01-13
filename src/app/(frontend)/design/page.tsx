import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DesignPageClient } from './DesignPageClient'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDesignPageData() {
  try {
    const payload = await getPayload({ config })
    // Keep using 'styling-page' slug as the CMS global name hasn't changed
    const designPage = await payload.findGlobal({
      slug: 'styling-page',
      depth: 1,
    })
    return { designPage }
  } catch (error: any) {
    console.error('Error fetching Design Page data:', error)
    return {
      designPage: {
        comingSoonSection: {
          enabled: true,
          eyebrow: 'Interior Design',
          headline: 'Design',
          description:
            "Bespoke interior design solutions that seamlessly integrate living greenery into your architectural vision.",
          contentText: "Content coming soon. We're crafting something beautiful for this page.",
        },
      },
    }
  }
}

export default async function DesignPage() {
  const { designPage } = await getDesignPageData()

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <DesignPageClient designPage={designPage} />
      <Footer />
    </div>
  )
}

