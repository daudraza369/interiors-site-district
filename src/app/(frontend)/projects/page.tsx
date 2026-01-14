import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectsHeroSection } from '@/components/sections/ProjectsHeroSection'
import { ProjectsGallerySection } from '@/components/sections/ProjectsGallerySection'
import { VirtualShowroomSection } from '@/components/sections/VirtualShowroomSection'
import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeShowroom } from '@/lib/normalizeShowroom'
import { getMediaUrl } from '@/lib/mediaUrl'
import type { VirtualShowroom } from '../../../payload-types'

// Force dynamic rendering to fetch fresh CMS data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getProjectsPageData() {
  try {
    const payload = await getPayload({ config })

    const [projectsPage, projects, showrooms] = await Promise.all([
      payload.findGlobal({
        slug: 'projects-page',
        depth: 2,
      }),
      payload.find({
        collection: 'projects',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: 'displayOrder',
        limit: 100,
        depth: 2,
      }),
      payload.find({
        collection: 'virtual-showrooms',
        where: {
          isPublished: {
            equals: true,
          },
        },
        sort: 'displayOrder',
        limit: 100,
        depth: 2,
      }),
    ])

    // Transform projects to match component interface
    // With depth: 2, heroImage and video should be populated as Media objects
    const transformedProjects = projects.docs.map((project: any) => {
      // Handle heroImage - it might be a Media object or just an ID
      let heroImageUrl: string | null = null
      if (project.heroImage) {
        if (typeof project.heroImage === 'object' && project.heroImage.url) {
          // Use getMediaUrl to normalize the URL
          heroImageUrl = getMediaUrl(project.heroImage.url)
        } else if (typeof project.heroImage === 'string') {
          heroImageUrl = getMediaUrl(project.heroImage)
        }
      }

      // Handle video - can be uploaded file (Media object) or external URL
      let videoUrl: string | null = null
      if (project.video) {
        // Video is uploaded file (Media object)
        if (typeof project.video === 'object' && project.video.url) {
          // Use getMediaUrl to normalize uploaded video URLs
          videoUrl = getMediaUrl(project.video.url)
        } else if (typeof project.video === 'string') {
          videoUrl = getMediaUrl(project.video)
        }
      } else if (project.videoUrl) {
        // Video is external URL (YouTube, Vimeo, direct link, etc.)
        // Keep external URLs as-is (don't normalize them)
        videoUrl = project.videoUrl.trim()
      }

      return {
        id: project.id.toString(),
        title: project.title || '',
        projectType: project.projectType || null,
        location: project.location || null,
        description: project.description || null,
        heroImage: heroImageUrl,
        videoUrl: videoUrl,
      }
    })

    // Transform showrooms to match component interface
    const transformedShowrooms = showrooms.docs.map((showroom: VirtualShowroom) =>
      normalizeShowroom(showroom)
    )

    return {
      projectsPage,
      projects: transformedProjects,
      showrooms: transformedShowrooms,
    }
  } catch (error: any) {
    console.error('Error fetching Projects Page data:', error)
    throw error
  }
}

export default async function ProjectsPage() {
  let projectsPageData
  let projectsData: any[] = []
  let showroomsData: any[] = []
  try {
    const result = await getProjectsPageData()
    projectsPageData = result.projectsPage
    projectsData = result.projects || []
    showroomsData = result.showrooms || []
    
    // Debug logging
    console.log('[Projects Page] Projects found:', projectsData.length)
    console.log('[Projects Page] Showrooms found:', showroomsData.length)
    if (projectsData.length > 0) {
      console.log('[Projects Page] First project:', {
        id: projectsData[0].id,
        title: projectsData[0].title,
        hasVideo: !!projectsData[0].videoUrl,
        videoUrl: projectsData[0].videoUrl,
        hasImage: !!projectsData[0].heroImage,
      })
    }
  } catch (error: any) {
    console.error('[Projects Page] Error fetching data:', error)
    // If everything fails, use default empty structure
    projectsPageData = {
      heroSection: {
        enabled: true,
        badgeText: 'Portfolio',
        headline: 'Our Projects',
        description: 'Spaces transformed through green design. A showcase of curated interiors and custom installations.',
      },
      gallerySection: {
        enabled: true,
        categories: [
          { label: 'All', value: 'All' },
          { label: 'Office', value: 'Office' },
          { label: 'Hospitality', value: 'Hospitality' },
          { label: 'F&B', value: 'F&B' },
          { label: 'Villa', value: 'Villa' },
        ],
      },
      virtualShowroomSection: {
        enabled: true,
      },
    }
  }

  const projectsPage = projectsPageData || {
    heroSection: {
      enabled: true,
      badgeText: 'Portfolio',
      headline: 'Our Projects',
      description: 'Spaces transformed through green design. A showcase of curated interiors and custom installations.',
    },
      gallerySection: {
        enabled: true,
        categories: [
          { label: 'All', value: 'All' },
          { label: 'Office', value: 'Office' },
          { label: 'Hospitality', value: 'Hospitality' },
          { label: 'F&B', value: 'F&B' },
          { label: 'Villa', value: 'Villa' },
        ],
      },
      virtualShowroomSection: {
        enabled: true,
      },
    }

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        {/* Hero Section */}
        {projectsPage.heroSection?.enabled !== false && (
          <ProjectsHeroSection
            enabled={projectsPage.heroSection?.enabled ?? true}
            badgeText={projectsPage.heroSection?.badgeText}
            headline={projectsPage.heroSection?.headline}
            description={projectsPage.heroSection?.description}
          />
        )}

        {/* Gallery Section */}
        {projectsPage.gallerySection?.enabled !== false && (
          <ProjectsGallerySection
            enabled={projectsPage.gallerySection?.enabled ?? true}
            categories={projectsPage.gallerySection?.categories ?? undefined}
            projects={projectsData}
          />
        )}

        {/* Virtual Showroom Section */}
        {projectsPage.virtualShowroomSection?.enabled !== false && (
          <VirtualShowroomSection
            enabled={projectsPage.virtualShowroomSection?.enabled ?? true}
            showrooms={showroomsData || []}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

