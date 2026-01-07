import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProjectsHeroSection } from '@/components/sections/ProjectsHeroSection'
import { ProjectsGallerySection } from '@/components/sections/ProjectsGallerySection'
import { VirtualShowroomSection } from '@/components/sections/VirtualShowroomSection'
import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeShowroom } from '@/lib/normalizeShowroom'
import type { VirtualShowroom } from '../../../payload-types'

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
        depth: 2,
      }),
    ])

    // Transform projects to match component interface
    const transformedProjects = projects.docs.map((project: any) => ({
      id: project.id.toString(),
      title: project.title || '',
      projectType: project.projectType || null,
      location: project.location || null,
      description: project.description || null,
      heroImage: project.heroImage || null,
      videoUrl: project.videoUrl || null,
    }))

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
  } catch (error: any) {
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
            categories={projectsPage.gallerySection?.categories}
            projects={projectsData}
          />
        )}

        {/* Virtual Showroom Section */}
        {projectsPage.virtualShowroomSection?.enabled !== false && (
          <VirtualShowroomSection
            enabled={projectsPage.virtualShowroomSection?.enabled ?? true}
            showrooms={showroomsData}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

