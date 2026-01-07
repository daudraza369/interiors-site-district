/**
 * CMS Data Normalization Utilities
 * 
 * Ensures all sections have safe defaults to prevent sections from "vanishing"
 * when data is empty or schema changes.
 */

interface HomePageData {
  [key: string]: any
}

/**
 * Merges server data with safe defaults for HomePage global
 * - Every section object exists
 * - Every array becomes [] if missing
 * - enabled defaults to true unless explicitly false
 */
export function withDefaultsHomePage(homePage: HomePageData | null | undefined): HomePageData {
  if (!homePage) {
    return getDefaultHomePage()
  }

  // Merge each section with defaults
  return {
    heroSection: {
      enabled: homePage.heroSection?.enabled ?? true,
      slides: homePage.heroSection?.slides || [],
      ...homePage.heroSection,
    },
    clientLogosSection: {
      enabled: homePage.clientLogosSection?.enabled ?? true,
      headline: homePage.clientLogosSection?.headline || 'Industry Leaders',
      maxLogos: homePage.clientLogosSection?.maxLogos || 10,
      logos: homePage.clientLogosSection?.logos || [],
      ...homePage.clientLogosSection,
    },
    problemFramingSection: {
      enabled: homePage.problemFramingSection?.enabled ?? true,
      badgeText: homePage.problemFramingSection?.badgeText || 'The Hidden Cost',
      headline: homePage.problemFramingSection?.headline || 'The Hidden Cost of Sterile Spaces',
      description: homePage.problemFramingSection?.description || '',
      problems: homePage.problemFramingSection?.problems || [],
      ...homePage.problemFramingSection,
    },
    sectionDivider: {
      enabled: homePage.sectionDivider?.enabled ?? true,
      transitionText: homePage.sectionDivider?.transitionText || 'But the research goes deeper',
      ...homePage.sectionDivider,
    },
    expertQuotesCarousel: {
      enabled: homePage.expertQuotesCarousel?.enabled ?? true,
      quotes: homePage.expertQuotesCarousel?.quotes || [],
      ...homePage.expertQuotesCarousel,
    },
    ourApproachSection: {
      enabled: homePage.ourApproachSection?.enabled ?? true,
      badgeText: homePage.ourApproachSection?.badgeText || 'The Solution',
      headline: homePage.ourApproachSection?.headline || 'This Is Where District Steps In',
      subheadline: homePage.ourApproachSection?.subheadline || '',
      description: homePage.ourApproachSection?.description || '',
      approachPoints: homePage.ourApproachSection?.approachPoints || [],
      ctaText: homePage.ourApproachSection?.ctaText || 'Start Your Transformation',
      ctaLink: homePage.ourApproachSection?.ctaLink || '/contact',
      ...homePage.ourApproachSection,
    },
    whyChooseUsSection: {
      enabled: homePage.whyChooseUsSection?.enabled ?? true,
      headline: homePage.whyChooseUsSection?.headline || 'Why Leaders Choose District',
      benefits: homePage.whyChooseUsSection?.benefits || [],
      ...homePage.whyChooseUsSection,
    },
    statsSection: {
      enabled: homePage.statsSection?.enabled ?? true,
      headline: homePage.statsSection?.headline || null,
      stats: homePage.statsSection?.stats || [],
      ...homePage.statsSection,
    },
    portfolioSection: {
      enabled: homePage.portfolioSection?.enabled ?? true,
      headline: homePage.portfolioSection?.headline || 'Transformations',
      subheadline: homePage.portfolioSection?.subheadline || "A showcase of spaces we've brought to life across the region.",
      projects: homePage.portfolioSection?.projects || [],
      ctaText: homePage.portfolioSection?.ctaText || 'View All Projects',
      ctaLink: homePage.portfolioSection?.ctaLink || '/projects',
      ...homePage.portfolioSection,
    },
    differentiationSection: {
      enabled: homePage.differentiationSection?.enabled ?? true,
      headline: homePage.differentiationSection?.headline || 'Not All Plantscaping',
      headlineSecond: homePage.differentiationSection?.headlineSecond || 'Is Created Equal',
      subheadline: homePage.differentiationSection?.subheadline || '',
      comparisonPoints: homePage.differentiationSection?.comparisonPoints || [],
      ctaText: homePage.differentiationSection?.ctaText || "Ready to experience the difference? Let's talk →",
      ctaLink: homePage.differentiationSection?.ctaLink || '/contact',
      ...homePage.differentiationSection,
    },
    treeConsultationPreview: {
      enabled: homePage.treeConsultationPreview?.enabled ?? true,
      badgeText: homePage.treeConsultationPreview?.badgeText || 'Featured Service',
      headline: homePage.treeConsultationPreview?.headline || 'Custom Tree',
      headlineSecond: homePage.treeConsultationPreview?.headlineSecond || 'Solutions',
      description: homePage.treeConsultationPreview?.description || '',
      ctaText: homePage.treeConsultationPreview?.ctaText || 'Explore Tree Solutions',
      ctaLink: homePage.treeConsultationPreview?.ctaLink || '/tree-solutions',
      secondaryCtaText: homePage.treeConsultationPreview?.secondaryCtaText || 'View Collection',
      secondaryCtaLink: homePage.treeConsultationPreview?.secondaryCtaLink || '/collection',
      statNumber: homePage.treeConsultationPreview?.statNumber || '50+',
      statLabel: homePage.treeConsultationPreview?.statLabel || 'Tree species available',
      ...homePage.treeConsultationPreview,
    },
    virtualShowroomSection: {
      enabled: homePage.virtualShowroomSection?.enabled ?? true,
      badgeText: homePage.virtualShowroomSection?.badgeText || '360° Experience',
      headline: homePage.virtualShowroomSection?.headline || 'Explore Our Projects Virtually',
      description: homePage.virtualShowroomSection?.description || 'Take a 360° virtual tour of our interior plantscaping projects, real spaces we\'ve styled with premium plants and floral arrangements',
      ...homePage.virtualShowroomSection,
    },
    testimonialsSection: {
      enabled: homePage.testimonialsSection?.enabled ?? true,
      headline: homePage.testimonialsSection?.headline || 'Trusted By Industry Leaders',
      subheadline: homePage.testimonialsSection?.subheadline || "What our clients say about working with District",
      maxTestimonials: homePage.testimonialsSection?.maxTestimonials || 5,
      ...homePage.testimonialsSection,
    },
    contactSection: {
      enabled: homePage.contactSection?.enabled ?? true,
      badgeText: homePage.contactSection?.badgeText || 'Start Your Transformation',
      headline: homePage.contactSection?.headline || "Let's Create",
      headlineSecond: homePage.contactSection?.headlineSecond || 'Something Remarkable',
      subheadline: homePage.contactSection?.subheadline || "Every great space starts with a conversation. Tell us about your vision.",
      ctaText: homePage.contactSection?.ctaText || 'Request Consultation',
      contactInfo: {
        email: homePage.contactSection?.contactInfo?.email || 'Sales@district.sa',
        phone: homePage.contactSection?.contactInfo?.phone || '+966 056 228 8177',
        whatsapp: homePage.contactSection?.contactInfo?.whatsapp || '+966 50 060 6506',
        address: homePage.contactSection?.contactInfo?.address || 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
        googleMaps: homePage.contactSection?.contactInfo?.googleMaps || 'https://share.google/OwSIbmaVwv0vXcatO',
        ...homePage.contactSection?.contactInfo,
      },
      socialLinks: homePage.contactSection?.socialLinks || [],
      projectTypes: homePage.contactSection?.projectTypes || [],
      ...homePage.contactSection,
    },
  }
}

