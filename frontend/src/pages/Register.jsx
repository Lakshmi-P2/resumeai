import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [tab, setTab] = useState('jobseeker')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    org_name: '',
    org_type: 'company',
    website: ''
  })
  const { loginUser } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = tab === 'jobseeker'
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'jobseeker'
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            role: 'company',
            org_name: form.org_name,
            org_type: form.org_type,
            website: form.website
          }

      const res = await register(data)
      loginUser(res.data.token, res.data.user)
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold text-lg">ResumeAI</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
          <p className="text-dark-text">Start analyzing your resume for free</p>
        </div>

        {/* Tabs */}
        <div className="glass rounded-xl p-1 flex mb-6">
          <button
            onClick={() => setTab('jobseeker')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'jobseeker' ? 'gradient-btn text-white' : 'text-dark-text'}`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => setTab('company')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'company' ? 'gradient-btn text-white' : 'text-dark-text'}`}
          >
            Company / College
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="glass rounded-2xl p-6 space-y-4">

          <div>
            <label className="text-dark-text text-sm mb-2 block">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Lakshmi"
              required
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-dark-text text-sm mb-2 block">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-dark-text text-sm mb-2 block">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                required
                minLength={8}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors pr-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text hover:text-white transition-colors text-sm"
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          {tab === 'company' && (
            <>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Organization name</label>
                <input
                  name="org_name"
                  value={form.org_name}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Type</label>
                <select
                  name="org_type"
                  value={form.org_type}
                  onChange={handleChange}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="company">Company</option>
                  <option value="college">College</option>
                </select>
              </div>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Creating account...' : tab === 'jobseeker' ? 'Create free account' : 'Submit for approval'}
          </button>

        </form>

        <p className="text-center text-dark-text mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>

      </div>
    </div>
  )
}