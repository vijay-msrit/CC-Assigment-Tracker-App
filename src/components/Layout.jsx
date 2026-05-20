import { useState } from 'react'
import Sidebar, { MobileTopBar } from './Sidebar'

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar (hidden on mobile unless open) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <MobileTopBar onOpen={() => setSidebarOpen(true)} title={title} />

        {/* Desktop top bar */}
        <header className="hidden md:flex h-12 border-b border-border items-center px-6 shrink-0 bg-[#080808]">
          <h1 className="text-sm font-display font-600 text-ink-2 tracking-tight">{title}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto dot-grid page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}
