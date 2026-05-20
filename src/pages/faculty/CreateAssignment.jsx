import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function CreateAssignment() {
  const navigate = useNavigate()
  const defaultDeadline = format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm")
  const [form, setForm] = useState({ title: '', subject: '', description: '', deadline: defaultDeadline })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/assignments', { ...form, deadline: new Date(form.deadline).toISOString() })
      toast.success('Assignment created!')
      navigate('/manage-assignments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Create Assignment">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="font-display text-xl font-700 text-white">Create Assignment</h2>
          <p className="text-ink-3 text-sm mt-0.5 font-body">Post a new assignment for your students</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-ink-3 mb-1.5 font-mono">Assignment Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-base"
                  placeholder="e.g. Data Structures Assignment 1" required minLength={3} />
              </div>
              <div>
                <label className="block text-xs text-ink-3 mb-1.5 font-mono">Subject *</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input-base"
                  placeholder="e.g. CS301" required />
              </div>
              <div>
                <label className="block text-xs text-ink-3 mb-1.5 font-mono">Deadline *</label>
                <input name="deadline" type="datetime-local" value={form.deadline} onChange={handleChange}
                  className="input-base" required
                  style={{ colorScheme: 'dark' }} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-ink-3 mb-1.5 font-mono">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className="input-base resize-none h-28"
                  placeholder="Describe the assignment requirements, rubric, submission format..." />
              </div>
            </div>

            {/* Preview */}
            {form.title && (
              <div className="border border-border rounded-xl p-4 bg-[#0a0a0a]">
                <p className="section-label mb-2">Preview</p>
                <p className="text-white text-sm font-medium">{form.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  {form.subject && <span className="badge bg-[#1a1a1a] text-ink-2 border border-border font-mono text-xs">{form.subject}</span>}
                  {form.deadline && <span className="text-xs text-ink-3 font-mono">Due {format(new Date(form.deadline), 'MMM d, yyyy HH:mm')}</span>}
                </div>
                {form.description && <p className="text-xs text-ink-3 mt-2 font-body">{form.description}</p>}
              </div>
            )}

            <div className="flex gap-3 pt-1 border-t border-border">
              <button type="button" onClick={() => navigate('/manage-assignments')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <span className="spinner" /> : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