/**
 * Returns complete default HomePage structure
 */
function getDefaultHomePage(): HomePageData {
  return {
    heroSection: { enabled: true, slides: [] },
    clientLogosSection: { enabled: true, headline: 'Industry Leaders', maxLogos: 10, logos: [] },
    problemFramingSection: { enabled: true, badgeText: 'The Hidden Cost', headline: 'The Hidden Cost of Sterile Spaces', description: '', problems: [] },
    sectionDivider: { enabled: true, transitionText: 'But the research goes deeper' },
    expertQuotesCarousel: { enabled: true, quotes: [] },
    ourApproachSection: { enabled: true, badgeText: 'The Solution', headline: 'This Is Where District Steps In', subheadline: '', description: '', approachPoints: [], ctaText: 'Start Your Transformation', ctaLink: '/contact' },
    whyChooseUsSection: { enabled: true, headline: 'Why Leaders Choose District', benefits: [] },
    statsSection: { enabled: true, headline: null, stats: [] },
    portfolioSection: { enabled: true, headline: 'Transformations', subheadline: "A showcase of spaces we've brought to life across the region.", projects: [], ctaText: 'View All Projects', ctaLink: '/projects' },
    differentiationSection: { enabled: true, headline: 'Not All Plantscaping', headlineSecond: 'Is Created Equal', subheadline: '', comparisonPoints: [], ctaText: "Ready to experience the difference? Let's talk →", ctaLink: '/contact' },
    treeConsultationPreview: { enabled: true, badgeText: 'Featured Service', headline: 'Custom Tree', headlineSecond: 'Solutions', description: '', ctaText: 'Explore Tree Solutions', ctaLink: '/tree-solutions', secondaryCtaText: 'View Collection', secondaryCtaLink: '/collection', statNumber: '50+', statLabel: 'Tree species available' },
    virtualShowroomSection: { enabled: true, badgeText: '360° Experience', headline: 'Explore Our Projects Virtually', description: 'Take a 360° virtual tour of our interior plantscaping projects, real spaces we\'ve styled with premium plants and floral arrangements' },
    testimonialsSection: { enabled: true, headline: 'Trusted By Industry Leaders', subheadline: "What our clients say about working with District", maxTestimonials: 5 },
    contactSection: { enabled: true, badgeText: 'Start Your Transformation', headline: "Let's Create", headlineSecond: 'Something Remarkable', subheadline: "Every great space starts with a conversation. Tell us about your vision.", ctaText: 'Request Consultation', contactInfo: { email: 'Sales@district.sa', phone: '+966 056 228 8177', whatsapp: '+966 50 060 6506', address: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214', googleMaps: 'https://share.google/OwSIbmaVwv0vXcatO' }, socialLinks: [], projectTypes: [] },
  }
}

