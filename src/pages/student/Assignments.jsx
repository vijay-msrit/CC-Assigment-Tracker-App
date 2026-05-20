import { useEffect, useState } from 'react'
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout'
import api from '../../api/axios'

function UploadModal({ assignment, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) return toast.error('Select a file first')
    const fd = new FormData()
    fd.append('assignment_id', assignment.id)
    fd.append('file', file)
    setLoading(true)
    try {
      await api.post('/submissions/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Submission uploaded!')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display font-600 text-white text-base">Submit Assignment</h3>
            <p className="text-xs text-ink-3 mt-0.5 font-mono truncate max-w-[280px]">{assignment.title}</p>
          </div>
          <button onClick={onClose} className="text-ink-3 hover:text-white transition-colors p-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ink-3 mb-1.5 font-mono">File</label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 cursor-pointer
              ${file ? 'border-accent/50 bg-accent-muted' : 'border-border hover:border-border-hover'}`}
              onClick={() => document.getElementById('file-input').click()}>
              <input id="file-input" type="file" className="hidden"
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.txt"
                onChange={e => setFile(e.target.files[0])} />
              {file ? (
                <div>
                  <p className="text-sm text-accent font-mono">{file.name}</p>
                  <p className="text-xs text-ink-3 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto mb-2 text-ink-3" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V8m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M20 16.5A4 4 0 0017 9h-.8A7 7 0 104 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm text-ink-3">Click to select file</p>
                  <p className="text-xs text-ink-3/50 mt-1">PDF, DOC, DOCX, ZIP, images · Max 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <span className="spinner" /> : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const [a, s] = await Promise.all([api.get('/assignments'), api.get('/submissions/student')])
    setAssignments(a.data.data || [])
    setSubmissions(s.data.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const submittedIds = new Set(submissions.map(s => s.assignmentId))

  const filtered = assignments.filter(a => {
    const overdue = isPast(parseISO(a.deadline))
    const submitted = submittedIds.has(a.id)
    if (filter === 'pending') return !submitted && !overdue
    if (filter === 'overdue') return !submitted && overdue
    if (filter === 'submitted') return submitted
    return true
  })

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'submitted', label: 'Submitted' },
  ]

  if (loading) return (
    <Layout title="Assignments">
      <div className="flex items-center justify-center h-64"><span className="spinner w-6 h-6" /></div>
    </Layout>
  )

  return (
    <Layout title="Assignments">
      {selected && <UploadModal assignment={selected} onClose={() => setSelected(null)} onSuccess={load} />}

      <div className="max-w-4xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-700 text-white">Assignments</h2>
            <p className="text-ink-3 text-sm mt-0.5 font-body">{assignments.length} total</p>
          </div>
          {/* Tabs */}
          <div className="flex bg-surface border border-border rounded-lg p-1 gap-0.5 self-start sm:self-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setFilter(t.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-150 ${
                  filter === t.key ? 'bg-[#1e1e1e] text-white border border-border' : 'text-ink-3 hover:text-ink-2'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-3 font-body">No assignments in this category.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(a => {
              const deadline = parseISO(a.deadline)
              const isOverdue = isPast(deadline)
              const isSubmitted = submittedIds.has(a.id)
              const submission = submissions.find(s => s.assignmentId === a.id)

              return (
                <div key={a.id} className="card-hover card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="badge bg-[#1a1a1a] text-ink-2 border border-border font-mono text-xs">
                          {a.subject}
                        </span>
                        {isSubmitted && <span className={`badge badge-${submission.status.toLowerCase()}`}>{submission.status}</span>}
                        {!isSubmitted && isOverdue && <span className="badge badge-overdue">Overdue</span>}
                      </div>
                      <h3 className="text-white font-medium text-sm leading-snug">{a.title}</h3>
                      {a.description && <p className="text-ink-3 text-xs mt-1 line-clamp-2 font-body">{a.description}</p>}
                      <div className="flex items-center gap-4 mt-2.5">
                        <span className="text-xs text-ink-3 font-mono">
                          {a.faculty?.name || 'Faculty'}
                        </span>
                        <span className={`text-xs font-mono ${isOverdue && !isSubmitted ? 'text-danger' : 'text-ink-3'}`}>
                          {isOverdue ? 'Was due ' : 'Due '}
                          {formatDistanceToNow(deadline, { addSuffix: true })}
                        </span>
                        <span className="text-xs text-ink-3">
                          {format(deadline, 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSubmitted ? (
                        <span className="text-xs text-ink-3 font-mono">
                          {format(parseISO(submission.submittedAt), 'MMM d')}
                        </span>
                      ) : (
                        <button onClick={() => setSelected(a)} className="btn-primary py-2 px-4 text-xs">
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
