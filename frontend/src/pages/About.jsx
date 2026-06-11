import Navbar from '../components/layout/Navbar'
import { Link } from 'react-router-dom'

const team = [
  { name: 'Lakshmi P', role: 'Founder & Full Stack Developer', emoji: '👩‍💻' },
]

const values = [
  {
    icon: '🎯',
    title: 'Mission',
    desc: 'Make job hunting easier for every student and professional in India by using AI to level the playing field.'
  },
  {
    icon: '🔒',
    title: 'Privacy',
    desc: 'Your resume data is yours. We never share it with third parties or use it to train AI models.'
  },
  {
    icon: '🚀',
    title: 'Innovation',
    desc: 'We use the latest AI technology — Claude by Anthropic — to give you the most accurate resume feedback.'
  },
  {
    icon: '❤️',
    title: 'Impact',
    desc: 'Every feature we build is focused on one thing — helping you get hired faster.'
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">

        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-white mb-6">
            Built to get you <span className="gradient-text">hired</span>
          </h1>
          <p className="text-dark-text text-xl max-w-2xl mx-auto leading-relaxed">
            ResumeAI was built by a student, for students and job seekers.
            We know how hard job hunting is — so we built AI tools to make it easier.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: '50K+', label: 'Resumes analyzed' },
            { value: '89%', label: 'Interview rate boost' },
            { value: '500+', label: 'Companies hiring' },
            { value: '4.9★', label: 'User rating' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-dark-text text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            What we stand for
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="glass rounded-2xl p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-dark-text text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            The team
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {team.map(t => (
              <div key={t.name} className="glass rounded-2xl p-8 text-center w-64">
                <div className="text-5xl mb-4">{t.emoji}</div>
                <h3 className="text-white font-semibold mb-1">{t.name}</h3>
                <p className="text-dark-text text-sm">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to try it?
          </h2>
          <p className="text-dark-text mb-8">
            Join thousands of job seekers who already use ResumeAI
          </p>
          <Link
            to="/register"
            className="gradient-btn text-white px-10 py-4 rounded-xl font-semibold text-lg inline-block"
          >
            Get started free →
          </Link>
        </div>

      </div>
    </div>
  )
}