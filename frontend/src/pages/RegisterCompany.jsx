import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api'
import { useAuth } from '../context/AuthContext'

export default function RegisterCompany() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    org_name: '',
    org_type: 'company',
    website: '',
    phone: '',
    address: '',
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
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'company',
        org_name: form.org_name,
        org_type: form.org_type,
        website: form.website,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-dark-text mb-6">
            Your organization account is under review. Our team will approve it within 24 hours and notify you by email!
          </p>
          <div className="glass rounded-xl p-4 mb-6 text-left">
            <p className="text-dark-text text-sm mb-1">Organization: <span className="text-white">{form.org_name}</span></p>
            <p className="text-dark-text text-sm mb-1">Type: <span className="text-white capitalize">{form.org_type}</span></p>
            <p className="text-dark-text text-sm">Email: <span className="text-white">{form.email}</span></p>
          </div>
          <Link to="/" className="gradient-btn text-white px-8 py-3 rounded-xl font-medium inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold text-lg">ResumeAI</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">
            Register your Organization
          </h2>
          <p className="text-dark-text">
            For companies and colleges — post jobs and find top talent
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '💼', title: 'Post Jobs', desc: 'Unlimited job postings' },
            { icon: '🤖', title: 'AI Screening', desc: 'AI scores all applicants' },
            { icon: '📊', title: 'Analytics', desc: 'Track hiring pipeline' },
          ].map(b => (
            <div key={b.title} className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{b.icon}</div>
              <p className="text-white text-sm font-medium">{b.title}</p>
              <p className="text-dark-text text-xs">{b.desc}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="glass rounded-2xl p-8 space-y-6">

          {/* Organization Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 pb-2 border-b border-dark-border">
              🏢 Organization Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Organization Name *</label>
                <input
                  name="org_name"
                  value={form.org_name}
                  onChange={handleChange}
                  placeholder="Acme Corp / Silicon City College"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Organization Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'company', label: '🏢 Company', desc: 'Hiring for jobs' },
                    { value: 'college', label: '🎓 College/University', desc: 'Placement cell' },
                  ].map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, org_type: t.value })}
                      className={`p-4 rounded-xl border text-left transition-colors ${
                        form.org_type === t.value
                          ? 'border-primary bg-primary/10'
                          : 'border-dark-border glass'
                      }`}
                    >
                      <p className="text-white text-sm font-medium">{t.label}</p>
                      <p className="text-dark-text text-xs">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Website</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9999999999"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Admin Account */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 pb-2 border-b border-dark-border">
              👤 Admin Account Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Your Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="HR Manager name"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Work Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-dark-text text-sm mb-2 block">Password *</label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text hover:text-white text-sm"
                  >
                    {showPassword ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit for approval →'}
          </button>

          <p className="text-dark-text text-xs text-center">
            Your account will be reviewed and approved within 24 hours
          </p>

        </form>

        <p className="text-center text-dark-text mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>

        <p className="text-center text-dark-text mt-2 text-sm">
          Looking for a job?{' '}
          <Link to="/register" className="text-primary hover:underline">Job seeker registration</Link>
        </p>

      </div>
    </div>
  )
}