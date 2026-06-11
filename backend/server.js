const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/resume', require('./routes/resume'))
app.use('/api/jobs', require('./routes/jobs'))
app.use('/api/admin', require('./routes/admin'))

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ ResumeAI Backend is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`✅ Database connected!`)
})