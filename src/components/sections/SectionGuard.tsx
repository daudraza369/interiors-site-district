'use client'

import React from 'react'

interface SectionGuardProps {
  enabled?: boolean | null
  hasData?: boolean
  children: React.ReactNode
  emptyFallback?: React.ReactNode
}

/**
 * SectionGuard - Prevents sections from vanishing when data is empty
 * 
 * Rules:
 * - If enabled === false → return null (section explicitly disabled)
 * - If enabled and hasData === false → render emptyFallback (in dev) or minimal shell
 * - Never fully hides sections just because arrays are empty
 */
export function SectionGuard({
  enabled = true,
  hasData = true,
  children,
  emptyFallback,
}: SectionGuardProps) {
  // Section explicitly disabled - hide completely
  if (enabled === false) {
    return null
  }

  // Section enabled but no data - show fallback or minimal shell
  if (!hasData) {
    if (emptyFallback) {
      return <>{emptyFallback}</>
    }
    
    // In production, you might want to show a minimal placeholder
    // For now, still render children so section structure exists
    // Components should handle empty state gracefully
    return <>{children}</>
  }

  // Section enabled with data - render normally
  return <>{children}</>
}





