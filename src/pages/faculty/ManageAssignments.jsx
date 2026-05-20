import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, isPast, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function EditModal({ assignment, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: assignment.title,
    subject: assignment.subject,
    description: assignment.description || '',
    deadline: format(parseISO(assignment.deadline), "yyyy-MM-dd'T'HH:mm"),
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put(`/assignments/${assignment.id}`, { ...form, deadline: new Date(form.deadline).toISOString() })
      toast.success('Assignment updated')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-600 text-white">Edit Assignment</h3>
          <button onClick={onClose} className="text-ink-3 hover:text-white p-1 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ink-3 mb-1.5 font-mono">Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-base" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ink-3 mb-1.5 font-mono">Subject</label>
              <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-base" required />
            </div>
            <div>
              <label className="block text-xs text-ink-3 mb-1.5 font-mono">Deadline</label>
              <input type="datetime-local" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                className="input-base" required style={{ colorScheme: 'dark' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-ink-3 mb-1.5 font-mono">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-base resize-none h-24" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <span className="spinner" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ManageAssignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = () => {
    api.get('/assignments')
      .then(r => setAssignments((r.data.data || []).filter(a => a.faculty?.id === user.id)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async id => {
    if (!confirm('Delete this assignment? This cannot be undone.')) return
    try {
      await api.delete(`/assignments/${id}`)
      toast.success('Assignment deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete')
    }
  }

  return (
    <Layout title="Manage Assignments">
      {editing && <EditModal assignment={editing} onClose={() => setEditing(null)} onSuccess={load} />}

      <div className="max-w-5xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-700 text-white">My Assignments</h2>
            <p className="text-ink-3 text-sm mt-0.5 font-body">{assignments.length} total</p>
          </div>
          <Link to="/create-assignment" className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            New Assignment
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><span className="spinner w-6 h-6" /></div>
        ) : assignments.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-3 font-body mb-3">No assignments yet.</p>
            <Link to="/create-assignment" className="btn-primary inline-flex">Create your first</Link>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const past = isPast(parseISO(a.deadline))
                  return (
                    <tr key={a.id}>
                      <td>
                        <p className="text-white text-sm font-medium">{a.title}</p>
                        {a.description && <p className="text-xs text-ink-3 mt-0.5 truncate max-w-[240px] font-body">{a.description}</p>}
                      </td>
                      <td><span className="font-mono text-xs text-ink-2">{a.subject}</span></td>
                      <td><span className="font-mono text-xs text-ink-3">{format(parseISO(a.deadline), 'MMM d, yyyy HH:mm')}</span></td>
                      <td>
                        <span className={`badge ${past ? 'badge-overdue' : 'bg-success/10 text-success border border-success/20 badge'}`}>
                          {past ? 'Closed' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditing(a)} className="btn-ghost text-ink-3 hover:text-white px-2 py-1.5" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                          </button>
                          <Link to="/view-submissions" state={{ assignmentId: a.id }} className="btn-ghost text-ink-3 hover:text-accent px-2 py-1.5" title="View submissions">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4.5h10M2 7h6M2 9.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          </Link>
                          <button onClick={() => handleDelete(a.id)} className="btn-ghost text-ink-3 hover:text-danger px-2 py-1.5" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M4.5 3.5l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
