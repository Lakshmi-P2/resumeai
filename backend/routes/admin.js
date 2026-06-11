const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin' && req.user.role !== 'company') {
    return res.status(403).json({ message: 'Access denied' })
  }
  next()
}

const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super admin access required' })
  }
  next()
}

// ─── SUPER ADMIN ROUTES ───

// Get all users
router.get('/users', auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, last_active, is_suspended FROM users ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Suspend user
router.put('/users/:id/suspend', auth, isSuperAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_suspended = true WHERE id = $1', [req.params.id])
    await pool.query(
      'INSERT INTO audit_logs (admin_id, action, target_type, target_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'suspend_user', 'user', req.params.id]
    )
    res.json({ message: 'User suspended' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all resumes
router.get('/resumes', auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email, a.overall_score, a.ats_score 
       FROM resumes r 
       JOIN users u ON r.user_id = u.id 
       LEFT JOIN analyses a ON r.id = a.resume_id 
       ORDER BY r.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all companies
router.get('/companies', auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Approve company
router.put('/companies/:id/approve', auth, isSuperAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE companies SET status = $1 WHERE id = $2', ['active', req.params.id])
    await pool.query(
      'INSERT INTO audit_logs (admin_id, action, target_type, target_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'approve_company', 'company', req.params.id]
    )
    res.json({ message: 'Company approved!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Platform stats
router.get('/stats', auth, isSuperAdmin, async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users')
    const resumes = await pool.query('SELECT COUNT(*) FROM resumes')
    const jobs = await pool.query('SELECT COUNT(*) FROM jobs')
    const applications = await pool.query('SELECT COUNT(*) FROM applications')
    const companies = await pool.query('SELECT COUNT(*) FROM companies')

    res.json({
      total_users: users.rows[0].count,
      total_resumes: resumes.rows[0].count,
      total_jobs: jobs.rows[0].count,
      total_applications: applications.rows[0].count,
      total_companies: companies.rows[0].count,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── COMPANY ADMIN ROUTES ───

// Post a job
router.post('/jobs', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, requirements, skills_required, salary_min, salary_max, location, job_type, deadline } = req.body

    const company = await pool.query('SELECT * FROM companies WHERE admin_user_id = $1', [req.user.id])
    if (company.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const result = await pool.query(
      `INSERT INTO jobs (company_id, title, description, requirements, skills_required, salary_min, salary_max, location, job_type, deadline) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [company.rows[0].id, title, description, requirements, JSON.stringify(skills_required), salary_min, salary_max, location, job_type, deadline]
    )

    res.status(201).json({ message: 'Job posted!', job: result.rows[0] })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get applicants for company jobs
router.get('/applicants', auth, isAdmin, async (req, res) => {
  try {
    const company = await pool.query('SELECT * FROM companies WHERE admin_user_id = $1', [req.user.id])
    if (company.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' })
    }

    const result = await pool.query(
      `SELECT a.*, u.name as applicant_name, u.email, j.title as job_title, 
              an.overall_score, an.ats_score
       FROM applications a
       JOIN users u ON a.user_id = u.id
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN analyses an ON a.resume_id = an.resume_id
       WHERE j.company_id = $1
       ORDER BY a.created_at DESC`,
      [company.rows[0].id]
    )

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update application status
router.put('/applications/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status, note } = req.body

    const current = await pool.query('SELECT * FROM applications WHERE id = $1', [req.params.id])
    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' })
    }

    await pool.query('UPDATE applications SET status = $1 WHERE id = $2', [status, req.params.id])

    await pool.query(
      'INSERT INTO application_history (application_id, old_status, new_status, note, changed_by) VALUES ($1, $2, $3, $4, $5)',
      [req.params.id, current.rows[0].status, status, note, req.user.id]
    )

    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [current.rows[0].user_id, 'status_update', `Your application status has been updated to: ${status}`]
    )

    res.json({ message: 'Status updated!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router