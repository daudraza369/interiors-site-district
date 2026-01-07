import { getPayload } from 'payload'
import config from '@payload-config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StylingPageClient } from './StylingPageClient'

async function getStylingPageData() {
  try {
    const payload = await getPayload({ config })
    const stylingPage = await payload.findGlobal({
      slug: 'styling-page',
      depth: 1,
    })
    return { stylingPage }
  } catch (error: any) {
    console.error('Error fetching Styling Page data:', error)
    return {
      stylingPage: {
        comingSoonSection: {
          enabled: true,
          eyebrow: 'Interior Styling',
          headline: 'Styling',
          description: "Content coming soon. We're crafting something beautiful for this page.",
        },
      },
    }
  }
}

export default async function StylingPage() {
  const { stylingPage } = await getStylingPageData()

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <StylingPageClient stylingPage={stylingPage} />
      <Footer />
    </div>
  )
}

