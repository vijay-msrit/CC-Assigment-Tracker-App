import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)
const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3a1 1 0 011-1h4.5a2.5 2.5 0 010 5H3a1 1 0 01-1-1V3zM2 10a1 1 0 011-1h4.5a2.5 2.5 0 010 5H3a1 1 0 01-1-1v-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 5.5c0-1.38 1.12-2.5 2.5-2.5H13a1 1 0 011 1v9a1 1 0 01-1 1h-2.5A2.5 2.5 0 018 11.5v-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const IconFile = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V6L9 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconInbox = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 10l2-7h8l2 7H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M2 10h3.5a.5.5 0 01.5.5 2 2 0 004 0 .5.5 0 01.5-.5H14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconStudents = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M1 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11.5 7a2 2 0 100-4M15 13c0-2.2-1.6-3.5-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const studentNav = [
  { to: '/dashboard', icon: <IconGrid />, label: 'Dashboard' },
  { to: '/assignments', icon: <IconBook />, label: 'Assignments' },
  { to: '/submissions', icon: <IconFile />, label: 'My Submissions' },
  { to: '/profile', icon: <IconUser />, label: 'Profile' },
]

const facultyNav = [
  { to: '/dashboard', icon: <IconGrid />, label: 'Dashboard' },
  { to: '/create-assignment', icon: <IconPlus />, label: 'Create Assignment' },
  { to: '/manage-assignments', icon: <IconList />, label: 'Manage' },
  { to: '/view-submissions', icon: <IconInbox />, label: 'Submissions' },
  { to: '/students', icon: <IconStudents />, label: 'Students' },
  { to: '/profile', icon: <IconUser />, label: 'Profile' },
]

// Mobile top bar shown on small screens
export function MobileTopBar({ onOpen, title }) {
  return (
    <header className="md:hidden h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-[#080808] sticky top-0 z-30">
      <button
        id="sidebar-open-btn"
        onClick={onOpen}
        className="p-1.5 rounded-lg text-ink-3 hover:text-white hover:bg-surface transition-all"
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M2 3h10M2 7h7M2 11h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="font-display font-700 text-sm tracking-tight text-white">Tracker</span>
      </div>
      <div className="w-8" />
    </header>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const nav = user?.role === 'FACULTY' ? facultyNav : studentNav

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const handleNavClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-[220px] bg-[#080808] border-r border-border flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3h10M2 7h7M2 11h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-700 text-sm tracking-tight text-white">Tracker</span>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-ink-3 hover:text-white hover:bg-surface transition-all"
            aria-label="Close menu"
          >
            <IconClose />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="section-label px-3 pt-1 pb-2">Navigation</p>
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span className="font-body text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border">
          <div className="px-3 py-2.5 mb-1">
            <p className="text-sm text-white font-medium truncate leading-tight">{user?.name}</p>
            <p className="text-xs text-ink-3 truncate mt-0.5">{user?.email}</p>
            <span className={`badge mt-2 ${user?.role === 'FACULTY' ? 'badge-faculty' : 'badge-student'}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={handleLogout} className="nav-item text-danger/70 hover:text-danger hover:bg-danger/5 w-full">
            <IconLogout />
            <span className="font-body text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
