import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/submissions/student')
      .then(r => setSubmissions(r.data.data || []))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission?')) return
    try {
      await api.delete(`/submissions/${id}`)
      toast.success('Submission deleted')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete')
    }
  }

  return (
    <Layout title="My Submissions">
      <div className="max-w-5xl space-y-5">
        <div>
          <h2 className="font-display text-xl font-700 text-white">My Submissions</h2>
          <p className="text-ink-3 text-sm mt-0.5 font-body">{submissions.length} total</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48"><span className="spinner w-6 h-6" /></div>
        ) : submissions.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-ink-3 font-body">No submissions yet.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Subject</th>
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
                      <p className="text-white text-sm font-medium">{s.assignment?.title || '—'}</p>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-ink-3">{s.assignment?.subject || '—'}</span>
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
                        {format(parseISO(s.submittedAt), 'MMM d, yyyy HH:mm')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span>
                    </td>
                    <td>
                      <span className="text-xs text-ink-3 italic max-w-[160px] block truncate">
                        {s.remarks || '—'}
                      </span>
                    </td>
                    <td>
                      {s.status !== 'REVIEWED' && (
                        <button onClick={() => handleDelete(s.id)} className="btn-ghost text-danger/60 hover:text-danger px-2 py-1">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M4.5 3.5l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
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
    </Layout>
  )
}
