import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactPageClient } from './ContactPageClient'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata = generatePageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with District Interiors. Let us help transform your space with premium plantscaping and custom greenery solutions.',
  path: '/contact',
})

async function getContactPageData() {
  try {
    const payload = await getPayload({ config })

    const contactPage = await payload.findGlobal({
      slug: 'contact-page',
      depth: 1,
    })

    return {
      contactPage,
    }
  } catch (error: any) {
    console.error('Error fetching Contact Page data:', error)
    // Return default structure on error
    return {
      contactPage: {
        heroSection: {
          enabled: true,
          headline: 'Contact Us',
          description: "Let's bring nature into your space. Connect with our design team to start your project.",
        },
        contactSection: {
          enabled: true,
          headline: 'Get in Touch',
          description: "Whether you're planning a complete transformation or exploring options for your space, we're here to help. Reach out and let's discuss how we can bring your vision to life.",
          contactInfo: {
            email: 'Sales@district.sa',
            phone: '+966 056 228 8177',
            whatsapp: '+966 50 060 6506',
            address: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
            googleMaps: 'https://share.google/OwSIbmaVwv0vXcatO',
          },
          socialLinks: [
            { label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' },
            { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' },
            { label: 'Snapchat', href: '#', abbr: 'SC' },
          ],
          projectTypes: [
            { label: 'Select a service...', value: '' },
            { label: 'Plantscaping', value: 'plantscaping' },
            { label: 'Tree Customization', value: 'tree-customization' },
            { label: 'Tree Restoration', value: 'tree-restoration' },
            { label: 'Green Walls', value: 'green-walls' },
            { label: 'Custom Planter Design', value: 'planters' },
            { label: 'Maintenance', value: 'maintenance' },
            { label: 'Other', value: 'other' },
          ],
          formButtonText: 'Send Message',
        },
      },
    }
  }
}

export default async function ContactPage() {
  const { contactPage } = await getContactPageData()

  return (
    <div className="min-h-screen bg-ivory" suppressHydrationWarning>
      <Header />
      <main suppressHydrationWarning>
        <ContactPageClient contactPage={contactPage} />
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  )
}

