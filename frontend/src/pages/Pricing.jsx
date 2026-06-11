import Navbar from '../components/layout/Navbar'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    desc: 'Perfect to get started',
    color: 'border-dark-border',
    features: [
      '3 resume analyses per month',
      'Basic ATS score',
      'Keyword gap analysis',
      'Job board access',
    ],
    cta: 'Get started free',
    href: '/register',
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    desc: 'For serious job seekers',
    color: 'border-primary',
    badge: 'Most Popular',
    features: [
      'Unlimited resume analyses',
      'Full AI rewrite suggestions',
      'Cover letter generator',
      'Interview question generator',
      'JD match score',
      'PDF report download',
      'Resume history tracking',
    ],
    cta: 'Start Pro',
    href: '/register',
  },
  {
    name: 'Company',
    price: '₹4,999',
    period: '/month',
    desc: 'For recruiters and colleges',
    color: 'border-dark-border',
    features: [
      'Post unlimited jobs',
      'View all applicant resumes',
      'AI scores for every applicant',
      'Kanban pipeline management',
      'Candidate search and filter',
      'Analytics dashboard',
      'CSV export',
      'Team members access',
    ],
    cta: 'Contact us',
    href: '/register',
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-dark-text text-xl">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div key={plan.name} className={`glass rounded-2xl p-8 border ${plan.color} relative`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-btn text-white text-xs px-4 py-1 rounded-full font-medium">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-white font-bold text-xl mb-1">{plan.name}</h2>
                <p className="text-dark-text text-sm mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-dark-text mb-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-dark-text text-sm">
                    <span className="text-green-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${plan.badge ? 'gradient-btn text-white' : 'glass text-white hover:bg-white/5'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}