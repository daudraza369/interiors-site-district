import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, projectType, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Here you can:
    // 1. Save to Payload CMS (create a ContactSubmissions collection)
    // 2. Send email notification
    // 3. Save to external service
    // 4. Log to database

    // For now, we'll just log it and return success
    // TODO: Implement actual storage/notification
    console.log('Contact form submission:', {
      name,
      email,
      projectType,
      message,
      timestamp: new Date().toISOString(),
    })

    // Optionally save to Payload CMS if you create a ContactSubmissions collection
    // const payload = await getPayload({ config })
    // await payload.create({
    //   collection: 'contact-submissions',
    //   data: {
    //     name,
    //     email,
    //     projectType,
    //     message,
    //   },
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}



