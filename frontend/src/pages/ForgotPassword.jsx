import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold text-lg">ResumeAI</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Forgot password?</h2>
          <p className="text-dark-text">Enter your email and we'll send reset instructions</p>
        </div>

        {submitted ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-white font-semibold text-xl mb-2">Check your email!</h3>
            <p className="text-dark-text text-sm mb-6">
              We sent password reset instructions to {email}
            </p>
            <Link to="/login" className="gradient-btn text-white px-6 py-3 rounded-xl font-medium inline-block">
              Back to login
            </Link>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-btn text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </form>
            <p className="text-center text-dark-text mt-4 text-sm">
              Remember password?{' '}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}