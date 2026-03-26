'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Client-side providers wrapper for authentication
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  )
}
