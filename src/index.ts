import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'                         
import { fileURLToPath } from 'url'              
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const app = express()
const PORT = 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
  origin: ['https://ngaliholdings.vercel.app', 'http://localhost:5173']
}))
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, '../public/images')))

app.use(express.json())

// --- Subsidiaries ---
app.get('/api/subsidiaries', async (req, res) => {
  const subsidiaries = await prisma.subsidiary.findMany()
  res.json(subsidiaries)
})

app.get('/api/subsidiaries/:id', async (req, res) => {
  const subsidiary = await prisma.subsidiary.findUnique({
    where: { id: req.params.id },
  })
  if (!subsidiary) {
    return res.status(404).json({ error: 'Subsidiary not found' })
  }
  res.json(subsidiary)
})

// --- Blog posts ---
app.get('/api/blogs', async (req, res) => {
  const posts = await prisma.blogPost.findMany()
  res.json(posts)
})

app.get('/api/blogs/:id', async (req, res) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: req.params.id },
  })
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }
  res.json(post)
})

// --- Job openings ---
app.get('/api/jobs', async (req, res) => {
  const jobs = await prisma.jobOpening.findMany()
  res.json(jobs)
})

app.get('/api/jobs/:id', async (req, res) => {
  const job = await prisma.jobOpening.findUnique({
    where: { id: req.params.id },
  })
  if (!job) {
    return res.status(404).json({ error: 'Job not found' })
  }
  res.json(job)
})
app.get('/api/sectors', async (req, res) => {
  const sectors = await prisma.sector.findMany()
  res.json(sectors)
})
app.get('/api/team', async (req, res) => {
  const team = await prisma.teamMember.findMany()
  res.json(team)
})

// --- Contact form submissions ---
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body
  const submission = await prisma.contactMessage.create({
    data: { name, email, message },
  })
  res.status(201).json(submission)
})

// --- Job applications ---
app.post('/api/applications', async (req, res) => {
  const { jobId, name, email, coverLetter } = req.body
  const application = await prisma.jobApplication.create({
    data: { jobId, name, email, coverLetter },
  })
  res.status(201).json(application)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})