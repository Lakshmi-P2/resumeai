import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
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
        role: 'jobseeker'
      })
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="glass rounded-2xl p-6 space-y-4">

          <div>
            <label className="text-dark-text text-sm mb-2 block">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Lakshmi P"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text hover:text-white text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>

        </form>

        <div className="mt-6 space-y-3">
          <p className="text-center text-dark-text text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-dark-text text-sm">
            Are you a company or college?{' '}
            <Link to="/register-company" className="text-primary hover:underline">
              Register Organization
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}