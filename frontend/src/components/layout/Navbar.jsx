import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold text-lg">ResumeAI</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-dark-text hover:text-white text-sm transition-colors">
            Home
          </Link>
         
          <Link to="/jobs" className="text-dark-text hover:text-white text-sm transition-colors">
            Jobs
          </Link>
          <Link to="/about" className="text-dark-text hover:text-white text-sm transition-colors">
            About
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-dark-text hover:text-white text-sm transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="gradient-btn text-white text-sm px-5 py-2 rounded-lg font-medium"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-dark-border px-6 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-dark-text text-sm hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
         \
          <Link
            to="/jobs"
            className="text-dark-text text-sm hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Jobs
          </Link>
          <Link
            to="/about"
            className="text-dark-text text-sm hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/login"
            className="text-dark-text text-sm hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="gradient-btn text-white text-sm px-4 py-2 rounded-lg text-center"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  )
}