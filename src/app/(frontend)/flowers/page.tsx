import { getPayload } from 'payload'
import config from '@payload-config'
import { FlowersPageClient } from './FlowersPageClient'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

async function getFlowersPageData() {
  try {
    const payload = await getPayload({ config })

    const flowersPage = await payload.findGlobal({
      slug: 'flowers-page',
      depth: 2, // Ensure images are populated
    })

    return {
      flowersPage,
    }
  } catch (error: any) {
    console.error('Error fetching Flowers Page data:', error)
    return {
      flowersPage: {
        heroSection: {
          enabled: true,
          headline: 'Premium Wholesale Flowers,\nFresh from Source',
          subheadline:
            'Direct imports from Holland & Kenya • Weekly shipments • Trusted supplier to Fairmont Hotels',
          badges: [
            { icon: 'Plane', text: 'Holland & Kenya Direct Imports' },
            { icon: 'CalendarClock', text: 'Fresh Weekly Arrivals' },
            { icon: 'Building2', text: 'Fairmont Hotel Partner' },
          ],
        },
        catalogSection: {
          enabled: true,
          eyebrow: 'Download Now',
          headline: "This Week's Wholesale Pricelist",
          catalogUrl:
            'https://download1588.mediafire.com/qvunnvifx7ig90xjG3uF2EGBhSEvkIToAlTZkZTYwMAMpjcW9fIlb72B9BqVsQ2ovqC_EPkGuy6Wmkvgd--M-EzrkTr0AEN335sgo2_05pTiuGo_Bzv_K5f1RWDesQlsj5YWF6ARu9ShXTa5lQc67hHQk_tLqnMrPotvFL9ElP6f/488cgm2x4it6hit/DF — Dec 31 2025 — Wholesale Catalog.pdf',
          buttonText: 'Download the Full Catalogue for Latest Arrivals',
        },
        benefitsSection: {
          enabled: true,
          eyebrow: 'The District Difference',
          headline: 'Why Choose District Flowers',
          benefits: [
            {
              icon: 'Truck',
              title: 'Reliable Supply',
              description:
                'Weekly shipments plus emergency backup stock ensure you never run short.',
            },
            {
              icon: 'Award',
              title: 'Premium Quality',
              description:
                'Hotel-grade flowers at wholesale prices, sourced from specialty farms.',
            },
            {
              icon: 'Flower2',
              title: 'Wide Selection',
              description:
                "Extensive variety from Holland and Kenya's finest specialty farms.",
            },
          ],
        },
      },
    }
  }
}

export default async function FlowersPage() {
  let flowersPageData
  try {
    const result = await getFlowersPageData()
    flowersPageData = result.flowersPage
  } catch (error: any) {
    console.error('Failed to load Flowers Page data:', error)
    flowersPageData = {
      heroSection: { enabled: false },
      catalogSection: { enabled: false },
      benefitsSection: { enabled: false },
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <FlowersPageClient flowersPage={flowersPageData} />
      <Footer />
    </div>
  )
}


