import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ email, password })
      const role = res.data.user.role
      loginUser(res.data.token, res.data.user)
      if (role === 'superadmin') {
        window.location.href = '/superadmin'
      } else if (role === 'company') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex">

      {/* Left side */}
      <div className="hidden lg:flex w-1/2 gradient-btn items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">ResumeAI</h1>
          <p className="text-white/80 text-lg mb-8">Your AI-powered career platform</p>
          <div className="space-y-3 text-left">
            {[
              'AI Resume Analysis and Scoring',
              'ATS Compatibility Check',
              'Job Board with Real Companies',
              'Application Tracking Pipeline',
              'Interview Prep with AI',
              'Cover Letter Generator',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <Link to="/" className="text-dark-text text-sm hover:text-white transition-colors">
              Back to home
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-dark-text mb-8">
            Sign in to your ResumeAI account
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-dark-text text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-dark-text text-sm mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text hover:text-white text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-primary text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn text-white py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 space-y-3">
            <p className="text-center text-dark-text text-sm">
              New job seeker?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create free account
              </Link>
            </p>
            <p className="text-center text-dark-text text-sm">
              Are you a company or college?{' '}
              <Link to="/register-company" className="text-primary hover:underline">
                Register organization
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}