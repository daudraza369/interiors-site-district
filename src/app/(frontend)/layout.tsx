import React from 'react'
import '../globals.css'
import { Toaster } from '@/components/ui/toaster'

// Prevent caching for dynamic CMS content
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
