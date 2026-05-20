import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg dot-grid flex items-center justify-center p-4">
      {/* Glow orb */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-[0.07] blur-[80px]"
           style={{ background: 'radial-gradient(circle, #a855f7, #6366f1)' }} />

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center mb-4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 4h12M3 9h9M3 14h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-display text-xl font-700 text-white tracking-tight">Sign in to Tracker</h1>
          <p className="text-ink-3 text-sm mt-1 font-body">Assignment management platform</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-3 mb-1.5 font-mono">Email address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-base"
                placeholder="you@college.edu"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-ink-3 mb-1.5 font-mono">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="input-base"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 py-3">
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-3 mt-4 font-body">
          No account?{' '}
          <Link to="/register" className="text-accent hover:text-accent/80 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
