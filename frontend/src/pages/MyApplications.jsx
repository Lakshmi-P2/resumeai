import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { getMyApplications } from '../api'
import { Link } from 'react-router-dom'

const stages = ['applied', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected']

const statusConfig = {
  applied: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Applied', icon: '📤' },
  viewed: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Viewed by Company', icon: '👀' },
  shortlisted: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Shortlisted!', icon: '⭐' },
  interview: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Interview Scheduled!', icon: '🎤' },
  offer: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Offer Received!', icon: '🎉' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Not Selected', icon: '❌' },
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const res = await getMyApplications()
      setApplications(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: 'Total Applied', value: applications.length, color: 'text-white', icon: '📝' },
    { label: 'Under Review', value: applications.filter(a => ['applied', 'viewed'].includes(a.status)).length, color: 'text-blue-400', icon: '🔍' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-yellow-400', icon: '⭐' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length, color: 'text-green-400', icon: '🎤' },
    { label: 'Offers', value: applications.filter(a => a.status === 'offer').length, color: 'text-emerald-400', icon: '🎉' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Applications</h1>
          <p className="text-dark-text mt-1">Track all your job applications in real time</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-dark-text text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Kanban Pipeline */}
        <div className="glass rounded-2xl p-6 mb-8 overflow-x-auto">
          <h2 className="text-white font-semibold text-lg mb-4">Application Pipeline</h2>
          <div className="flex gap-4 min-w-max">
            {stages.map(stage => {
              const stageApps = applications.filter(a => a.status === stage)
              const config = statusConfig[stage]
              return (
                <div key={stage} className="w-48">
                  <div className={`text-xs font-medium mb-3 uppercase tracking-wide ${config?.color || 'text-dark-text'}`}>
                    {config?.label || stage} ({stageApps.length})
                  </div>
                  <div className="space-y-2">
                    {stageApps.map((app, i) => (
                      <div key={i} className={`glass rounded-xl p-3 border ${config?.bg || ''}`}>
                        <p className="text-white text-sm font-medium">{app.company_name}</p>
                        <p className="text-dark-text text-xs">{app.job_title}</p>
                      </div>
                    ))}
                    {stageApps.length === 0 && (
                      <div className="border border-dashed border-dark-border rounded-xl p-3 text-center">
                        <p className="text-dark-text text-xs">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Applications List */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-4">All Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-white text-xl mb-2">No applications yet!</p>
              <p className="text-dark-text mb-6">Browse jobs and start applying</p>
              <Link to="/jobs" className="gradient-btn text-white px-8 py-3 rounded-xl font-medium inline-block">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, i) => {
                const config = statusConfig[app.status]
                return (
                  <div key={i} className={`flex items-center justify-between glass rounded-xl p-4 border ${config?.bg || ''}`}>
                    <div>
                      <p className="text-white font-medium">{app.job_title}</p>
                      <p className="text-dark-text text-sm">
                        {app.company_name} · {app.location}
                      </p>
                      <p className="text-dark-text text-xs mt-1">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-2 ${config?.color}`}>
                        <span>{config?.icon}</span>
                        <span className="text-sm font-medium">{config?.label || app.status}</span>
                      </div>
                      {app.status === 'offer' && (
                        <p className="text-emerald-400 text-xs mt-1">Congratulations!</p>
                      )}
                      {app.status === 'interview' && (
                        <p className="text-green-400 text-xs mt-1">Check your email!</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}