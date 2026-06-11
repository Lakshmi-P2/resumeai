import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getApplicants, postJob, updateAppStatus } from '../../api'

export default function AdminDashboard() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('applicants')
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobForm, setJobForm] = useState({
    title: '', description: '', requirements: '',
    location: '', job_type: 'Full-time',
    salary_min: '', salary_max: '', deadline: ''
  })

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login')
      return
    }
    loadApplicants()
  }, [user])

  const loadApplicants = async () => {
    try {
      const res = await getApplicants()
      setApplicants(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostJob = async (e) => {
    e.preventDefault()
    try {
      await postJob(jobForm)
      alert('Job posted successfully!')
      setJobForm({
        title: '', description: '', requirements: '',
        location: '', job_type: 'Full-time',
        salary_min: '', salary_max: '', deadline: ''
      })
    } catch (err) {
      alert('Failed to post job!')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppStatus(id, { status })
      setApplicants(applicants.map(a => a.id === id ? { ...a, status } : a))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="glass border-b border-dark-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold">ResumeAI</span>
          <span className="text-dark-text text-sm">/ Company Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-dark-text text-sm">👋 {user?.name}</span>
          <button
            onClick={() => { logoutUser(); navigate('/') }}
            className="text-dark-text text-sm hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'applicants', label: '👥 Applicants' },
            { id: 'post-job', label: '➕ Post Job' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'gradient-btn text-white' : 'glass text-dark-text hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Applicants */}
        {tab === 'applicants' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Applicants ({applicants.length})</h1>
            <div className="space-y-4">
              {applicants.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <p className="text-dark-text">No applicants yet!</p>
                </div>
              ) : (
                applicants.map(a => (
                  <div key={a.id} className="glass rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{a.applicant_name}</h3>
                      <p className="text-dark-text text-sm">{a.email} · Applied for: {a.job_title}</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-green-400 text-xs">Score: {a.overall_score || 'N/A'}%</span>
                        <span className="text-blue-400 text-xs">ATS: {a.ats_score || 'N/A'}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full border ${
                        a.status === 'hired' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                        a.status === 'interview' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        a.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}>
                        {a.status}
                      </span>
                      <select
                        onChange={(e) => handleStatusUpdate(a.id, e.target.value)}
                        className="bg-dark border border-dark-border text-dark-text text-xs rounded-lg px-2 py-1"
                        defaultValue=""
                      >
                        <option value="" disabled>Update</option>
                        <option value="applied">Applied</option>
                        <option value="viewed">Viewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Post Job */}
        {tab === 'post-job' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-6">Post a Job</h1>
            <form onSubmit={handlePostJob} className="glass rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Job Title</label>
                <input
                  value={jobForm.title}
                  onChange={e => setJobForm({...jobForm, title: e.target.value})}
                  placeholder="Frontend Developer"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={e => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="Job description..."
                  rows={4}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Requirements</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={e => setJobForm({...jobForm, requirements: e.target.value})}
                  placeholder="Requirements..."
                  rows={3}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-text text-sm mb-2 block">Location</label>
                  <input
                    value={jobForm.location}
                    onChange={e => setJobForm({...jobForm, location: e.target.value})}
                    placeholder="Bangalore"
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-dark-text text-sm mb-2 block">Job Type</label>
                  <select
                    value={jobForm.job_type}
                    onChange={e => setJobForm({...jobForm, job_type: e.target.value})}
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Remote</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-text text-sm mb-2 block">Min Salary (LPA)</label>
                  <input
                    type="number"
                    value={jobForm.salary_min}
                    onChange={e => setJobForm({...jobForm, salary_min: e.target.value})}
                    placeholder="15"
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-dark-text text-sm mb-2 block">Max Salary (LPA)</label>
                  <input
                    type="number"
                    value={jobForm.salary_max}
                    onChange={e => setJobForm({...jobForm, salary_max: e.target.value})}
                    placeholder="25"
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Application Deadline</label>
                <input
                  type="date"
                  value={jobForm.deadline}
                  onChange={e => setJobForm({...jobForm, deadline: e.target.value})}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button type="submit" className="w-full gradient-btn text-white py-3 rounded-xl font-semibold">
                Post Job →
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}