import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { getMyApplications } from '../api'

const stages = ['applied', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected']

const statusColor = {
  applied: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  viewed: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  shortlisted: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  interview: 'bg-green-500/10 border-green-500/20 text-green-400',
  offer: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/10 border-red-500/20 text-red-400',
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
    { label: 'Total Applied', value: applications.length, color: 'text-white' },
    { label: 'In Progress', value: applications.filter(a => !['rejected', 'offer'].includes(a.status)).length, color: 'text-blue-400' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length, color: 'text-green-400' },
    { label: 'Offers', value: applications.filter(a => a.status === 'offer').length, color: 'text-yellow-400' },
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
          <p className="text-dark-text mt-1">Track all your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
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
              return (
                <div key={stage} className="w-44">
                  <div className="text-dark-text text-xs font-medium mb-3 uppercase tracking-wide">
                    {stage} ({stageApps.length})
                  </div>
                  <div className="space-y-2">
                    {stageApps.map((app, i) => (
                      <div key={i} className="glass rounded-xl p-3">
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
              <p className="text-dark-text">Browse jobs and start applying</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, i) => (
                <div key={i} className="flex items-center justify-between glass rounded-xl p-4">
                  <div>
                    <p className="text-white font-medium">{app.job_title}</p>
                    <p className="text-dark-text text-sm">
                      {app.company_name} · Applied {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`border px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor[app.status] || 'bg-gray-500/10 border-gray-500/20 text-gray-400'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}