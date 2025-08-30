'use client'

import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

interface DashboardWrapperProps {
  children: React.ReactNode
  session: Session | null
}

export default function DashboardWrapper({
  children,
  session,
}: DashboardWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
