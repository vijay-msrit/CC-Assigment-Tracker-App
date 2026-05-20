import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/users/students')
      .then(r => setStudents(r.data.data || []))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout title="Students">
      <div className="max-w-4xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-700 text-white">Students</h2>
            <p className="text-ink-3 text-sm mt-0.5 font-body">{students.length} registered</p>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base w-56 py-2"
            placeholder="Search students..."
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><span className="spinner w-6 h-6" /></div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-3 font-body">No students found.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-accent-muted border border-accent/20 flex items-center justify-center text-xs font-display font-700 text-accent">
                          {s.name[0].toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-ink-3">{s.email}</span></td>
                    <td><span className="text-sm text-ink-2">{s.department || '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
