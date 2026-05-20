import Sidebar from './Sidebar'

export default function Layout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-border flex items-center px-6 shrink-0 bg-[#080808]">
          <h1 className="text-sm font-display font-600 text-ink-2 tracking-tight">{title}</h1>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto dot-grid page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}
