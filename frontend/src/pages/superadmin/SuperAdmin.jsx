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
    if (!window.confirm('Are you sure you want to suspend this user?')) return
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
      alert('Company approved! They can now login and post jobs.')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-white text-xl">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'resumes', label: '📄 Resumes' },
    { id: 'companies', label: '🏢 Organizations' },
  ]

  const pendingCompanies = companies.filter(c => c.status === 'pending')

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
            className="glass text-dark-text text-sm px-4 py-2 rounded-lg hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Pending approvals alert */}
        {pendingCompanies.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-yellow-400 font-medium">
                  {pendingCompanies.length} organization(s) waiting for approval!
                </p>
                <p className="text-dark-text text-sm">
                  {pendingCompanies.map(c => c.name).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTab('companies')}
              className="gradient-btn text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Review Now
            </button>
          </div>
        )}

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

        {/* OVERVIEW TAB */}
        {tab === 'overview' && stats && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Platform Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.total_users, icon: '👥', color: 'text-blue-400' },
                { label: 'Resumes Uploaded', value: stats.total_resumes, icon: '📄', color: 'text-purple-400' },
                { label: 'Jobs Posted', value: stats.total_jobs, icon: '💼', color: 'text-green-400' },
                { label: 'Applications', value: stats.total_applications, icon: '📝', color: 'text-yellow-400' },
                { label: 'Organizations', value: stats.total_companies, icon: '🏢', color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-dark-text text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Users */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="text-white font-semibold text-lg mb-4">Recent Users</h2>
              <div className="space-y-3">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between glass rounded-xl p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{u.name}</p>
                      <p className="text-dark-text text-xs">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.role === 'superadmin' ? 'bg-red-500/10 text-red-400' :
                        u.role === 'company' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-green-500/10 text-green-400'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Resumes */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Recent Resume Uploads</h2>
              <div className="space-y-3">
                {resumes.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between glass rounded-xl p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{r.user_name}</p>
                      <p className="text-dark-text text-xs">{r.filename}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        r.overall_score >= 70 ? 'text-green-400' :
                        r.overall_score >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {r.overall_score ? `${r.overall_score}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
                {resumes.length === 0 && (
                  <p className="text-dark-text text-sm text-center py-4">No resumes uploaded yet!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                All Users ({users.length})
              </h1>
              <div className="glass rounded-xl px-4 py-2">
                <span className="text-dark-text text-sm">
                  Active: {users.filter(u => !u.is_suspended).length} |
                  Suspended: {users.filter(u => u.is_suspended).length}
                </span>
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-dark-text text-sm px-6 py-4">Name</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Email</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Role</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Joined</th>
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
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.role === 'superadmin' ? 'bg-red-500/10 text-red-400' :
                          u.role === 'company' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-text text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.is_suspended
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
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

        {/* RESUMES TAB */}
        {tab === 'resumes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                All Resumes ({resumes.length})
              </h1>
              <div className="glass rounded-xl px-4 py-2">
                <span className="text-dark-text text-sm">
                  Avg Score: {resumes.length > 0
                    ? Math.round(resumes.filter(r => r.overall_score).reduce((a, b) => a + b.overall_score, 0) / resumes.filter(r => r.overall_score).length) || 'N/A'
                    : 'N/A'}%
                </span>
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-dark-text text-sm px-6 py-4">User</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Email</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">File</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Score</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">ATS</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-dark-text">
                        No resumes uploaded yet!
                      </td>
                    </tr>
                  ) : (
                    resumes.map(r => (
                      <tr key={r.id} className="border-b border-dark-border hover:bg-white/2">
                        <td className="px-6 py-4 text-white text-sm">{r.user_name}</td>
                        <td className="px-6 py-4 text-dark-text text-sm">{r.email}</td>
                        <td className="px-6 py-4 text-dark-text text-sm">{r.filename}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold text-sm ${
                            r.overall_score >= 70 ? 'text-green-400' :
                            r.overall_score >= 50 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {r.overall_score ? `${r.overall_score}%` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-dark-text text-sm">
                          {r.ats_score ? `${r.ats_score}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-dark-text text-sm">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {tab === 'companies' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                All Organizations ({companies.length})
              </h1>
              <div className="glass rounded-xl px-4 py-2">
                <span className="text-dark-text text-sm">
                  Pending: {pendingCompanies.length} |
                  Active: {companies.filter(c => c.status === 'active').length}
                </span>
              </div>
            </div>

            {pendingCompanies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-yellow-400 font-semibold mb-3">
                  ⚠️ Pending Approval ({pendingCompanies.length})
                </h2>
                <div className="space-y-3">
                  {pendingCompanies.map(c => (
                    <div key={c.id} className="glass rounded-xl p-4 border border-yellow-500/20 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-dark-text text-sm capitalize">{c.type} · {c.website}</p>
                        <p className="text-dark-text text-xs">
                          Registered: {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(c.id)}
                          className="gradient-btn text-white text-sm px-4 py-2 rounded-lg font-medium"
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="glass text-red-400 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left text-dark-text text-sm px-6 py-4">Organization</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Type</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Website</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Status</th>
                    <th className="text-left text-dark-text text-sm px-6 py-4">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-dark-text">
                        No organizations registered yet!
                      </td>
                    </tr>
                  ) : (
                    companies.map(c => (
                      <tr key={c.id} className="border-b border-dark-border hover:bg-white/2">
                        <td className="px-6 py-4 text-white text-sm font-medium">{c.name}</td>
                        <td className="px-6 py-4">
                          <span className="glass text-dark-text text-xs px-2 py-1 rounded-lg capitalize">
                            {c.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-dark-text text-sm">{c.website || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            c.status === 'active'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-dark-text text-sm">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}