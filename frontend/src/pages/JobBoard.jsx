import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { getJobs } from '../api'

export default function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const res = await getJobs()
      setJobs(res.data)
    } catch (err) {
      console.error(err)
      // Use sample jobs if no real jobs exist
      setJobs([
        { id: 1, title: 'Frontend Developer', company_name: 'Google', location: 'Bangalore', job_type: 'Full-time', salary_min: 25, salary_max: 35, skills_required: ['React', 'TypeScript'], created_at: new Date() },
        { id: 2, title: 'React Developer', company_name: 'Swiggy', location: 'Bangalore', job_type: 'Full-time', salary_min: 18, salary_max: 25, skills_required: ['React', 'Node.js'], created_at: new Date() },
        { id: 3, title: 'UI Engineer', company_name: 'Razorpay', location: 'Remote', job_type: 'Remote', salary_min: 20, salary_max: 30, skills_required: ['React', 'Tailwind'], created_at: new Date() },
        { id: 4, title: 'Full Stack Developer', company_name: 'Zepto', location: 'Mumbai', job_type: 'Full-time', salary_min: 15, salary_max: 22, skills_required: ['Node.js', 'React'], created_at: new Date() },
        { id: 5, title: 'Backend Developer', company_name: 'PhonePe', location: 'Bangalore', job_type: 'Full-time', salary_min: 22, salary_max: 32, skills_required: ['Node.js', 'Python'], created_at: new Date() },
        { id: 6, title: 'DevOps Engineer', company_name: 'Flipkart', location: 'Bangalore', job_type: 'Full-time', salary_min: 20, salary_max: 28, skills_required: ['Docker', 'AWS'], created_at: new Date() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company_name?.toLowerCase().includes(search.toLowerCase())
  ).filter(j => filter === 'all' || j.job_type?.toLowerCase() === filter)

  const getSkills = (skills) => {
    if (!skills) return []
    if (Array.isArray(skills)) return skills
    try { return JSON.parse(skills) } catch { return [] }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Find your dream job</h1>
          <p className="text-dark-text text-lg">
            {jobs.length} jobs available
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search by job title, company or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
          >
            <option value="all">All types</option>
            <option value="full-time">Full-time</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Job Cards */}
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white text-xl">No jobs found!</p>
            <p className="text-dark-text mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(job => (
              <div key={job.id} className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{job.title}</h3>
                    <p className="text-dark-text text-sm">{job.company_name} · {job.location}</p>
                  </div>
                  <span className="glass text-dark-text text-xs px-3 py-1 rounded-full">
                    {job.job_type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {getSkills(job.skills_required).slice(0, 4).map((s, i) => (
                    <span key={i} className="glass text-dark-text text-xs px-2 py-1 rounded-lg">{s}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {job.salary_min && (
                      <p className="text-primary font-medium text-sm">
                        {job.salary_min}-{job.salary_max} LPA
                      </p>
                    )}
                    <p className="text-dark-text text-xs">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="gradient-btn text-white text-sm px-4 py-2 rounded-lg font-medium"
                  >
                    Apply now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}