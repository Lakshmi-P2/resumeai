import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getApplicants, postJob, updateAppStatus } from '../../api'

export default function AdminDashboard() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [jobForm, setJobForm] = useState({
    title: '', description: '', requirements: '',
    location: '', job_type: 'Full-time',
    salary_min: '', salary_max: '',
    deadline: '', skills_required: '',
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
      const skillsArray = jobForm.skills_required
        .split(',').map(s => s.trim()).filter(s => s)
      await postJob({
        ...jobForm,
        skills_required: skillsArray,
        salary_min: parseInt(jobForm.salary_min) || 0,
        salary_max: parseInt(jobForm.salary_max) || 0,
      })
      setSuccess('Job posted successfully! It is now live on the job board!')
      setJobForm({
        title: '', description: '', requirements: '',
        location: '', job_type: 'Full-time',
        salary_min: '', salary_max: '',
        deadline: '', skills_required: '',
      })
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      alert('Failed to post job! Make sure your company is approved by admin.')
    }
  }

  const handleStatus = async (id, status) => {
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
        <p className="text-white text-xl">Loading admin panel...</p>
      </div>
    )
  }

  const pending = applicants.filter(a => a.status === 'applied').length
  const shortlisted = applicants.filter(a => a.status === 'shortlisted').length
  const interviews = applicants.filter(a => a.status === 'interview').length
  const offered = applicants.filter(a => a.status === 'offer').length
  const rejected = applicants.filter(a => a.status === 'rejected').length

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'applicants', label: `👥 Applicants (${applicants.length})` },
    { id: 'post-job', label: '➕ Post Job' },
  ]

  const statusConfig = {
    applied: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Applied' },
    viewed: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Viewed' },
    shortlisted: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Shortlisted' },
    interview: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Interview' },
    offer: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Offer Made' },
    hired: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Hired' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
  }

  return (
    <div className="min-h-screen bg-dark">

      {/* Professional Header */}
      <div className="glass border-b border-dark-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <div>
              <p className="text-white font-semibold">ResumeAI</p>
              <p className="text-dark-text text-xs">Company Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-dark-text text-xs">Company Administrator</p>
            </div>
            <button
              onClick={() => { logoutUser(); navigate('/') }}
              className="glass text-dark-text text-sm px-4 py-2 rounded-lg hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? 'gradient-btn text-white' : 'glass text-dark-text hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Hiring Overview</h1>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Applicants', value: applicants.length, color: 'text-white', icon: '👥' },
                { label: 'New Applications', value: pending, color: 'text-blue-400', icon: '📥' },
                { label: 'Shortlisted', value: shortlisted, color: 'text-yellow-400', icon: '⭐' },
                { label: 'Interviews', value: interviews, color: 'text-green-400', icon: '🎤' },
                { label: 'Offers Made', value: offered, color: 'text-emerald-400', icon: '🎉' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-dark-text text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pipeline Chart */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="text-white font-semibold mb-4">Hiring Pipeline</h2>
              <div className="space-y-3">
                {[
                  { label: 'Applied', count: pending, color: 'bg-blue-400' },
                  { label: 'Shortlisted', count: shortlisted, color: 'bg-yellow-400' },
                  { label: 'Interview', count: interviews, color: 'bg-green-400' },
                  { label: 'Offer', count: offered, color: 'bg-emerald-400' },
                  { label: 'Rejected', count: rejected, color: 'bg-red-400' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-4">
                    <span className="text-dark-text text-sm w-24">{s.label}</span>
                    <div className="flex-1 bg-dark-border rounded-full h-3">
                      <div
                        className={`${s.color} h-3 rounded-full transition-all`}
                        style={{ width: `${applicants.length > 0 ? (s.count / applicants.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-8 text-right">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setTab('post-job')}
                className="gradient-btn text-white py-4 rounded-2xl font-semibold text-lg"
              >
                Post a New Job
              </button>
              <button
                onClick={() => setTab('applicants')}
                className="glass text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/5 transition-colors"
              >
                Review Applicants
              </button>
            </div>
          </div>
        )}

        {/* APPLICANTS */}
        {tab === 'applicants' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">
              All Applicants ({applicants.length})
            </h1>

            {applicants.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-5xl mb-4">👥</p>
                <p className="text-white text-xl mb-2">No applicants yet!</p>
                <p className="text-dark-text mb-6">Post a job to start receiving applications</p>
                <button
                  onClick={() => setTab('post-job')}
                  className="gradient-btn text-white px-8 py-3 rounded-xl font-medium"
                >
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map(a => (
                  <div key={a.id} className="glass rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{a.applicant_name}</h3>
                        <p className="text-dark-text text-sm">{a.email}</p>
                        <p className="text-dark-text text-sm mt-1">
                          Applied for: <span className="text-primary">{a.job_title}</span>
                        </p>
                        <p className="text-dark-text text-xs mt-1">
                          Applied on: {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        {a.overall_score && (
                          <div className="glass rounded-xl px-4 py-2 text-center">
                            <p className={`text-xl font-bold ${
                              a.overall_score >= 70 ? 'text-green-400' :
                              a.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>{a.overall_score}%</p>
                            <p className="text-dark-text text-xs">AI Score</p>
                          </div>
                        )}
                        {a.ats_score && (
                          <div className="glass rounded-xl px-4 py-2 text-center">
                            <p className="text-xl font-bold text-blue-400">{a.ats_score}%</p>
                            <p className="text-dark-text text-xs">ATS</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-dark-text text-sm">Status:</span>
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                        statusConfig[a.status]?.bg || 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                      } ${statusConfig[a.status]?.color}`}>
                        {statusConfig[a.status]?.label || a.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-dark-border pt-4">
                      <p className="text-dark-text text-xs mb-3">Update Status:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatus(a.id, 'viewed')}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                            a.status === 'viewed' ? 'gradient-btn text-white' : 'glass text-dark-text hover:text-white'
                          }`}
                        >
                          Viewed
                        </button>
                        <button
                          onClick={() => handleStatus(a.id, 'shortlisted')}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                            a.status === 'shortlisted' ? 'bg-yellow-500/20 text-yellow-400' : 'glass text-dark-text hover:text-white'
                          }`}
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatus(a.id, 'interview')}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                            a.status === 'interview' ? 'bg-green-500/20 text-green-400' : 'glass text-dark-text hover:text-white'
                          }`}
                        >
                          Schedule Interview
                        </button>
                        <button
                          onClick={() => handleStatus(a.id, 'offer')}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                            a.status === 'offer' ? 'bg-emerald-500/20 text-emerald-400' : 'glass text-dark-text hover:text-white'
                          }`}
                        >
                          Send Offer
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to reject ${a.applicant_name}?`)) {
                              handleStatus(a.id, 'rejected')
                            }
                          }}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                            a.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'glass text-red-400 hover:bg-red-500/10'
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* POST JOB */}
        {tab === 'post-job' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-6">Post a New Job</h1>

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handlePostJob} className="glass rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Job Title *</label>
                <input
                  value={jobForm.title}
                  onChange={e => setJobForm({...jobForm, title: e.target.value})}
                  placeholder="Frontend Developer"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={e => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Requirements</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={e => setJobForm({...jobForm, requirements: e.target.value})}
                  placeholder="2+ years React experience..."
                  rows={3}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">
                  Required Skills * <span className="text-dark-text font-normal">(comma separated)</span>
                </label>
                <input
                  value={jobForm.skills_required}
                  onChange={e => setJobForm({...jobForm, skills_required: e.target.value})}
                  placeholder="React, Node.js, TypeScript, Docker"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-dark-text text-sm mb-2 block">Location *</label>
                  <input
                    value={jobForm.location}
                    onChange={e => setJobForm({...jobForm, location: e.target.value})}
                    placeholder="Bangalore / Remote"
                    required
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
                    <option>Contract</option>
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

              <button
                type="submit"
                className="w-full gradient-btn text-white py-4 rounded-xl font-semibold text-lg"
              >
                Post Job — Goes Live Immediately!
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}