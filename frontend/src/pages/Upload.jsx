import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { uploadResume } from '../api'

export default function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setError('')
    setAnalyzing(true)
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('job_description', jobDesc)

      setProgress(30)
      const res = await uploadResume(formData)
      setProgress(100)

      setTimeout(() => {
        navigate(`/results/${res.data.analysis_id}`)
      }, 500)

    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed! Please try again.')
      setAnalyzing(false)
      setProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Analyze your resume
          </h1>
          <p className="text-dark-text text-lg">
            Get AI-powered score and feedback in seconds
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Upload Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`glass rounded-2xl p-12 text-center border-2 border-dashed transition-colors mb-6 ${dragOver ? 'border-primary bg-primary/5' : 'border-dark-border'}`}
        >
          {file ? (
            <div>
              <div className="text-5xl mb-4">📄</div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-dark-text text-sm mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                onClick={() => setFile(null)}
                className="text-red-400 text-sm mt-3 hover:underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4">📂</div>
              <p className="text-white font-medium mb-2">
                Drag and drop your resume here
              </p>
              <p className="text-dark-text text-sm mb-4">
                PDF, DOCX or TXT — max 5MB
              </p>
              <label className="gradient-btn text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer">
                Browse file
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={e => setFile(e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-white font-medium mb-2">
            Job Description{' '}
            <span className="text-dark-text text-sm font-normal">
              (optional — for match score)
            </span>
          </h3>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the job description here to get a match percentage..."
            rows={5}
            className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Analyze Button */}
        {analyzing ? (
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dark-text">
                {progress < 30 ? '📤 Uploading resume...' :
                 progress < 60 ? '📝 Extracting text...' :
                 progress < 90 ? '🤖 Claude AI analyzing...' :
                 '✅ Generating report...'}
              </span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-2">
              <div
                className="gradient-btn h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-dark-text text-xs text-center mt-3">
              Please wait — Claude AI is reading your resume...
            </p>
          </div>
        ) : (
          <button
            onClick={handleAnalyze}
            disabled={!file}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-opacity ${file ? 'gradient-btn text-white' : 'bg-dark-card text-dark-text cursor-not-allowed'}`}
          >
            {file ? '🤖 Analyze my resume with AI →' : 'Upload a file first'}
          </button>
        )}

      </div>
    </div>
  )
}