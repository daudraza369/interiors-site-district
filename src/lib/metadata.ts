import type { Metadata } from 'next'

const siteName = 'District Interiors'
const siteDescription =
  'Transforming spaces through expert plantscaping, luxury softscaping, and custom tree fabrication. Premium greenery solutions for offices, hospitality, and residential spaces.'
const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3003'

interface PageMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const fullDescription = description || siteDescription
  const fullUrl = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/og-image.jpg`

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}

// Structured data (JSON-LD) for SEO
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Service', data?: any) {
  const baseOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966-056-228-8177',
      contactType: 'Customer Service',
      email: 'Sales@district.sa',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Al Zoubair Ibn Al Awwam, Ar Rawabi',
      addressLocality: 'Riyadh',
      postalCode: '14214',
      addressCountry: 'SA',
    },
  }

  switch (type) {
    case 'Organization':
      return baseOrganization
    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        ...data,
      }
    case 'Service':
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Plantscaping & Interior Greenery',
        provider: baseOrganization,
        ...data,
      }
    default:
      return baseOrganization
  }
}

