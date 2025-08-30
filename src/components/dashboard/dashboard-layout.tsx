'use client'

import { useState } from 'react'
import DashboardHeader from './dashboard-header'
import DashboardSidebar from './dashboard-sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  lang: string
}

export default function DashboardLayout({
  children,
  lang,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader onMobileMenuToggle={handleMobileMenuToggle} />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          lang={lang}
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
        />

        {/* Main Content - Responsive margin */}
        <main className="ml-0 flex-1 p-4 pt-20 lg:ml-64 lg:p-8 lg:pt-24">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
