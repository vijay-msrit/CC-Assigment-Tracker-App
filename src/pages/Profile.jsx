import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', department: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/users/profile')
      .then(r => {
        const p = r.data.data
        setProfile(p)
        setForm({ name: p.name, department: p.department, password: '' })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    const payload = {}
    if (form.name !== profile.name) payload.name = form.name
    if (form.department !== profile.department) payload.department = form.department
    if (form.password) payload.password = form.password

    if (Object.keys(payload).length === 0) return toast('No changes to save')

    setSaving(true)
    try {
      const res = await api.put('/users/profile', payload)
      const updated = res.data.data
      setProfile(updated)
      setForm(f => ({ ...f, password: '' }))
      // Update localStorage user
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      const merged = { ...stored, ...updated }
      localStorage.setItem('user', JSON.stringify(merged))
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout title="Profile">
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="font-display text-xl font-700 text-white">Profile</h2>
          <p className="text-ink-3 text-sm mt-0.5 font-body">Manage your account details</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><span className="spinner w-6 h-6" /></div>
        ) : (
          <>
            {/* Info card */}
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-white font-display font-700 text-lg shrink-0">
                {profile?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{profile?.name}</p>
                <p className="text-xs text-ink-3 font-mono mt-0.5">{profile?.email}</p>
                <span className={`badge mt-1.5 ${profile?.role === 'FACULTY' ? 'badge-faculty' : 'badge-student'}`}>
                  {profile?.role}
                </span>
              </div>
            </div>

            {/* Edit form */}
            <div className="card p-6">
              <p className="section-label mb-4">Edit Details</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-3 mb-1.5 font-mono">Email</label>
                  <input value={profile?.email} className="input-base opacity-50 cursor-not-allowed" disabled />
                  <p className="text-xs text-ink-3 mt-1 font-mono">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-xs text-ink-3 mb-1.5 font-mono">Full Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="input-base"
                    placeholder="Your full name"
                    minLength={2}
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink-3 mb-1.5 font-mono">Department</label>
                  <input
                    value={form.department}
                    onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    className="input-base"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink-3 mb-1.5 font-mono">New Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-base"
                    placeholder="Leave blank to keep current"
                    minLength={6}
                  />
                </div>
                <div className="pt-1 border-t border-border">
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? <span className="spinner" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
