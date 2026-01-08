import { getPayload } from 'payload'
import config from '@payload-config'
import { CollectionPageClient } from './CollectionPageClient'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCollectionData() {
  try {
    const payload = await getPayload({ config })

    const [collectionPage, collectionItemsResult] = await Promise.all([
      payload.findGlobal({
        slug: 'collection-page',
        depth: 2,
      }),
      payload.find({
        collection: 'collection-items',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: 'displayOrder',
        depth: 2, // Ensure images are populated
      }),
    ])

    return {
      collectionPage,
      collectionItems: collectionItemsResult.docs || [],
    }
  } catch (error: any) {
    console.error('Error fetching Collection data:', error)
    return {
      collectionPage: {
        heroSection: {
          enabled: true,
          eyebrow: 'Curated Greenery',
          headline: 'Our Collection',
          description:
            'Premium greenery solutions for every environment. Explore our curated selection of trees, plants, and planters.',
        },
      },
      collectionItems: [],
    }
  }
}

export default async function CollectionPage() {
  let collectionPageData: any
  let collectionItems: any[] = []
  try {
    const result = await getCollectionData()
    collectionPageData = result.collectionPage
    collectionItems = result.collectionItems
  } catch (error: any) {
    console.error('Failed to load Collection data:', error)
    collectionPageData = {
      heroSection: {
        enabled: true,
        eyebrow: 'Curated Greenery',
        headline: 'Our Collection',
        description:
          'Premium greenery solutions for every environment. Explore our curated selection of trees, plants, and planters.',
      },
    }
    collectionItems = []
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <CollectionPageClient collectionPage={collectionPageData} collectionItems={collectionItems} />
      <Footer />
    </div>
  )
}

