import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card card-hover">
      <p className="section-label">{label}</p>
      <p className={`font-display text-3xl font-700 mt-1 ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-ink-3 mt-0.5 font-body">{sub}</p>}
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/assignments'), api.get('/submissions/student')])
      .then(([a, s]) => {
        setAssignments(a.data.data || [])
        setSubmissions(s.data.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const submittedIds = new Set(submissions.map(s => s.assignmentId))
  const pending = assignments.filter(a => !submittedIds.has(a.id))
  const upcoming = pending.filter(a => !isPast(parseISO(a.deadline))).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  const late = submissions.filter(s => s.status === 'LATE')

  if (loading) return (
    <Layout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <span className="spinner w-6 h-6" />
      </div>
    </Layout>
  )

  return (
    <Layout title="Dashboard">
      <div className="max-w-4xl space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="font-display text-2xl font-700 text-white">
            Good day, <span className="gradient-text">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-ink-3 text-sm mt-1 font-body">{user.department} · {format(new Date(), 'EEEE, MMMM d')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total" value={assignments.length} sub="assignments" />
          <StatCard label="Submitted" value={submissions.length} sub="by you" accent="text-success" />
          <StatCard label="Pending" value={pending.length} sub="not yet submitted" accent="text-warning" />
          <StatCard label="Late" value={late.length} sub="submissions" accent={late.length > 0 ? 'text-danger' : 'text-ink-3'} />
        </div>

        {/* Upcoming deadlines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Upcoming Deadlines</p>
            <Link to="/assignments" className="text-xs text-accent hover:text-accent/80 transition-colors font-mono">
              View all →
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-ink-3 text-sm font-body">All caught up! No pending assignments.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.slice(0, 5).map(a => {
                const deadline = parseISO(a.deadline)
                const urgency = new Date(a.deadline) - new Date()
                const isUrgent = urgency < 48 * 3600 * 1000
                return (
                  <div key={a.id} className="card-hover card flex items-center justify-between px-4 py-3.5 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{a.title}</p>
                      <p className="text-xs text-ink-3 mt-0.5 font-mono">{a.subject}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-mono ${isUrgent ? 'text-danger' : 'text-ink-2'}`}>
                        {formatDistanceToNow(deadline, { addSuffix: true })}
                      </p>
                      <p className="text-xs text-ink-3 mt-0.5">{format(deadline, 'MMM d, yyyy')}</p>
                    </div>
                    {isUrgent && <span className="badge-upcoming badge shrink-0">Urgent</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
