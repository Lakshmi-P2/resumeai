const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const pool = require('../config/db')
const auth = require('../middleware/auth')
const axios = require('axios')
require('dotenv').config()

// Setup file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.txt']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Only PDF, DOCX and TXT files allowed'))
  }
})

// UPLOAD AND ANALYZE
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const filePath = req.file.path
    const fileName = req.file.originalname
    const ext = path.extname(fileName).toLowerCase()

    console.log('File uploaded:', fileName, ext)

    let rawText = ''

    if (ext === '.pdf') {
      try {
        const pdfParse = require('pdf-parse')
        const dataBuffer = fs.readFileSync(filePath)
        const data = await pdfParse(dataBuffer)
        rawText = data.text
        console.log('PDF text extracted, length:', rawText.length)
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr)
        return res.status(400).json({ 
          message: 'Could not read PDF. Please try a different file.' 
        })
      }
    } else if (ext === '.docx' || ext === '.doc') {
      try {
        const mammoth = require('mammoth')
        const result = await mammoth.extractRawText({ path: filePath })
        rawText = result.value
        console.log('DOCX text extracted, length:', rawText.length)
      } catch (docErr) {
        console.error('DOCX parse error:', docErr)
        return res.status(400).json({ 
          message: 'Could not read DOCX file.' 
        })
      }
    } else if (ext === '.txt') {
      rawText = fs.readFileSync(filePath, 'utf8')
      console.log('TXT text extracted, length:', rawText.length)
    }

    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ 
        message: 'Could not extract text from file. Make sure your resume has readable text.' 
      })
    }

    // Save resume to database
    const resumeResult = await pool.query(
      'INSERT INTO resumes (user_id, filename, file_url, raw_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, fileName, filePath, rawText]
    )

    const resume = resumeResult.rows[0]
    console.log('Resume saved, id:', resume.id)

    // Send to AI service
    const jobDescription = req.body.job_description || ''
    console.log('Sending to AI service...')

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze`,
      {
        resume_text: rawText,
        job_description: jobDescription,
      },
      { timeout: 60000 }
    )

    const analysis = aiResponse.data
    console.log('AI analysis done, score:', analysis.overall_score)

    // Save analysis to database
    const analysisResult = await pool.query(
      `INSERT INTO analyses 
        (resume_id, user_id, overall_score, ats_score, section_scores,
         weaknesses, keyword_gaps, rewrite_suggestions, interview_questions, cover_letter) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        resume.id,
        req.user.id,
        analysis.overall_score,
        analysis.ats_score,
        JSON.stringify(analysis.section_scores),
        JSON.stringify(analysis.weaknesses),
        JSON.stringify(analysis.keyword_gaps),
        JSON.stringify(analysis.rewrite_suggestions),
        JSON.stringify(analysis.interview_questions),
        analysis.cover_letter,
      ]
    )

    console.log('Analysis saved, id:', analysisResult.rows[0].id)

    res.json({
      message: 'Resume analyzed successfully!',
      resume_id: resume.id,
      analysis_id: analysisResult.rows[0].id,
      analysis,
    })

  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ message: 'Server error: ' + err.message })
  }
})

// GET MY RESUMES
router.get('/my-resumes', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, a.overall_score, a.ats_score 
       FROM resumes r 
       LEFT JOIN analyses a ON r.id = a.resume_id 
       WHERE r.user_id = $1 
       ORDER BY r.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET SINGLE ANALYSIS
router.get('/analysis/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM analyses WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Analysis not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router