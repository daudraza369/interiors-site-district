import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { HeroSection } from '@/components/sections/HeroSection'
import { generatePageMetadata, generateStructuredData } from '@/lib/metadata'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = generatePageMetadata({
  title: 'Home',
  description:
    'Transforming spaces through expert plantscaping, luxury softscaping, and custom tree fabrication. Premium greenery solutions for offices, hospitality, and residential spaces.',
})
import { ClientLogosSection } from '@/components/sections/ClientLogosSection'
import { ProblemFramingSection } from '@/components/sections/ProblemFramingSection'
import { SectionDivider } from '@/components/sections/SectionDivider'
import { ExpertQuotesCarousel } from '@/components/sections/ExpertQuotesCarousel'
import { OurApproachSection } from '@/components/sections/OurApproachSection'
import { WhyChooseUsSection } from '@/components/sections/WhyChooseUsSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { DifferentiationSection } from '@/components/sections/DifferentiationSection'
import { TreeConsultationPreview } from '@/components/sections/TreeConsultationPreview'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { VirtualShowroomSection } from '@/components/sections/VirtualShowroomSection'
import { getPayload } from 'payload'
import config from '@payload-config'
import { withDefaultsHomePage } from '@/lib/cmsDefaults'
import { HomePage as HomePageType, VirtualShowroom } from '../../payload-types'
import { normalizeShowroom } from '@/lib/normalizeShowroom'
import { getMediaUrl } from '@/lib/mediaUrl'

