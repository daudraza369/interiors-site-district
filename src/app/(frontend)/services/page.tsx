import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ServicesPageClient } from './ServicesPageClient'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getServicesPageData() {
  try {
    const payload = await getPayload({ config })

    const servicesPage = await payload.findGlobal({
      slug: 'services-page',
      depth: 2, // Populate backgroundImage (media object) and service images
    })

    const { docs: services } = await payload.find({
      collection: 'services',
      where: {
        isPublished: {
          equals: true,
        },
      },
      sort: 'displayOrder',
      depth: 1, // Populate image media object
    })

    return {
      servicesPage,
      services,
    }
  } catch (error: any) {
    console.error('Error fetching Services Page data:', error)
    // Return default structure on error
    return {
      servicesPage: {
        heroSection: {
          enabled: true,
          headline: 'Our Services',
          description: 'Comprehensive greenery solutions for every space, from bespoke installations to ongoing maintenance.',
        },
        servicesSection: {
          enabled: true,
          headline: null,
        },
        ctaSection: {
          enabled: true,
          headline: 'Ready to Transform Your Space?',
          description: "Let's discuss how our services can bring your vision to life.",
          ctaText: 'Request a Consultation',
          ctaLink: '/contact',
        },
      },
      services: [],
    }
  }
}

export default async function ServicesPage() {
  const { servicesPage, services } = await getServicesPageData()

  // Transform services to convert id from number to string
  const transformedServices = services.map((service: any) => ({
    ...service,
    id: String(service.id),
  }))

  return (
    <div className="min-h-screen bg-ivory" suppressHydrationWarning>
      <Header />
      <main suppressHydrationWarning>
        <ServicesPageClient servicesPage={servicesPage} services={transformedServices} />
      </main>
      <Footer />
    </div>
  )
}

