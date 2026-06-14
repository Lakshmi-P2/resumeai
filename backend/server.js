const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/resume', require('./routes/resume'))
app.use('/api/jobs', require('./routes/jobs'))
app.use('/api/admin', require('./routes/admin'))

app.get('/', (req, res) => {
  res.json({
    message: '✅ ResumeAI Backend is running!',
    version: '1.0.0',
    developer: 'Lakshmi P'
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})