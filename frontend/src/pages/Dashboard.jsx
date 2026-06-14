import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import { getMyResumes, getMyApplications, getJobs } from '../api'

export default function Dashboard() {
  const { user, logoutUser } = useAuth()
  const [resumes, setResumes] = useState([])
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [resumesRes, appsRes, jobsRes] = await Promise.all([
        getMyResumes(),
        getMyApplications(),
        getJobs(),
      ])
      setResumes(resumesRes.data)
      setApplications(appsRes.data)
      setJobs(jobsRes.data.slice(0, 3))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const latestResume = resumes[0]
  const interviews = applications.filter(a => a.status === 'interview').length

  const stats = [
    {
      label: 'Resume Score',
      value: latestResume?.overall_score ? `${latestResume.overall_score}%` : 'N/A',
      color: latestResume?.overall_score >= 70 ? 'text-green-400' : 'text-yellow-400',
      icon: '📊'
    },
    {
      label: 'ATS Score',
      value: latestResume?.ats_score ? `${latestResume.ats_score}%` : 'N/A',
      color: 'text-orange-400',
      icon: '🎯'
    },
    {
      label: 'Jobs Applied',
      value: applications.length,
      color: 'text-blue-400',
      icon: '💼'
    },
    {
      label: 'Interviews',
      value: interviews,
      color: 'text-green-400',
      icon: '🎤'
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-dark-text mt-1">Here's your career progress</p>
          </div>
          <Link to="/upload" className="gradient-btn text-white px-6 py-3 rounded-xl font-medium">
            + Analyze Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-dark-text text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Resume History */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4">My Resumes</h2>
            {resumes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📄</p>
                <p className="text-dark-text text-sm">No resumes yet!</p>
                <Link to="/upload" className="text-primary text-sm hover:underline block mt-2">
                  Upload your first resume →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.slice(0, 4).map((r, i) => (
                  <div key={i} className="glass rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-medium truncate w-36">{r.filename}</p>
                      <p className="text-dark-text text-xs">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm font-bold ${
                      r.overall_score >= 70 ? 'text-green-400' :
                      r.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {r.overall_score ? `${r.overall_score}%` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/upload" className="block text-center mt-4 text-primary text-sm hover:underline">
              Upload new resume →
            </Link>
          </div>

          {/* Recent Applications */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Recent Applications</h2>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">💼</p>
                <p className="text-dark-text text-sm">No applications yet!</p>
                <Link to="/jobs" className="text-primary text-sm hover:underline block mt-2">
                  Browse jobs →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 4).map((app, i) => (
                  <div key={i} className="glass rounded-xl p-3">
                    <p className="text-white text-sm font-medium">{app.job_title}</p>
                    <p className="text-dark-text text-xs">{app.company_name}</p>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full capitalize ${
                      app.status === 'interview' ? 'bg-green-500/10 text-green-400' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/applications" className="block text-center mt-4 text-primary text-sm hover:underline">
              View all applications →
            </Link>
          </div>

          {/* Latest Jobs */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Latest Jobs</h2>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-dark-text text-sm">No jobs available!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <h3 className="text-white text-sm font-medium">{job.title}</h3>
                    <p className="text-dark-text text-xs">{job.company_name} · {job.location}</p>
                    {job.salary_min && (
                      <p className="text-primary text-xs mt-1">
                        ₹{job.salary_min}-{job.salary_max} LPA
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link to="/jobs" className="block text-center mt-4 text-primary text-sm hover:underline">
              View all jobs →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {[
            { label: '📄 Upload Resume', href: '/upload' },
            { label: '💼 Browse Jobs', href: '/jobs' },
            { label: '📝 My Applications', href: '/applications' },
            { label: '🤖 AI Tools', href: '/ai-tools' },
            { label: '🎤 Interview Prep', href: '/interview-prep' },
          ].map(link => (
            <Link
              key={link.label}
              to={link.href}
              className="glass rounded-xl p-4 text-center text-white text-sm font-medium hover:border-primary/30 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}