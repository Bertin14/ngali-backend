import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { requireAuth } from './middleware/auth.js'
import { upload, uploadToCloudinary } from './upload.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const app = express()
const PORT = 3001

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper to safely extract a string :id param (avoids "possibly undefined" TS errors)
function getId(req: express.Request): string {
  const id = req.params.id
  if (typeof id !== 'string') {
    throw new Error('Missing id parameter')
  }
  return id
}

const allowedOrigins: string[] = [
  'https://ngaliholdings.vercel.app',
  'http://localhost:5173'
]

app.use(cors({
  origin: allowedOrigins
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
    where: { id: getId(req) },
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
    where: { id: getId(req) },
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
    where: { id: getId(req) },
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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already in use
 */
// Register a new admin user
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(400).json({ error: 'Email already in use' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  })

  res.status(201).json({ id: user.id, email: user.email, name: user.name })
})

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid email or password
 */

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '24h' }
  )

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

app.delete('/api/subsidiaries/:id', requireAuth, async (req, res) => {
  await prisma.subsidiary.delete({ where: { id: getId(req) } })
  res.json({ success: true })
})

// Create subsidiary
app.post('/api/subsidiaries', requireAuth, async (req, res) => {
  const { id, name, description, image } = req.body
  const subsidiary = await prisma.subsidiary.create({
    data: { id, name, description, image },
  })
  res.status(201).json(subsidiary)
})

// Update subsidiary
app.put('/api/subsidiaries/:id', requireAuth, async (req, res) => {
  const id = String(req.params['id'])
  const { name, description, image } = req.body
  const subsidiary = await prisma.subsidiary.update({
    where: { id },
    data: { name, description, image },
  })
  res.json(subsidiary)
})

// Delete subsidiary (already exists, just confirming)
app.delete('/api/subsidiaries/:id', requireAuth, async (req, res) => {
  const id = String(req.params['id'])
  await prisma.subsidiary.delete({ where: { id } })
  res.json({ success: true })
})

// Create blog post
app.post('/api/blogs', requireAuth, async (req, res) => {
  const { id, title, date, category, excerpt, content, image } = req.body
  const post = await prisma.blogPost.create({
    data: { id, title, date, category, excerpt, content, image },
  })
  res.status(201).json(post)
})

// Update blog post
app.put('/api/blogs/:id', requireAuth, async (req, res) => {
  const id = String(req.params['id'])
  const { title, date, category, excerpt, content, image } = req.body
  const post = await prisma.blogPost.update({
    where: { id },
    data: { title, date, category, excerpt, content, image },
  })
  res.json(post)
})

// Delete blog post
app.delete('/api/blogs/:id', requireAuth, async (req, res) => {
  const id = String(req.params['id'])
  await prisma.blogPost.delete({ where: { id } })
  res.json({ success: true })
})

// Create job opening
app.post('/api/jobs', requireAuth, async (req, res) => {
  const { id, title, department, location, type, description, deadline } = req.body
  const job = await prisma.jobOpening.create({
    data: { id, title, department, location, type, description, deadline },
  })
  res.status(201).json(job)
})

// Update job opening
app.put('/api/jobs/:id', requireAuth, async (req, res) => {
  const id = String(req.params['id'])
  const { title, department, location, type, description, deadline } = req.body
  const job = await prisma.jobOpening.update({
    where: { id },
    data: { title, department, location, type, description, deadline },
  })
  res.json(job)
})

// Delete job opening
app.delete('/api/jobs/:id', requireAuth, async (req, res) => {
  const id = String(req.params['id'])
  await prisma.jobOpening.delete({ where: { id } })
  res.json({ success: true })
})

// Get all contact messages (admin only)
app.get('/api/admin/contacts', requireAuth, async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  })
  res.json(messages)
})

// Delete contact message
app.delete('/api/admin/contacts/:id', requireAuth, async (req, res) => {
  const id = parseInt(String(req.params['id']))
  await prisma.contactMessage.delete({ where: { id } })
  res.json({ success: true })
})

// Get all job applications (admin only)
app.get('/api/admin/applications', requireAuth, async (req, res) => {
  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' }
  })
  res.json(applications)
})

// Delete job application
app.delete('/api/admin/applications/:id', requireAuth, async (req, res) => {
  const id = parseInt(String(req.params['id']))
  await prisma.jobApplication.delete({ where: { id } })
  res.json({ success: true })
})

// --- About content ---
app.get('/api/about', async (req, res) => {
  const content = await prisma.aboutContent.findFirst()
  res.json(content)
})

app.put('/api/about', requireAuth, async (req, res) => {
  const { background, vision, mission } = req.body
  const content = await prisma.aboutContent.upsert({
    where: { id: 1 },
    update: { background, vision, mission },
    create: { background, vision, mission },
  })
  res.json(content)
})

// --- Core values ---
app.get('/api/values', async (req, res) => {
  const values = await prisma.coreValue.findMany()
  res.json(values)
})

app.post('/api/values', requireAuth, async (req, res) => {
  const { title, text } = req.body
  const value = await prisma.coreValue.create({
    data: { title, text },
  })
  res.status(201).json(value)
})

app.put('/api/values/:id', requireAuth, async (req, res) => {
  const id = parseInt(String(req.params['id']))
  const { title, text } = req.body
  const value = await prisma.coreValue.update({
    where: { id },
    data: { title, text },
  })
  res.json(value)
})

app.delete('/api/values/:id', requireAuth, async (req, res) => {
  const id = parseInt(String(req.params['id']))
  await prisma.coreValue.delete({ where: { id } })
  res.json({ success: true })
})

// --- Team members ---
// Create team member
app.post('/api/team', requireAuth, async (req, res) => {
  const { name, role, image } = req.body
  const member = await prisma.teamMember.create({
    data: { name, role, image },
  })
  res.status(201).json(member)
})

// Update team member
app.put('/api/team/:id', requireAuth, async (req, res) => {
  const id = parseInt(String(req.params['id']))
  const { name, role, image } = req.body
  const member = await prisma.teamMember.update({
    where: { id },
    data: { name, role, image },
  })
  res.json(member)
})

app.delete('/api/team/:id', requireAuth, async (req, res) => {
  const id = parseInt(String(req.params['id']))
  await prisma.teamMember.delete({ where: { id } })
  res.json({ success: true })
})

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the uploaded image URL
 */
app.post('/api/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const folder = (req.body.folder as string) || 'general'
    const url = await uploadToCloudinary(req.file.buffer, folder)
    res.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: String(error) })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})