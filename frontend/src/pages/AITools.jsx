import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function AITools() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('cover')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [bullet, setBullet] = useState('')
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    setGenerated('')

    try {
      if (activeTab === 'cover') {
        if (!jobTitle || !company) {
          setError('Please enter job title and company name!')
          setLoading(false)
          return
        }
        const res = await axios.post('http://localhost:8000/analyze', {
          resume_text: `Generate a professional cover letter for ${user?.name || 'Lakshmi'} applying for ${jobTitle} position at ${company}. The candidate has skills in React, Node.js, Python, and modern web development.`,
          job_description: `${jobTitle} at ${company}`
        })
        setGenerated(res.data.cover_letter || 'Could not generate cover letter. Please try again.')

      } else if (activeTab === 'interview') {
        if (!jobTitle) {
          setError('Please enter job title!')
          setLoading(false)
          return
        }
        const res = await axios.post('http://localhost:8000/analyze', {
          resume_text: `Generate interview questions for ${jobTitle} role. Candidate name: ${user?.name || 'Lakshmi'}`,
          job_description: jobTitle
        })
        const questions = res.data.interview_questions || []
        setGenerated(
          `Interview Questions for ${jobTitle}:\n\n` +
          questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')
        )

      } else if (activeTab === 'rewrite') {
        if (!bullet) {
          setError('Please enter a bullet point to rewrite!')
          setLoading(false)
          return
        }
        const res = await axios.post('http://localhost:8000/analyze', {
          resume_text: `Rewrite this resume bullet point to be stronger: "${bullet}"`,
          job_description: ''
        })
        const rewrites = res.data.rewrite_suggestions || []
        if (rewrites.length > 0) {
          setGenerated(`Original:\n"${rewrites[0].original}"\n\nAI Improved:\n"${rewrites[0].improved}"`)
        } else {
          setGenerated(`AI Improved Version:\n\n"${bullet}" could be rewritten as a stronger, more impactful bullet point with specific metrics and achievements.`)
        }
      }
    } catch (err) {
      console.error(err)
      setError('AI generation failed! Make sure AI service is running.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'cover', label: '📝 Cover Letter' },
    { id: 'interview', label: '🎤 Interview Prep' },
    { id: 'rewrite', label: '✍️ Bullet Rewriter' },
  ]

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">AI Tools</h1>
          <p className="text-dark-text text-lg">Powered by Claude AI</p>
        </div>

        {/* Tabs */}
        <div className="glass rounded-xl p-1 flex mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setGenerated(''); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'gradient-btn text-white' : 'text-dark-text'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="glass rounded-2xl p-6">

          {/* Cover Letter */}
          {activeTab === 'cover' && (
            <div className="space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Job Title</label>
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-dark-text text-sm mb-2 block">Company Name</label>
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Google"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

          {/* Interview Prep */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">Job Title</label>
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="React Developer"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

          {/* Bullet Rewriter */}
          {activeTab === 'rewrite' && (
            <div className="space-y-4">
              <div>
                <label className="text-dark-text text-sm mb-2 block">
                  Paste your weak bullet point
                </label>
                <textarea
                  value={bullet}
                  onChange={e => setBullet(e.target.value)}
                  placeholder="Worked on frontend features..."
                  rows={3}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full gradient-btn text-white py-3 rounded-xl font-semibold mt-4 disabled:opacity-50"
          >
            {loading ? '🤖 Generating with Claude AI...' : 'Generate with AI ✨'}
          </button>

          {/* Generated Result */}
          {generated && (
            <div className="mt-6 bg-dark border border-dark-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-green-400 text-sm font-medium">✅ Generated!</p>
                <button
                  onClick={() => navigator.clipboard.writeText(generated)}
                  className="text-dark-text text-xs hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-white text-sm whitespace-pre-line leading-relaxed">
                {generated}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}