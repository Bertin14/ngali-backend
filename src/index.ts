import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ngali Holdings API',
      version: '1.0.0',
      description: 'REST API for the Ngali Holdings website — subsidiaries, blog posts, job openings, sectors, team members, contact form submissions, and job applications.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local development server',
      },
      {
        url: 'https://ngali-backend-production.up.railway.app',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/index.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// --- Subsidiaries ---
/**
 * @swagger
 * /api/subsidiaries:
 *   get:
 *     summary: Get all subsidiaries
 *     tags: [Subsidiaries]
 *     responses:
 *       200:
 *         description: List of all subsidiaries
 */
app.get('/api/subsidiaries', async (req, res) => {
  const subsidiaries = await prisma.subsidiary.findMany()
  res.json(subsidiaries)
})

/**
 * @swagger
 * /api/subsidiaries/{id}:
 *   get:
 *     summary: Get a single subsidiary by ID
 *     tags: [Subsidiaries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subsidiary found
 *       404:
 *         description: Subsidiary not found
 */
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
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all blog posts
 */
app.get('/api/blogs', async (req, res) => {
  const posts = await prisma.blogPost.findMany()
  res.json(posts)
})

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a single blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post found
 *       404:
 *         description: Blog post not found
 */
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
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all job openings
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all job openings
 */
app.get('/api/jobs', async (req, res) => {
  const jobs = await prisma.jobOpening.findMany()
  res.json(jobs)
})

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a single job opening by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job opening found
 *       404:
 *         description: Job not found
 */
app.get('/api/jobs/:id', async (req, res) => {
  const job = await prisma.jobOpening.findUnique({
    where: { id: req.params.id },
  })
  if (!job) {
    return res.status(404).json({ error: 'Job not found' })
  }
  res.json(job)
})

// --- Sectors ---
/**
 * @swagger
 * /api/sectors:
 *   get:
 *     summary: Get all sectors
 *     tags: [Sectors]
 *     responses:
 *       200:
 *         description: List of all sectors
 */
app.get('/api/sectors', async (req, res) => {
  const sectors = await prisma.sector.findMany()
  res.json(sectors)
})

// --- Team ---
/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get all team members
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: List of all team members
 */
app.get('/api/team', async (req, res) => {
  const team = await prisma.teamMember.findMany()
  res.json(team)
})

// --- Contact form submissions ---
/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message saved successfully
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body
  const submission = await prisma.contactMessage.create({
    data: { name, email, message },
  })
  res.status(201).json(submission)
})

// --- Job applications ---
/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit a job application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId, name, email, coverLetter]
 *             properties:
 *               jobId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application saved successfully
 */
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