async function getHomePageData() {
  // Default empty data structure - always return something
  const defaultData = {
    homePage: {
      clientLogosSection: { enabled: true, logos: [] },
      problemFramingSection: { enabled: true, problems: [] },
      expertQuotesCarousel: { enabled: true, quotes: [] },
      ourApproachSection: { enabled: true, approachPoints: [] },
      whyChooseUsSection: { enabled: true, benefits: [] },
      statsSection: { enabled: true, headline: null, stats: [] },
      portfolioSection: { enabled: true, headline: 'Transformations', subheadline: "A showcase of spaces we've brought to life across the region.", projects: [], ctaText: 'View All Projects', ctaLink: '/projects' },
      differentiationSection: { enabled: true, headline: 'Not All Plantscaping', headlineSecond: 'Is Created Equal', subheadline: 'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.', comparisonPoints: [], ctaText: "Ready to experience the difference? Let's talk →", ctaLink: '/contact' },
      treeConsultationPreview: { enabled: true, badgeText: 'Featured Service', headline: 'Custom Tree', headlineSecond: 'Solutions', description: 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.', ctaText: 'Explore Tree Solutions', ctaLink: '/tree-solutions', secondaryCtaText: 'View Collection', secondaryCtaLink: '/collection', statNumber: '50+', statLabel: 'Tree species available' },
      testimonialsSection: { enabled: true, headline: 'Trusted By Industry Leaders', subheadline: "What our clients say about working with District", maxTestimonials: 5 },
      contactSection: { enabled: true, badgeText: 'Start Your Transformation', headline: "Let's Create", headlineSecond: 'Something Remarkable', subheadline: "Every great space starts with a conversation. Tell us about your vision.", ctaText: 'Request Consultation', contactInfo: { email: 'Sales@district.sa', phone: '+966 056 228 8177', whatsapp: '+966 50 060 6506', address: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214', googleMaps: 'https://share.google/OwSIbmaVwv0vXcatO' }, socialLinks: [{ label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' }, { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' }, { label: 'Snapchat', href: '#', abbr: 'SC' }], projectTypes: [{ type: 'Corporate Office' }, { type: 'Hotel / Hospitality' }, { type: 'Restaurant / F&B' }, { type: 'Retail Space' }, { type: 'Private Residence' }, { type: 'Healthcare Facility' }, { type: 'Other' }] },
      sectionDivider: { enabled: true, transitionText: 'But the research goes deeper' },
    },
    testimonials: [],
    showrooms: [],
  }

  let payload
  try {
    payload = await getPayload({ config })
  } catch (initError: any) {
    // If Payload initialization fails (e.g., during migration), return empty data
    return defaultData
  }
  
  if (!payload) {
    return defaultData
  }
  
  try {
    // Fetch HomePage global (includes client logos and stats)
    // Use depth: 2 to populate logo relationships in arrays
    const homePage = await payload.findGlobal({
      slug: 'home-page',
      depth: 2, // Populate logo relationships
    })
    
    // Fetch published testimonials
    let testimonials: any[] = []
    try {
      const testimonialsResult = await payload.find({
        collection: 'testimonials',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: 'displayOrder',
        limit: homePage?.testimonialsSection?.maxTestimonials || 5,
        depth: 1, // Populate authorImage if present
      })
      testimonials = testimonialsResult.docs || []
    } catch (testimonialError) {
      // Silently fail - use empty array
      testimonials = []
    }
    
    // Fetch published virtual showrooms
    let showrooms: VirtualShowroom[] = []
    try {
      const showroomsResult = await payload.find({
        collection: 'virtual-showrooms',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: 'displayOrder',
        depth: 1, // Populate thumbnail image
      })
      showrooms = showroomsResult.docs || []
    } catch (showroomError) {
      showrooms = []
    }
    
    return {
      homePage: withDefaultsHomePage(homePage || defaultData.homePage),
      testimonials,
      showrooms,
    }
  } catch (error: any) {
    // Silently handle database errors - return empty structure
    // This prevents the site from crashing during schema migrations
    // Catches both query errors and migration errors
    return defaultData
  }
}

export default async function HomePage() {
  let homePageData
  let testimonials: any[] = []
  let showrooms: VirtualShowroom[] = []
  try {
    const result = await getHomePageData()
    homePageData = withDefaultsHomePage(result.homePage)
    testimonials = result.testimonials || []
    showrooms = result.showrooms || []
  } catch (error: any) {
    // If everything fails, use default empty structure
    homePageData = {
      clientLogosSection: { enabled: true, logos: [] },
      problemFramingSection: { enabled: true, problems: [] },
      expertQuotesCarousel: { enabled: true, quotes: [] },
      ourApproachSection: { enabled: true, approachPoints: [] },
      whyChooseUsSection: { enabled: true, benefits: [] },
      statsSection: { enabled: true, headline: null, stats: [] },
      portfolioSection: { enabled: true, headline: 'Transformations', subheadline: "A showcase of spaces we've brought to life across the region.", projects: [], ctaText: 'View All Projects', ctaLink: '/projects' },
      differentiationSection: { enabled: true, headline: 'Not All Plantscaping', headlineSecond: 'Is Created Equal', subheadline: 'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.', comparisonPoints: [], ctaText: "Ready to experience the difference? Let's talk →", ctaLink: '/contact' },
      treeConsultationPreview: { enabled: true, badgeText: 'Featured Service', headline: 'Custom Tree', headlineSecond: 'Solutions', description: 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.', ctaText: 'Explore Tree Solutions', ctaLink: '/tree-solutions', secondaryCtaText: 'View Collection', secondaryCtaLink: '/collection', statNumber: '50+', statLabel: 'Tree species available' },
      testimonialsSection: { enabled: true, headline: 'Trusted By Industry Leaders', subheadline: "What our clients say about working with District", maxTestimonials: 5 },
      contactSection: { enabled: true, badgeText: 'Start Your Transformation', headline: "Let's Create", headlineSecond: 'Something Remarkable', subheadline: "Every great space starts with a conversation. Tell us about your vision.", ctaText: 'Request Consultation', contactInfo: { email: 'Sales@district.sa', phone: '+966 056 228 8177', whatsapp: '+966 50 060 6506', address: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214', googleMaps: 'https://share.google/OwSIbmaVwv0vXcatO' }, socialLinks: [{ label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' }, { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' }, { label: 'Snapchat', href: '#', abbr: 'SC' }], projectTypes: [{ type: 'Corporate Office' }, { type: 'Hotel / Hospitality' }, { type: 'Restaurant / F&B' }, { type: 'Retail Space' }, { type: 'Private Residence' }, { type: 'Healthcare Facility' }, { type: 'Other' }] },
      sectionDivider: { enabled: true, transitionText: 'But the research goes deeper' },
      virtualShowroomSection: { enabled: true, badgeText: '360° Experience', headline: 'Explore Our Projects Virtually', description: 'Take a 360° virtual tour of our interior plantscaping projects, real spaces we\'ve styled with premium plants and floral arrangements' },
    }
    testimonials = []
    showrooms = []
  }
  
  const homePage = homePageData || {
    clientLogosSection: { enabled: true, logos: [] },
    problemFramingSection: { enabled: true, problems: [] },
    expertQuotesCarousel: { enabled: true, quotes: [] },
    ourApproachSection: { enabled: true, approachPoints: [] },
    whyChooseUsSection: { enabled: true, benefits: [] },
    statsSection: { enabled: true, headline: null, stats: [] },
    portfolioSection: { enabled: true, headline: 'Transformations', subheadline: "A showcase of spaces we've brought to life across the region.", projects: [], ctaText: 'View All Projects', ctaLink: '/projects' },
    differentiationSection: { enabled: true, headline: 'Not All Plantscaping', headlineSecond: 'Is Created Equal', subheadline: 'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.', comparisonPoints: [], ctaText: "Ready to experience the difference? Let's talk →", ctaLink: '/contact' },
    treeConsultationPreview: { enabled: true, badgeText: 'Featured Service', headline: 'Custom Tree', headlineSecond: 'Solutions', description: 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.', ctaText: 'Explore Tree Solutions', ctaLink: '/tree-solutions', secondaryCtaText: 'View Collection', secondaryCtaLink: '/collection', statNumber: '50+', statLabel: 'Tree species available' },
    testimonialsSection: { enabled: true, headline: 'Trusted By Industry Leaders', subheadline: "What our clients say about working with District", maxTestimonials: 5 },
    contactSection: { enabled: true, badgeText: 'Start Your Transformation', headline: "Let's Create", headlineSecond: 'Something Remarkable', subheadline: "Every great space starts with a conversation. Tell us about your vision.", ctaText: 'Request Consultation', contactInfo: { email: 'Sales@district.sa', phone: '+966 056 228 8177', whatsapp: '+966 50 060 6506', address: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214', googleMaps: 'https://share.google/OwSIbmaVwv0vXcatO' }, socialLinks: [{ label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' }, { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' }, { label: 'Snapchat', href: '#', abbr: 'SC' }], projectTypes: [{ type: 'Corporate Office' }, { type: 'Hotel / Hospitality' }, { type: 'Restaurant / F&B' }, { type: 'Retail Space' }, { type: 'Private Residence' }, { type: 'Healthcare Facility' }, { type: 'Other' }] },
    sectionDivider: { enabled: true, transitionText: 'But the research goes deeper' },
    virtualShowroomSection: { enabled: true, badgeText: '360° Experience', headline: 'Explore Our Projects Virtually', description: 'Take a 360° virtual tour of our interior plantscaping projects, real spaces we\'ve styled with premium plants and floral arrangements' },
  }
  
  // Get client logos from the global (they're now in clientLogosSection.logos array)
  const clientLogos = homePage.clientLogosSection?.logos || []
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Client Logos Debug:', {
      totalLogos: clientLogos.length,
      firstLogo: clientLogos[0],
      sectionEnabled: homePage.clientLogosSection?.enabled,
    })
  }
  
  // Sort by displayOrder
  const sortedLogos = [...clientLogos].sort((a: any, b: any) => 
    (a.displayOrder || 0) - (b.displayOrder || 0)
  )
  
  // Transform client logos for the component
  const transformedLogos = sortedLogos.map((logo: any, index: number) => {
    // Handle logo - with depth: 2, it should be a populated Media object
    let logoUrl = ''
    let logoAlt = logo.clientName
    
    if (logo.logo) {
      if (typeof logo.logo === 'object' && logo.logo.url) {
        // Debug: Log the raw URL from Payload
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEBUG] Logo ${logo.clientName} raw URL:`, logo.logo.url)
        }
        // Use utility function to construct proper media URL
        logoUrl = getMediaUrl(logo.logo.url)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEBUG] Logo ${logo.clientName} final URL:`, logoUrl)
        }
        logoAlt = logo.logo.alt || logo.clientName
      } else if (typeof logo.logo === 'number') {
        // If it's just an ID, we'd need to fetch it, but with depth: 2 it should be populated
        console.warn(`Logo for ${logo.clientName} is not populated. Ensure depth: 2 is set.`)
      }
    }
    
    return {
      id: String(logo.id || index),
      clientName: logo.clientName,
      logo: logoUrl ? {
        url: logoUrl,
        alt: logoAlt,
      } : undefined,
      websiteUrl: logo.websiteUrl || null,
    }
  })
  
  // Transform portfolio projects for the component
  const portfolioProjects = homePage.portfolioSection?.projects || []
  const transformedProjects = portfolioProjects.map((project: any, index: number) => {
    // Handle heroImage - with depth: 2, it should be a populated Media object
    let imageUrl = ''
    let imageAlt = project.title
    
    if (project.heroImage) {
      if (typeof project.heroImage === 'object' && project.heroImage.url) {
        // Debug: Log the raw URL from Payload
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEBUG] Project ${project.title} raw URL:`, project.heroImage.url)
        }
        // Use utility function to construct proper media URL
        imageUrl = getMediaUrl(project.heroImage.url)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEBUG] Project ${project.title} final URL:`, imageUrl)
        }
        imageAlt = project.heroImage.alt || project.title
      } else if (typeof project.heroImage === 'number') {
        // If it's just an ID, with depth: 2 it should be populated
        console.warn(`Image for ${project.title} is not populated. Ensure depth: 2 is set.`)
      }
    }
    
    return {
      id: String(project.id || index),
      title: project.title,
      projectType: project.projectType,
      description: project.description,
      heroImage: imageUrl ? {
        url: imageUrl,
        alt: imageAlt,
      } : undefined,
    }
  })
  
  return (
    <div className="min-h-screen bg-ivory" suppressHydrationWarning>
      <Header />
      <main suppressHydrationWarning>
        {/* Hero Section - Section 1 */}
        <HeroSection slides={homePage.heroSection?.slides || []} />
        
        {/* Client Logos Section - Section 2 */}
        {homePage.clientLogosSection?.enabled !== false && transformedLogos.length > 0 && (
          <ClientLogosSection
            enabled={homePage.clientLogosSection?.enabled ?? true}
            headline={homePage.clientLogosSection?.headline || 'Industry Leaders'}
            maxLogos={homePage.clientLogosSection?.maxLogos || 10}
            logos={transformedLogos}
          />
        )}

        {/* Problem Framing Section - Section 3 */}
        {homePage.problemFramingSection?.enabled !== false && (
          <ProblemFramingSection
            enabled={homePage.problemFramingSection?.enabled ?? true}
            badgeText={homePage.problemFramingSection?.badgeText || 'The Hidden Cost'}
            headline={homePage.problemFramingSection?.headline || 'The Hidden Cost of Sterile Spaces'}
            description={homePage.problemFramingSection?.description || 'Bland interiors are not neutral. They are actively suppressing your team\'s performance. Science confirms the difference.'}
            problems={homePage.problemFramingSection?.problems || []}
          />
        )}

        {/* Section Divider - Section 4 */}
        {homePage.sectionDivider?.enabled !== false && (
          <SectionDivider
            enabled={homePage.sectionDivider?.enabled ?? true}
            transitionText={homePage.sectionDivider?.transitionText || 'But the research goes deeper'}
          />
        )}

        {/* Expert Quotes Carousel - Section 5 */}
        {homePage.expertQuotesCarousel?.enabled !== false && (
          <ExpertQuotesCarousel
            enabled={homePage.expertQuotesCarousel?.enabled ?? true}
            quotes={homePage.expertQuotesCarousel?.quotes || []}
          />
        )}

        {/* Our Approach Section - Section 6 */}
        <OurApproachSection
          enabled={homePage.ourApproachSection?.enabled ?? true}
          badgeText={homePage.ourApproachSection?.badgeText || 'The Solution'}
          headline={homePage.ourApproachSection?.headline || 'This Is Where District Steps In'}
          subheadline={homePage.ourApproachSection?.subheadline || 'We\'ve seen the cost of sterile spaces—and we\'ve spent years perfecting the antidote.'}
          description={homePage.ourApproachSection?.description || 'Our approach transforms these hidden liabilities into competitive advantages. Through strategic biophilic design, we create environments where people don\'t just work—they thrive.'}
          approachPoints={homePage.ourApproachSection?.approachPoints || []}
          ctaText={homePage.ourApproachSection?.ctaText || 'Start Your Transformation'}
          ctaLink={homePage.ourApproachSection?.ctaLink || '/contact'}
        />

        {/* Why Choose Us Section - Section 7 */}
        {homePage.whyChooseUsSection?.enabled !== false && (
          <WhyChooseUsSection
            enabled={homePage.whyChooseUsSection?.enabled ?? true}
            headline={homePage.whyChooseUsSection?.headline || 'Why Leaders Choose District'}
            benefits={homePage.whyChooseUsSection?.benefits || []}
          />
        )}

        {/* Stats Section - Section 8 */}
        {homePage.statsSection?.enabled !== false && (
          <StatsSection
            enabled={homePage.statsSection?.enabled ?? true}
            headline={homePage.statsSection?.headline}
            stats={homePage.statsSection?.stats || []}
          />
        )}

        {/* Portfolio Section - Section 9 */}
        {homePage.portfolioSection?.enabled !== false && (
          <PortfolioSection
            enabled={homePage.portfolioSection?.enabled ?? true}
            ctaText={homePage.portfolioSection?.ctaText}
            ctaLink={homePage.portfolioSection?.ctaLink || '/projects'}
            projects={transformedProjects}
          />
        )}

        {/* Differentiation Section - Section 10 */}
        {homePage.differentiationSection?.enabled !== false && (
          <DifferentiationSection
            enabled={homePage.differentiationSection?.enabled ?? true}
            headline={homePage.differentiationSection?.headline || 'Not All Plantscaping'}
            headlineSecond={homePage.differentiationSection?.headlineSecond || 'Is Created Equal'}
            subheadline={homePage.differentiationSection?.subheadline || 'The difference between commodity plants and strategic biophilic design is the difference between filling space and transforming it.'}
            comparisonPoints={homePage.differentiationSection?.comparisonPoints || []}
            ctaText={homePage.differentiationSection?.ctaText || "Ready to experience the difference? Let's talk →"}
            ctaLink={homePage.differentiationSection?.ctaLink || '/contact'}
          />
        )}

        {/* Virtual Showroom Section - Section 11 */}
        {homePage.virtualShowroomSection?.enabled !== false && (
          <VirtualShowroomSection
            enabled={homePage.virtualShowroomSection?.enabled ?? true}
            badgeText={homePage.virtualShowroomSection?.badgeText}
            headline={homePage.virtualShowroomSection?.headline}
            description={homePage.virtualShowroomSection?.description}
            showrooms={showrooms.map(normalizeShowroom)}
          />
        )}

        {/* Tree Consultation Preview - Section 12 */}
        {homePage.treeConsultationPreview?.enabled !== false && (
          <TreeConsultationPreview
            enabled={homePage.treeConsultationPreview?.enabled ?? true}
            badgeText={homePage.treeConsultationPreview?.badgeText || 'Featured Service'}
            headline={homePage.treeConsultationPreview?.headline || 'Custom Tree'}
            headlineSecond={homePage.treeConsultationPreview?.headlineSecond || 'Solutions'}
            description={homePage.treeConsultationPreview?.description || 'From concept to creation: trees tailored to your exact specifications.\n\nWhether you need a statement olive tree for your lobby, preserved botanicals for a restaurant, or a complete green wall installation, our team guides you through every decision. We match species, scale, and aesthetic to your space perfectly.'}
            ctaText={homePage.treeConsultationPreview?.ctaText || 'Explore Tree Solutions'}
            ctaLink={homePage.treeConsultationPreview?.ctaLink || '/tree-solutions'}
            secondaryCtaText={homePage.treeConsultationPreview?.secondaryCtaText || 'View Collection'}
            secondaryCtaLink={homePage.treeConsultationPreview?.secondaryCtaLink || '/collection'}
            backgroundImage={homePage.treeConsultationPreview?.backgroundImage}
            statNumber={homePage.treeConsultationPreview?.statNumber || '50+'}
            statLabel={homePage.treeConsultationPreview?.statLabel || 'Tree species available'}
          />
        )}

        {/* Testimonials Section - Section 13 */}
        <TestimonialsSection
          enabled={homePage.testimonialsSection?.enabled ?? true}
          headline={homePage.testimonialsSection?.headline || 'Trusted By Industry Leaders'}
          subheadline={homePage.testimonialsSection?.subheadline || "What our clients say about working with District"}
          maxTestimonials={homePage.testimonialsSection?.maxTestimonials || 5}
          testimonials={testimonials.map((t: any) => ({
            id: t.id,
            quote: t.quote,
            clientName: t.clientName,
            role: t.role,
            company: t.company,
            authorImage: t.authorImage,
          }))}
        />

        {/* Contact Section - Section 14 */}
        {homePage.contactSection?.enabled !== false && (
          <ContactSection
            enabled={homePage.contactSection?.enabled ?? true}
            badgeText={homePage.contactSection?.badgeText || 'Start Your Transformation'}
            headline={homePage.contactSection?.headline || "Let's Create"}
            headlineSecond={homePage.contactSection?.headlineSecond || 'Something Remarkable'}
            subheadline={homePage.contactSection?.subheadline || "Every great space starts with a conversation. Tell us about your vision."}
            ctaText={homePage.contactSection?.ctaText || 'Request Consultation'}
            contactInfo={homePage.contactSection?.contactInfo}
            socialLinks={homePage.contactSection?.socialLinks?.map((link: any) => ({
              label: link.label,
              href: link.href,
              abbr: link.abbr,
            }))}
            projectTypes={homePage.contactSection?.projectTypes?.map((pt: any) => pt.type || pt)}
          />
        )}
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  )
}
