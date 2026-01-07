import React from 'react'

export const metadata = {
  description: 'District Interiors - Premium plantscaping, luxury softscaping, and custom tree fabrication.',
  title: 'District Interiors',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

