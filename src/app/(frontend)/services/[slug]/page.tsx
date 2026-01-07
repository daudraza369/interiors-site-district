import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ServiceSubPageClient } from './ServiceSubPageClient'
import { notFound } from 'next/navigation'

// Service metadata mapping
const serviceMetadata: Record<string, { title: string; eyebrow: string; description: string }> = {
  plantscaping: {
    title: 'Plantscaping',
    eyebrow: 'Office & F&B',
    description:
      'Greenery that works as hard as your space. Purposeful greenery that improves focus, comfort, and the way people experience space.',
  },
  maintenance: {
    title: 'Plant Maintenance',
    eyebrow: 'Natural Plant Care',
    description:
      'Keeping every plant at its best. Routine watering, pruning, and replacement programs ensure vibrant greenery year-round.',
  },
  planters: {
    title: 'Custom Planters',
    eyebrow: 'Design & Fabrication',
    description:
      'Planters made to match your design vision. Crafted in GRC, acrylic, or stone with elegance and durability.',
  },
  'green-walls': {
    title: 'Green Walls',
    eyebrow: 'Vertical Landscapes',
    description:
      'Design vertical landscapes that inspire. We create artificial, natural, and preserved moss walls with integrated systems.',
  },
}

async function getServiceSubPageData(slug: string) {
  // Use metadata directly - service-sub-pages global doesn't exist
  const serviceData = serviceMetadata[slug] || null
  return { serviceData }
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ServiceSubPage({ params }: Props) {
  const { slug } = await params
  const { serviceData } = await getServiceSubPageData(slug)

  if (!serviceData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <ServiceSubPageClient serviceData={serviceData} />
      <Footer />
    </div>
  )
}

// Generate static params for known service slugs
export async function generateStaticParams() {
  return Object.keys(serviceMetadata).map((slug) => ({
    slug,
  }))
}

