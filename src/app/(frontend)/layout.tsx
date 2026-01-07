import React from 'react'
import '../globals.css'
import { Toaster } from '@/components/ui/toaster'

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
