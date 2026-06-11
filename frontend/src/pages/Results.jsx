import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { getAnalysis } from '../api'

export default function Results() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalysis()
  }, [id])

  const loadAnalysis = async () => {
    try {
      const res = await getAnalysis(id)
      setAnalysis(res.data)
    } catch (err) {
      setError('Could not load analysis!')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-white text-xl">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-white text-xl">{error}</p>
          <Link to="/upload" className="gradient-btn text-white px-6 py-3 rounded-xl mt-4 inline-block">
            Try again
          </Link>
        </div>
      </div>
    )
  }

  const scores = analysis?.section_scores || {}
  const weaknesses = analysis?.weaknesses || []
  const keywordGaps = analysis?.keyword_gaps || []
  const existingKeywords = analysis?.existing_keywords || []
  const rewrites = analysis?.rewrite_suggestions || []

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Resume Analysis Report</h1>
            <p className="text-dark-text mt-1">Powered by Claude AI</p>
          </div>
          <button className="glass text-white px-5 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors">
            Download PDF Report
          </button>
        </div>

        {/* AI Summary */}
        {analysis?.summary && (
          <div className="glass rounded-2xl p-6 mb-6 border border-primary/20">
            <h2 className="text-white font-semibold mb-2">📋 AI Summary</h2>
            <p className="text-dark-text text-sm leading-relaxed">{analysis.summary}</p>
          </div>
        )}

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'Overall Score',
              value: analysis?.overall_score,
              desc: analysis?.overall_score >= 70 ? 'Great resume!' :
                    analysis?.overall_score >= 50 ? 'Needs improvement' : 'Needs major work',
              color: analysis?.overall_score >= 70 ? 'text-green-400' :
                     analysis?.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'
            },
            {
              label: 'ATS Score',
              value: analysis?.ats_score,
              desc: analysis?.ats_score >= 70 ? 'Passes ATS filters' : 'May fail ATS filters',
              color: analysis?.ats_score >= 70 ? 'text-green-400' : 'text-orange-400'
            },
            {
              label: 'JD Match',
              value: analysis?.jd_match_score,
              desc: analysis?.jd_match_score ? 'Match with job' : 'No JD provided',
              color: 'text-blue-400'
            },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className={`text-5xl font-bold ${s.color} mb-2`}>
                {s.value !== null && s.value !== undefined ? `${s.value}%` : 'N/A'}
              </div>
              <div className="text-white font-medium mb-1">{s.label}</div>
              <div className="text-dark-text text-sm">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Section Scores */}
        {Object.keys(scores).length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-white font-semibold text-lg mb-4">📊 Section Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(scores).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-text capitalize">{key}</span>
                    <span className="text-white">{value}%</span>
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-2">
                    <div
                      className="gradient-btn h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-white font-semibold text-lg mb-4">⚠️ Weaknesses Found</h2>
            <div className="space-y-4">
              {weaknesses.map((w, i) => (
                <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400 font-medium mb-1">❌ {w.issue}</p>
                  <p className="text-dark-text text-sm">💡 {w.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyword Gap Analysis */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">🔍 Keyword Gap Analysis</h2>
          {keywordGaps.length > 0 && (
            <div className="mb-4">
              <p className="text-dark-text text-sm mb-3">Missing keywords:</p>
              <div className="flex flex-wrap gap-2">
                {keywordGaps.map((k, i) => (
                  <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          {existingKeywords.length > 0 && (
            <div>
              <p className="text-dark-text text-sm mb-3">Keywords you have:</p>
              <div className="flex flex-wrap gap-2">
                {existingKeywords.map((k, i) => (
                  <span key={i} className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    ✓ {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Rewrites */}
        {rewrites.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-white font-semibold text-lg mb-4">✍️ AI Rewrite Suggestions</h2>
            <div className="space-y-4">
              {rewrites.map((r, i) => (
                <div key={i} className="space-y-2">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-xs mb-1">ORIGINAL</p>
                    <p className="text-white text-sm">{r.original}</p>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400 text-xs mb-1">AI IMPROVED</p>
                    <p className="text-white text-sm">{r.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Questions */}
        {analysis?.interview_questions?.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-white font-semibold text-lg mb-4">🎤 Interview Questions</h2>
            <div className="space-y-3">
              {analysis.interview_questions.map((q, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <p className="text-white text-sm">
                    <span className="text-primary font-bold mr-2">{i + 1}.</span>
                    {q}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {analysis?.cover_letter && (
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold text-lg">📝 AI Generated Cover Letter</h2>
              <button
                onClick={() => navigator.clipboard.writeText(analysis.cover_letter)}
                className="text-primary text-sm hover:underline"
              >
                Copy
              </button>
            </div>
            <p className="text-dark-text text-sm whitespace-pre-line leading-relaxed">
              {analysis.cover_letter}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/upload" className="glass text-white py-3 rounded-xl font-medium text-center hover:bg-white/5 transition-colors">
            Upload New Resume
          </Link>
          <Link to="/jobs" className="gradient-btn text-white py-3 rounded-xl font-medium text-center">
            Browse Matching Jobs
          </Link>
          <Link to="/ai-tools" className="glass text-white py-3 rounded-xl font-medium text-center hover:bg-white/5 transition-colors">
            More AI Tools
          </Link>
        </div>

      </div>
    </div>
  )
}