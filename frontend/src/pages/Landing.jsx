import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const stats = [
  { value: '50K+', label: 'Resumes analyzed' },
  { value: '89%', label: 'Interview rate boost' },
  { value: '3x', label: 'Faster job placement' },
  { value: '4.9★', label: 'User rating' },
]

const features = [
  { icon: '🎯', title: 'ATS Score Checker', desc: 'See if your resume passes Applicant Tracking Systems used by 98% of Fortune 500 companies.' },
  { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Claude AI reads your resume like a senior recruiter — finding every weakness and opportunity.' },
  { icon: '📊', title: 'Job Match Score', desc: 'Paste any job description and instantly see how well your resume matches it.' },
  { icon: '✍️', title: 'AI Rewriter', desc: 'Weak bullet points? AI rewrites them to be stronger, quantified, and more impactful.' },
  { icon: '💼', title: 'Job Board', desc: 'Apply to jobs directly. Track every application in one place with real-time status updates.' },
  { icon: '🎤', title: 'Interview Prep', desc: 'Get AI-generated interview questions based on your resume and target job.' },
]

const steps = [
  { step: '01', title: 'Upload your resume', desc: 'PDF or Word — we handle both' },
  { step: '02', title: 'AI analyzes it', desc: 'Deep analysis in under 20 seconds' },
  { step: '03', title: 'See your score', desc: 'Detailed breakdown with fixes' },
  { step: '04', title: 'Apply to jobs', desc: 'Track everything in one place' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-dark-text text-sm">AI-powered · Free to start · No credit card</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Get hired faster with{' '}
            <span className="gradient-text">AI resume</span>{' '}
            analysis
          </h1>
          <p className="text-dark-text text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and get an instant AI score, weakness analysis, ATS check,
            and rewrite suggestions in under 20 seconds.
          </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link to="/register" className="gradient-btn text-white px-8 py-4 rounded-xl font-semibold text-lg">
    Analyze my resume FREE →
  </Link>
  <Link to="/jobs" className="glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-colors">
    Browse jobs
  </Link>
  <Link to="/register-company" className="glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-colors border border-primary/30">
    🏢 Register Organization
  </Link>
</div>
        </div>
      </section>

      <section className="py-16 px-6 border-y border-dark-border">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-dark-text text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to land the job</h2>
            <p className="text-dark-text text-lg">Not just a score — a complete system to get you hired</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-dark-text text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-dark-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-dark-text text-lg">Four steps to your dream job</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 gradient-btn rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-sm">{s.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-dark-text text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-16">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get hired?</h2>
          <p className="text-dark-text text-lg mb-8">Join 50,000+ job seekers who improved their resume with ResumeAI</p>
          <Link to="/register" className="gradient-btn text-white px-10 py-4 rounded-xl font-semibold text-lg inline-block">
            Start for free — no credit card needed
          </Link>
        </div>
      </section>

      <footer className="border-t border-dark-border py-8 px-6 text-center">
        <p className="text-dark-text text-sm">© 2026 ResumeAI. All rights reserved.</p>
      </footer>
    </div>
  )
}