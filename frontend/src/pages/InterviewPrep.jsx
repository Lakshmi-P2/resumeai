import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import { getMyResumes, analyzeResume } from '../api'

const CATEGORIES = [
  { id: 'technical', label: '💻 Technical', desc: 'Coding and tech questions' },
  { id: 'behavioral', label: '🤝 Behavioral', desc: 'Soft skills and teamwork' },
  { id: 'hr', label: '👔 HR Round', desc: 'Common HR questions' },
  { id: 'project', label: '📁 Project Based', desc: 'Questions about your projects' },
]

export default function InterviewPrep() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)
  const [jobRole, setJobRole] = useState('')
  const [category, setCategory] = useState('technical')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedQ, setExpandedQ] = useState(null)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    try {
      const res = await getMyResumes()
      setResumes(res.data)
      if (res.data.length > 0) setSelectedResume(res.data[0])
    } catch (err) {
      console.error(err)
    }
  }

  const generateQuestions = async () => {
    if (!jobRole) {
      setError('Please enter a job role!')
      return
    }
    setError('')
    setLoading(true)
    setQuestions([])

    try {
      const resumeText = selectedResume?.raw_text ||
        `Candidate: ${user?.name}\nApplying for: ${jobRole}`

      const res = await analyzeResume({
        resume_text: resumeText,
        job_description: `Generate ${category} interview questions for ${jobRole} role`
      })

      if (res.data.interview_questions && res.data.interview_questions.length > 0) {
        const formattedQuestions = res.data.interview_questions.map((q, i) => ({
          question: typeof q === 'string' ? q : q.question,
          difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
          tip: 'Use the STAR method: Situation, Task, Action, Result',
          sample_answer: 'Structure your answer with specific examples from your experience'
        }))
        setQuestions(formattedQuestions)
      } else {
        generateFallbackQuestions(jobRole, category)
      }
    } catch (err) {
      console.error(err)
      generateFallbackQuestions(jobRole, category)
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackQuestions = (role, cat) => {
    const allQuestions = {
      technical: [
        { question: `What are your core technical skills for ${role}?`, difficulty: 'Easy', tip: 'Mention specific technologies from your resume', sample_answer: 'I have strong experience in React, Node.js and Python...' },
        { question: 'Explain a challenging technical problem you solved.', difficulty: 'Hard', tip: 'Use STAR method with specific metrics', sample_answer: 'I faced a performance issue where page load was slow...' },
        { question: 'How do you stay updated with latest technologies?', difficulty: 'Easy', tip: 'Mention specific resources you use', sample_answer: 'I follow documentation, YouTube channels and build projects...' },
        { question: 'Explain your experience with version control and Git.', difficulty: 'Easy', tip: 'Mention specific Git workflows', sample_answer: 'I use Git daily for version control with branching strategy...' },
        { question: 'How do you approach debugging a complex issue?', difficulty: 'Medium', tip: 'Walk through your systematic process', sample_answer: 'I start by reproducing the issue, then check logs...' },
        { question: 'What design patterns have you used?', difficulty: 'Hard', tip: 'Give specific examples from projects', sample_answer: 'I have used MVC pattern in my ResumeAI project...' },
        { question: 'How do you ensure code quality?', difficulty: 'Medium', tip: 'Mention testing, code reviews, linting', sample_answer: 'I write unit tests and follow coding standards...' },
        { question: 'Explain your database experience.', difficulty: 'Medium', tip: 'Mention specific databases you used', sample_answer: 'I have worked with PostgreSQL via Supabase...' },
        { question: 'How do you handle performance optimization?', difficulty: 'Hard', tip: 'Give specific examples with metrics', sample_answer: 'I optimized database queries and reduced load time by 40%...' },
        { question: `Describe your experience with ${role} specifically.`, difficulty: 'Medium', tip: 'Reference your resume projects directly', sample_answer: 'In my ResumeAI project I built...' },
      ],
      behavioral: [
        { question: 'Tell me about yourself.', difficulty: 'Easy', tip: 'Keep it professional, 2 minutes max', sample_answer: 'I am a BCA student with passion for full stack development...' },
        { question: 'Why do you want to work for our company?', difficulty: 'Easy', tip: 'Research the company before interview', sample_answer: 'I admire your innovation and would love to contribute...' },
        { question: 'Describe a time you worked in a team.', difficulty: 'Medium', tip: 'Use STAR method', sample_answer: 'In my college project team of 3, I led the backend development...' },
        { question: 'Tell me about a failure and what you learned.', difficulty: 'Medium', tip: 'Show growth mindset', sample_answer: 'I once missed a deadline because I underestimated complexity...' },
        { question: 'How do you handle pressure and tight deadlines?', difficulty: 'Medium', tip: 'Give specific examples', sample_answer: 'I prioritize tasks and communicate proactively...' },
        { question: 'Where do you see yourself in 5 years?', difficulty: 'Easy', tip: 'Show ambition aligned with company', sample_answer: 'I see myself as a senior full stack developer...' },
        { question: 'What is your greatest strength?', difficulty: 'Easy', tip: 'Choose strength relevant to the role', sample_answer: 'My greatest strength is problem solving and learning quickly...' },
        { question: 'What is your greatest weakness?', difficulty: 'Medium', tip: 'Show self awareness and improvement', sample_answer: 'I used to struggle with time management but now I use task lists...' },
        { question: 'How do you handle conflicts with teammates?', difficulty: 'Medium', tip: 'Show communication and empathy', sample_answer: 'I address conflicts early with open honest conversation...' },
        { question: 'Why should we hire you?', difficulty: 'Hard', tip: 'Connect your skills to their needs', sample_answer: 'I bring full stack skills, real project experience and quick learning...' },
      ],
      hr: [
        { question: 'What are your salary expectations?', difficulty: 'Medium', tip: 'Research market rates before interview', sample_answer: 'Based on my skills and market research, I expect 4-6 LPA...' },
        { question: 'Are you open to relocating?', difficulty: 'Easy', tip: 'Be honest about your preferences', sample_answer: 'Yes I am open to relocating for the right opportunity...' },
        { question: 'What is your notice period?', difficulty: 'Easy', tip: 'Be clear and honest', sample_answer: 'I am a fresher so I can join immediately...' },
        { question: 'Do you have any questions for us?', difficulty: 'Easy', tip: 'Always have 2-3 questions ready!', sample_answer: 'Yes! What does the typical career path look like here?' },
        { question: 'How did you hear about this position?', difficulty: 'Easy', tip: 'Mention specific source', sample_answer: 'I found this on ResumeAI job board and was excited by the role...' },
        { question: 'What motivates you?', difficulty: 'Easy', tip: 'Connect to the role and company', sample_answer: 'I am motivated by solving real problems with technology...' },
        { question: 'Are you interviewing at other companies?', difficulty: 'Medium', tip: 'Be honest but show interest here', sample_answer: 'Yes I am exploring opportunities but this role excites me most...' },
        { question: 'What kind of work environment do you prefer?', difficulty: 'Easy', tip: 'Research company culture first', sample_answer: 'I enjoy collaborative environments where I can learn and grow...' },
        { question: 'How do you prioritize multiple tasks?', difficulty: 'Medium', tip: 'Mention specific tools or methods', sample_answer: 'I use task lists and prioritize by urgency and impact...' },
        { question: 'What are your hobbies outside work?', difficulty: 'Easy', tip: 'Show personality but keep professional', sample_answer: 'I enjoy building side projects and learning new technologies...' },
      ],
      project: [
        { question: 'Tell me about your ResumeAI project.', difficulty: 'Medium', tip: 'Explain tech stack and challenges clearly', sample_answer: 'ResumeAI is a full stack SaaS platform built with React, Node.js, Python FastAPI and Claude AI...' },
        { question: 'What was the most challenging part of your projects?', difficulty: 'Hard', tip: 'Be specific and show problem solving', sample_answer: 'Integrating Claude AI API and handling PDF text extraction was challenging...' },
        { question: 'How did you decide on your tech stack?', difficulty: 'Medium', tip: 'Show decision making skills', sample_answer: 'I chose React for its component reusability and Node.js for JavaScript consistency...' },
        { question: 'How did you handle authentication?', difficulty: 'Medium', tip: 'Explain JWT and security measures', sample_answer: 'I implemented JWT based authentication with 3 role system...' },
        { question: 'What would you improve if you had more time?', difficulty: 'Medium', tip: 'Show growth mindset and vision', sample_answer: 'I would add real-time notifications and mobile app...' },
        { question: 'How did you test your projects?', difficulty: 'Medium', tip: 'Mention testing approaches', sample_answer: 'I manually tested all features and used Postman for API testing...' },
        { question: 'Explain the architecture of ResumeAI.', difficulty: 'Hard', tip: 'Explain microservices clearly', sample_answer: 'ResumeAI uses microservices with 4 Docker containers...' },
        { question: 'How did you handle errors in your project?', difficulty: 'Medium', tip: 'Show error handling knowledge', sample_answer: 'I implemented try-catch blocks and error middleware in Express...' },
        { question: 'Did you face any performance issues?', difficulty: 'Hard', tip: 'Show optimization knowledge', sample_answer: 'Claude AI analysis took time so I added progress indicators...' },
        { question: 'How did you deploy your project?', difficulty: 'Medium', tip: 'Mention Docker and Railway', sample_answer: 'I deployed using Docker containers orchestrated with docker-compose on Railway...' },
      ]
    }

    setQuestions(allQuestions[cat] || allQuestions.technical)
  }

  const difficultyColor = {
    Easy: 'bg-green-500/10 text-green-400 border-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            🎤 Interview Preparation
          </h1>
          <p className="text-dark-text text-lg">
            AI-generated questions based on YOUR resume and target role
          </p>
        </div>

        {/* Setup Card */}
        <div className="glass rounded-2xl p-6 mb-8">

          {/* Select Resume */}
          {resumes.length > 0 && (
            <div className="mb-4">
              <label className="text-dark-text text-sm mb-2 block">📄 Select Your Resume</label>
              <select
                value={selectedResume?.id || ''}
                onChange={e => setSelectedResume(resumes.find(r => r.id === parseInt(e.target.value)))}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.filename} {r.overall_score ? `(Score: ${r.overall_score}%)` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {resumes.length === 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
              <p className="text-yellow-400 text-sm">
                ⚠️ Upload your resume first for personalized questions!
                <a href="/upload" className="underline ml-1">Upload now →</a>
              </p>
            </div>
          )}

          {/* Job Role */}
          <div className="mb-4">
            <label className="text-dark-text text-sm mb-2 block">💼 Target Job Role *</label>
            <input
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, React Developer, Python Developer"
              className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-white placeholder-dark-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="text-dark-text text-sm mb-3 block">📚 Question Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    category === cat.id
                      ? 'border-primary bg-primary/10'
                      : 'border-dark-border glass'
                  }`}
                >
                  <p className="text-white text-sm font-medium">{cat.label}</p>
                  <p className="text-dark-text text-xs">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="w-full gradient-btn text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? '🤖 AI is generating questions...' : '🎯 Generate Interview Questions'}
          </button>
        </div>

        {/* Questions */}
        {questions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-xl">
                {questions.length} Questions for {jobRole}
              </h2>
              <button
                onClick={() => {
                  const text = questions.map((q, i) =>
                    `Q${i+1}: ${q.question}\nTip: ${q.tip}\nSample: ${q.sample_answer}\n`
                  ).join('\n---\n')
                  navigator.clipboard.writeText(text)
                  alert('All questions copied!')
                }}
                className="glass text-dark-text text-sm px-4 py-2 rounded-xl hover:text-white transition-colors"
              >
                Copy All
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div
                    className="p-5 cursor-pointer flex items-start justify-between gap-4"
                    onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  >
                    <div className="flex gap-3 flex-1">
                      <span className="gradient-text font-bold text-lg flex-shrink-0">Q{i+1}</span>
                      <p className="text-white font-medium leading-relaxed">{q.question}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColor[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-dark-text">{expandedQ === i ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedQ === i && (
                    <div className="border-t border-dark-border p-5 space-y-4">
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-blue-400 text-xs font-medium mb-1">💡 HOW TO ANSWER</p>
                        <p className="text-white text-sm">{q.tip}</p>
                      </div>
                      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <p className="text-green-400 text-xs font-medium mb-1">✅ SAMPLE ANSWER</p>
                        <p className="text-dark-text text-sm">{q.sample_answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="glass rounded-2xl p-6 mt-6">
              <h3 className="text-white font-semibold mb-4">🏆 Interview Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '⏰', tip: 'Arrive 10 minutes early or join video call 5 mins before' },
                  { icon: '👔', tip: 'Dress professionally even for online interviews' },
                  { icon: '📋', tip: 'Keep your resume in front of you during interview' },
                  { icon: '🔇', tip: 'Find a quiet place with good internet for online interviews' },
                  { icon: '❓', tip: 'Always prepare 3-4 questions to ask the interviewer' },
                  { icon: '💪', tip: 'Be confident — you built ResumeAI, that is impressive!' },
                ].map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xl">{t.icon}</span>
                    <p className="text-dark-text text-sm">{t.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}