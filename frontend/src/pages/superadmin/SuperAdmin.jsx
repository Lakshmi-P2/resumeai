import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getStats, getAllUsers, getAllResumes, getAllCompanies, suspendUser, approveCompany } from '../../api'

export default function SuperAdmin() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [resumes, setResumes] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'superadmin') {
      navigate('/login')
      return
    }
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [statsRes, usersRes, resumesRes, companiesRes] = await Promise.all([
        getStats(),
        getAllUsers(),
        getAllResumes(),
        getAllCompanies(),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setResumes(resumesRes.data)
      setCompanies(companiesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async (id) => {
    try {
      await suspendUser(id)
      setUsers(users.map(u => u.id === id ? { ...u, is_suspended: true } : u))
    } catch (err) {
      console.error(err)
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveCompany(id)
      setCompanies(companies.map(c => c.id === id ? { ...c, status: 'active' } : c))
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

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'resumes', label: '📄 Resumes' },
    { id: 'companies', label: '🏢 Companies' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="glass border-b border-dark-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold">ResumeAI</span>
          <span className="text-dark-text text-sm">/ Super Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-dark-text text-sm">👋 {user?.name}</span>
          <button
            onClick={() => { logoutUser(); navigate('/') }}
            className="text-dark-text text-sm hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'gradient-btn text-white' : 'glass text-dark-text hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && stats && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Platform Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.total_users, icon: '👥' },
                { label: 'Total Resumes', value: stats.total_resumes, icon: '📄' },
                { label: 'Total Jobs', value: stats.total_jobs, icon: '💼' },
                { label: 'Applications', value: stats.total_applications, icon: '📝' },
                { label: 'Companies', value: stats.total_companies, icon: '🏢' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-dark-text text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">All Users ({users.length})</h1>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-dark-text text-sm px-6 py-4">Name</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Email</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Role</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Status</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-dark-border hover:bg-white/2">
                      <td className="px-6 py-4 text-white text-sm">{u.name}</td>
                      <td className="px-6 py-4 text-dark-text text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="glass text-dark-text text-xs px-2 py-1 rounded-lg">{u.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${u.is_suspended ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                          {u.is_suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!u.is_suspended && u.role !== 'superadmin' && (
                          <button
                            onClick={() => handleSuspend(u.id)}
                            className="text-red-400 text-xs hover:underline"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumes */}
        {tab === 'resumes' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">All Resumes ({resumes.length})</h1>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-dark-text text-sm px-6 py-4">User</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">File</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Score</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">ATS</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map(r => (
                    <tr key={r.id} className="border-b border-dark-border">
                      <td className="px-6 py-4 text-white text-sm">{r.user_name}</td>
                      <td className="px-6 py-4 text-dark-text text-sm">{r.filename}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-sm ${r.overall_score >= 70 ? 'text-green-400' : r.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {r.overall_score || 'N/A'}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-text text-sm">{r.ats_score || 'N/A'}%</td>
                      <td className="px-6 py-4 text-dark-text text-sm">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Companies */}
        {tab === 'companies' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">All Companies ({companies.length})</h1>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-dark-text text-sm px-6 py-4">Name</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Type</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Status</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(c => (
                    <tr key={c.id} className="border-b border-dark-border">
                      <td className="px-6 py-4 text-white text-sm">{c.name}</td>
                      <td className="px-6 py-4 text-dark-text text-sm">{c.type}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {c.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(c.id)}
                            className="text-green-400 text-xs hover:underline"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}