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
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'Full-time',
    salary_min: '',
    salary_max: '',
    deadline: '',
    skills_required: '',
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
        .split(',')
        .map(s => s.trim())
        .filter(s => s)

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
        salary_min: '', salary_max: '', deadline: '',
        skills_required: '',
      })
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      alert('Failed to post job! Make sure your company is approved.')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppStatus(id, { status })
      setApplicants(applicants.map(a =>
        a.id === id ? { ...a, status } : a
      ))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'post-job', label: '➕ Post Job' },
    { id: 'applicants', label: `👥 Applicants (${applicants.length})` },
  ]

  const statusColor = {
    applied: 'text-blue-400',
    viewed: 'text-purple-400',
    shortlisted: 'text-yellow-400',
    interview: 'text-green-400',
    offer: 'text-emerald-400',
    rejected: 'text-red-400',
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
            className="glass text-dark-text text-sm px-4 py-2 rounded-lg hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? 'gradient-btn text-white' : 'glass text-dark-text hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Company Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Applicants', value: applicants.length, icon: '👥', color: 'text-blue-400' },
                { label: 'Shortlisted', value: applicants.filter(a => a.status === 'shortlisted').length, icon: '⭐', color: 'text-yellow-400' },
                { label: 'Interviews', value: applicants.filter(a => a.status === 'interview').length, icon: '🎤', color: 'text-green-400' },
                { label: 'Offers Made', value: applicants.filter(a => a.status === 'offer').length, icon: '🎉', color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-dark-text text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setTab('post-job')}
                    className="w-full gradient-btn text-white py-3 rounded-xl font-medium"
                  >
                    ➕ Post a New Job
                  </button>
                  <button
                    onClick={() => setTab('applicants')}
                    className="w-full glass text-white py-3 rounded-xl font-medium hover:bg-white/5 transition-colors"
                  >
                    👥 View All Applicants
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Pipeline Summary</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Applied', count: applicants.filter(a => a.status === 'applied').length, color: 'bg-blue-400' },
                    { label: 'Shortlisted', count: applicants.filter(a => a.status === 'shortlisted').length, color: 'bg-yellow-400' },
                    { label: 'Interview', count: applicants.filter(a => a.status === 'interview').length, color: 'bg-green-400' },
                    { label: 'Offer', count: applicants.filter(a => a.status === 'offer').length, color: 'bg-emerald-400' },
                    { label: 'Rejected', count: applicants.filter(a => a.status === 'rejected').length, color: 'bg-red-400' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-dark-text text-sm w-20">{s.label}</span>
                      <div className="flex-1 bg-dark-border rounded-full h-2">
                        <div
                          className={`${s.color} h-2 rounded-full`}
                          style={{ width: `${applicants.length > 0 ? (s.count / applicants.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-white text-sm w-6">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* POST JOB TAB */}
        {tab === 'post-job' && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-6">Post a New Job</h1>

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6">
                ✅ {success}
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
                <label className="text-dark-text text-sm mb-2 block">Job Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={e => setJobForm({...jobForm, description: e.target.value})}
                  placeholder="Describe the role, responsibilities..."
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
                  placeholder="2+ years React experience, strong JavaScript skills..."
                  rows={3}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">
                  Required Skills *
                  <span className="text-dark-text font-normal"> (comma separated)</span>
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
                🚀 Post Job — Goes Live Immediately!
              </button>

            </form>
          </div>
        )}

        {/* APPLICANTS TAB */}
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
                  className="gradient-btn text-white px-6 py-3 rounded-xl font-medium"
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
                        <p className="text-dark-text text-sm">Applied for: <span className="text-primary">{a.job_title}</span></p>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-3 mb-2">
                          {a.overall_score && (
                            <div className="glass rounded-xl px-3 py-2 text-center">
                              <p className={`text-lg font-bold ${a.overall_score >= 70 ? 'text-green-400' : a.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {a.overall_score}%
                              </p>
                              <p className="text-dark-text text-xs">AI Score</p>
                            </div>
                          )}
                          {a.ats_score && (
                            <div className="glass rounded-xl px-3 py-2 text-center">
                              <p className="text-lg font-bold text-blue-400">{a.ats_score}%</p>
                              <p className="text-dark-text text-xs">ATS</p>
                            </div>
                          )}
                        </div>
                        <span className={`text-sm font-medium capitalize ${statusColor[a.status] || 'text-dark-text'}`}>
                          {a.status}
                        </span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-dark-text text-sm mr-2 self-center">Move to:</span>
                      {['viewed', 'shortlisted', 'interview', 'offer', 'rejected'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(a.id, status)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors capitalize ${
                            a.status === status
                              ? 'gradient-btn text-white'
                              : 'glass text-dark-text hover:text-white'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}