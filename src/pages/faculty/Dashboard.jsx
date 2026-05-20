import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, isPast, parseISO } from 'date-fns'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/assignments')
      .then(r => setAssignments((r.data.data || []).filter(a => a.faculty?.id === user.id)))
      .finally(() => setLoading(false))
  }, [user.id])

  const active = assignments.filter(a => !isPast(parseISO(a.deadline)))
  const overdue = assignments.filter(a => isPast(parseISO(a.deadline)))

  return (
    <Layout title="Dashboard">
      <div className="max-w-4xl space-y-8">
        <div>
          <h2 className="font-display text-2xl font-700 text-white">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-ink-3 text-sm mt-1 font-body">{user.department} · {format(new Date(), 'EEEE, MMMM d')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="stat-card card-hover">
            <p className="section-label">My Assignments</p>
            <p className="font-display text-3xl font-700 text-white mt-1">{assignments.length}</p>
            <p className="text-xs text-ink-3 mt-0.5 font-body">created by you</p>
          </div>
          <div className="stat-card card-hover">
            <p className="section-label">Active</p>
            <p className="font-display text-3xl font-700 text-success mt-1">{active.length}</p>
            <p className="text-xs text-ink-3 mt-0.5 font-body">deadline not passed</p>
          </div>
          <div className="stat-card card-hover">
            <p className="section-label">Overdue</p>
            <p className={`font-display text-3xl font-700 mt-1 ${overdue.length > 0 ? 'text-danger' : 'text-ink-3'}`}>{overdue.length}</p>
            <p className="text-xs text-ink-3 mt-0.5 font-body">deadline passed</p>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="section-label mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { to: '/create-assignment', label: 'Create Assignment', desc: 'Post a new assignment' },
              { to: '/manage-assignments', label: 'Manage', desc: 'Edit or delete assignments' },
              { to: '/view-submissions', label: 'Review Submissions', desc: 'Grade student work' },
            ].map(a => (
              <Link key={a.to} to={a.to} className="card-hover card p-4 group">
                <p className="text-sm text-white font-medium group-hover:text-accent transition-colors">{a.label}</p>
                <p className="text-xs text-ink-3 mt-1 font-body">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent assignments */}
        {!loading && assignments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Recent Assignments</p>
              <Link to="/manage-assignments" className="text-xs text-accent hover:text-accent/80 font-mono transition-colors">View all →</Link>
            </div>
            <div className="space-y-2">
              {assignments.slice(0, 4).map(a => (
                <div key={a.id} className="card-hover card flex items-center justify-between px-4 py-3.5 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{a.title}</p>
                    <p className="text-xs text-ink-3 mt-0.5 font-mono">{a.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-mono ${isPast(parseISO(a.deadline)) ? 'text-danger' : 'text-success'}`}>
                      {isPast(parseISO(a.deadline)) ? 'Closed' : 'Active'}
                    </p>
                    <p className="text-xs text-ink-3 mt-0.5">{format(parseISO(a.deadline), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
