const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const auth = require('../middleware/auth')

// Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name as company_name, c.logo_url 
       FROM jobs j 
       JOIN companies c ON j.company_id = c.id 
       WHERE j.status = 'active' 
       ORDER BY j.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name as company_name, c.logo_url, c.description as company_desc
       FROM jobs j 
       JOIN companies c ON j.company_id = c.id 
       WHERE j.id = $1`,
      [req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Apply to job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { resume_id, cover_letter } = req.body

    // Check if already applied
    const exists = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
      [req.user.id, req.params.id]
    )
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Already applied to this job' })
    }

    const result = await pool.query(
      'INSERT INTO applications (user_id, job_id, resume_id, cover_letter) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, req.params.id, resume_id, cover_letter]
    )

    // Save to history
    await pool.query(
      'INSERT INTO application_history (application_id, old_status, new_status, changed_by) VALUES ($1, $2, $3, $4)',
      [result.rows[0].id, null, 'applied', req.user.id]
    )


    // After successful application insert:
await pool.query(
  'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
  [req.user.id, 'application', `Your application for ${req.params.id} has been submitted successfully! The company will review it soon.`]
)
    // Create notification
    await pool.query(
      'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)',
      [req.user.id, 'application', 'Your application has been submitted successfully!']
    )

    res.status(201).json({ message: 'Applied successfully!', application: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get my applications
router.get('/my/applications', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title as job_title, c.name as company_name 
       FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       JOIN companies c ON j.company_id = c.id 
       WHERE a.user_id = $1 
       ORDER BY a.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router