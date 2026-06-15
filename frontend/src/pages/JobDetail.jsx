import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { getJob, applyJob, getMyResumes } from '../api'
import { useAuth } from '../context/AuthContext'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedResume, setSelectedResume] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    loadJob()
    if (user) loadResumes()
  }, [id, user])

  const loadJob = async () => {
    try {
      const res = await getJob(id)
      setJob(res.data)
    } catch (err) {
      setError('Job not found!')
    } finally {
      setLoading(false)
    }
  }

  const loadResumes = async () => {
    try {
      const res = await getMyResumes()
      setResumes(res.data)
      if (res.data.length > 0) setSelectedResume(res.data[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleApply = async () => {
    if (!user) { navigate('/login'); return }
    setApplying(true)
    setError('')
    try {
      await applyJob(id, { resume_id: selectedResume || null, cover_letter: coverLetter })
      setApplied(true)
      setShowModal(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply!')
    } finally {
      setApplying(false)
    }
  }

  const getSkills = (skills) => {
    if (!skills) return []
    if (Array.isArray(skills)) return skills
    try { return JSON.parse(skills) } catch { return [] }
  }

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  if (!job) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Job not found!</p>
        <Link to="/jobs" className="gradient-btn text-white px-6 py-3 rounded-xl">Back to Jobs</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">

        <Link to="/jobs" className="text-dark-text hover:text-white text-sm mb-6 inline-block">
          Back to Jobs
        </Link>

        {applied && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-4 rounded-xl mb-6 text-center">
            <p className="text-lg font-bold">Application Submitted!</p>
            <Link to="/applications" className="text-white underline text-sm mt-2 inline-block">
              View My Applications
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-1">{job.title}</h1>
              <p className="text-primary font-medium text-lg">{job.company_name}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-dark-text text-sm">
                <span>Location: {job.location}</span>
                <span>Type: {job.job_type}</span>
                {job.salary_min && <span>Salary: Rs.{job.salary_min}-{job.salary_max} LPA</span>}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {getSkills(job.skills_required).map((s, i) => (
                  <span key={i} className="glass text-dark-text text-xs px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Job Description</h2>
              <p className="text-dark-text text-sm leading-relaxed whitespace-pre-line">
                {job.description || 'No description provided'}
              </p>
            </div>

            {job.requirements && (
              <div className="glass rounded-2xl p-6">
                <h2 className="text-white font-semibold text-lg mb-4">Requirements</h2>
                <p className="text-dark-text text-sm leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Apply for this job</h2>
              {job.deadline && (
                <p className="text-dark-text text-sm mb-4">
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}
              {applied ? (
                <p className="text-green-400 font-medium text-center py-4">Applied!</p>
              ) : (
                <button
                  onClick={() => user ? setShowModal(true) : navigate('/login')}
                  className="w-full gradient-btn text-white py-3 rounded-xl font-semibold"
                >
                  {user ? 'Apply Now' : 'Login to Apply'}
                </button>
              )}
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-3">About Company</h2>
              <p className="text-white font-medium">{job.company_name}</p>
              {job.company_website && (
                <a href={job.company_website} target="_blank" rel="noreferrer"
                  className="text-primary text-sm hover:underline block mt-1">
                  Visit website
                </a>
              )}
              {job.company_desc && (
                <p className="text-dark-text text-sm mt-2">{job.company_desc}</p>
              )}
            </div>
          </div>

        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
            <div className="glass rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-white font-bold text-xl mb-6">Apply for {job.title}</h2>

              {resumes.length > 0 ? (
                <div className="mb-4">
                  <label className="text-dark-text text-sm mb-2 block">Select Resume</label>
                  <select
                    value={selectedResume}
                    onChange={e => setSelectedResume(e.target.value)}
                    className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.filename} {r.overall_score ? `(Score: ${r.overall_score}%)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                  <p className="text-yellow-400 text-sm">
                    No resume yet!
                    <Link to="/upload" className="underline ml-1">Upload first</Link>
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="text-dark-text text-sm mb-2 block">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Write a brief cover letter..."
                  rows={4}
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 glass text-dark-text py-3 rounded-xl hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 gradient-btn text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}