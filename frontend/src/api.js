import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
})

const AI = axios.create({
  baseURL: 'http://localhost:8000',
})

// Add token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── AUTH ───
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// ─── RESUME ───
export const uploadResume = (formData) => API.post('/resume/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const getMyResumes = () => API.get('/resume/my-resumes')
export const getAnalysis = (id) => API.get(`/resume/analysis/${id}`)

// ─── JOBS ───
export const getJobs = () => API.get('/jobs')
export const getJob = (id) => API.get(`/jobs/${id}`)
export const applyJob = (id, data) => API.post(`/jobs/${id}/apply`, data)
export const getMyApplications = () => API.get('/jobs/my/applications')

// ─── ADMIN ───
export const getStats = () => API.get('/admin/stats')
export const getAllUsers = () => API.get('/admin/users')
export const getAllResumes = () => API.get('/admin/resumes')
export const getAllCompanies = () => API.get('/admin/companies')
export const approveCompany = (id) => API.put(`/admin/companies/${id}/approve`)
export const suspendUser = (id) => API.put(`/admin/users/${id}/suspend`)
export const getApplicants = () => API.get('/admin/applicants')
export const updateAppStatus = (id, data) => API.put(`/admin/applications/${id}/status`, data)
export const postJob = (data) => API.post('/admin/jobs', data)

// ─── AI DIRECT ───
export const analyzeResume = (data) => AI.post('/analyze', data)