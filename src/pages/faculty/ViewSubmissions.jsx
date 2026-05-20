import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function ReviewModal({ submission, onClose, onSuccess }) {
  const [remarks, setRemarks] = useState(submission.remarks || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!remarks.trim()) return toast.error('Remarks are required')
    setLoading(true)
    try {
      await api.put(`/submissions/${submission.id}/review`, { remarks })
      toast.success('Submission reviewed')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display font-600 text-white">Review Submission</h3>
            <p className="text-xs text-ink-3 mt-0.5 font-mono">{submission.student?.name}</p>
          </div>
          <button onClick={onClose} className="text-ink-3 hover:text-white p-1 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Submission info */}
        <div className="bg-[#0a0a0a] border border-border rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-xs items-center">
            <span className="text-ink-3 font-mono">File</span>
            <a href={submission.downloadUrl || '#'} target="_blank" rel="noopener noreferrer"
               className="text-accent hover:text-accent-dim hover:underline font-mono truncate max-w-[200px]"
               title="Click to download">
              {submission.fileName}
            </a>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-ink-3 font-mono">Submitted</span>
            <span className="text-ink-2 font-mono">{format(parseISO(submission.submittedAt), 'MMM d, yyyy HH:mm')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-ink-3 font-mono">Status</span>
            <span className={`badge badge-${submission.status.toLowerCase()}`}>{submission.status}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ink-3 mb-1.5 font-mono">Remarks / Feedback *</label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="input-base resize-none h-28"
              placeholder="Write your feedback, grade, or review notes..."
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <span className="spinner" /> : 'Mark Reviewed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ViewSubmissions() {
  const { user } = useAuth()
  const location = useLocation()
  const preselect = location.state?.assignmentId

  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [selectedId, setSelectedId] = useState(preselect || null)
  const [reviewing, setReviewing] = useState(null)
  const [loadingAssign, setLoadingAssign] = useState(true)
  const [loadingSubs, setLoadingSubs] = useState(false)

  useEffect(() => {
    api.get('/assignments')
      .then(r => {
        const mine = (r.data.data || []).filter(a => a.faculty?.id === user.id)
        setAssignments(mine)
        if (!preselect && mine.length > 0) setSelectedId(mine[0].id)
      })
      .finally(() => setLoadingAssign(false))
  }, [user.id])

  useEffect(() => {
    if (!selectedId) return
    setLoadingSubs(true)
    api.get(`/submissions/assignment/${selectedId}`)
      .then(r => setSubmissions(r.data.data || []))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoadingSubs(false))
  }, [selectedId])

  const reload = () => {
    if (!selectedId) return
    setLoadingSubs(true)
    api.get(`/submissions/assignment/${selectedId}`)
      .then(r => setSubmissions(r.data.data || []))
      .finally(() => setLoadingSubs(false))
  }

  const selected = assignments.find(a => a.id === selectedId)
  const reviewed = submissions.filter(s => s.status === 'REVIEWED').length
  const pending = submissions.filter(s => s.status !== 'REVIEWED').length

  return (
    <Layout title="View Submissions">
      {reviewing && <ReviewModal submission={reviewing} onClose={() => setReviewing(null)} onSuccess={reload} />}

      <div className="max-w-5xl space-y-5">
        <div>
          <h2 className="font-display text-xl font-700 text-white">Submissions</h2>
          <p className="text-ink-3 text-sm mt-0.5 font-body">Select an assignment to view student submissions</p>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[240px,1fr] gap-5 items-start">
          {/* Assignment selector */}
          <div className="card p-1">
            <p className="section-label px-3 py-2">My Assignments</p>
            {loadingAssign ? (
              <div className="flex justify-center p-4"><span className="spinner" /></div>
            ) : assignments.length === 0 ? (
              <p className="text-xs text-ink-3 text-center py-4 font-body">No assignments</p>
            ) : (
              <div className="space-y-0.5">
                {assignments.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      selectedId === a.id
                        ? 'bg-accent-muted text-white border-l-2 border-accent pl-[10px]'
                        : 'text-ink-2 hover:bg-surface-hover hover:text-white'
                    }`}
                  >
                    <p className="font-medium text-xs leading-snug truncate">{a.title}</p>
                    <p className="font-mono text-xs text-ink-3 mt-0.5">{a.subject}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submissions panel */}
          <div className="space-y-4">
            {selected && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{selected.title}</p>
                  <p className="text-xs text-ink-3 font-mono mt-0.5">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-3">
                  <span className="badge bg-success/10 text-success border border-success/20">{reviewed} reviewed</span>
                  <span className="badge bg-warning/10 text-warning border border-warning/20">{pending} pending</span>
                </div>
              </div>
            )}

            {loadingSubs ? (
              <div className="card flex items-center justify-center h-48">
                <span className="spinner w-6 h-6" />
              </div>
            ) : !selectedId ? (
              <div className="card p-12 text-center">
                <p className="text-ink-3 font-body text-sm">Select an assignment</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-ink-3 font-body text-sm">No submissions yet for this assignment.</p>
              </div>
            ) : (
              <div className="card overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>File</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(s => (
                      <tr key={s.id}>
                        <td>
                          <p className="text-white text-sm font-medium">{s.student?.name}</p>
                          <p className="text-xs text-ink-3 font-mono">{s.student?.department}</p>
                        </td>
                        <td>
                          <a href={s.downloadUrl || '#'} target="_blank" rel="noopener noreferrer" 
                             className="font-mono text-xs text-accent hover:text-accent-dim hover:underline truncate max-w-[140px] block" 
                             title="Click to download">
                            {s.fileName?.split('_').slice(2).join('_') || s.fileName}
                          </a>
                        </td>
                        <td>
                          <span className="font-mono text-xs text-ink-3">
                            {format(parseISO(s.submittedAt), 'MMM d, HH:mm')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span>
                        </td>
                        <td>
                          <span className="text-xs text-ink-3 italic max-w-[140px] block truncate">
                            {s.remarks || '—'}
                          </span>
                        </td>
                        <td>
                          {s.status !== 'REVIEWED' && (
                            <button onClick={() => setReviewing(s)} className="btn-primary py-1.5 px-3 text-xs">
                              Review
                            </button>
                          )}
                          {s.status === 'REVIEWED' && (
                            <button onClick={() => setReviewing(s)} className="btn-secondary py-1.5 px-3 text-xs">
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
