import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.subsidiary.createMany({
    data: [
      {
        id: "ngali-energy",
        name: "Ngali Energy",
        description: "Ngali Energy specializes in renewable energy, focusing on the operation and development of power plants. The company is active in East Africa and beyond.",
        image: "http://localhost:3001/images/energy-banner.png",
      },
      {
        id: "ngali-mining",
        name: "Ngali Mining",
        description: "The Ngali Mining Company is interested in exploration, mining, processing and trading of minerals to benefit the Rwandan people, aiming to be a leader in production and transformation of natural resources through advanced technology.",
        image: "http://localhost:3001/images/ngali mining.png",
      },
      {
        id: "mediheal",
        name: "MEDIHEAL",
        description: "Mediheal Diagnostic and Fertility Center, based in Kigali, is a partnership between Ngali Holdings and the Mediheal Group of Hospitals in Kenya, providing world-class health care services in Rwanda.",
        image: "http://localhost:3001/images/mediheal.png",
      },
      {
        id: "locus-dynamics",
        name: "Locus Dynamics",
        description: "Locus Dynamics is a systems engineering and integration company with a focus on Aerospace & Robotics, Information Technology, and Homeland Security.",
        image: "http://localhost:3001/images/Locus Dynamics.png",
      },
      {
        id: "luna-smelter",
        name: "LuNa Smelter",
        description: "LuNa Smelter introduces eco-friendly business practices, combining cutting-edge ideas with abundant resource potential while minimizing harm to society and nature.",
        image: "http://localhost:3001/images/LuNa Smelter.png",
      },
      {
        id: "trinity-metals",
        name: "Trinity Metals",
        description: "Trinity Metals is a responsible producer of tin, tungsten and tantalum, employing eco-conscious and ethical practices across every area of its operations.",
        image: "http://localhost:3001/images/trinity.png",
      },
    ],
  })

  console.log('Subsidiaries seeded successfully')

  await prisma.blogPost.createMany({
    data: [
      {
        id: "kwibuka-31",
        title: "Ngali Holdings Staff Visit Gisozi Genocide Memorial in Honor of the 31st Commemoration",
        date: "June 12, 2025",
        category: "Community",
        excerpt: "As part of its annual remembrance activities, Ngali Holdings staff visited the Kigali Genocide Memorial in Gisozi to honor the 31st commemoration of the 1994 Genocide against the Tutsi.",
        content: "As part of its annual remembrance activities, Ngali Holdings staff visited the Kigali Genocide Memorial in Gisozi, where more than 250,000 victims of the 1994 Genocide against the Tutsi are laid to rest. This visit was held in line with the 31st commemoration, a time to honor the victims, reflect on the past, and renew our collective commitment to 'Never Again.' During this occasion, the CEO of Ngali Holdings delivered a heartfelt message to the team, emphasizing the importance of unity, reconciliation, and nation-building.",
        image: "http://localhost:3001/images/genocide_memorial.png",
      },
      {
        id: "vision-2020-partnership",
        title: "Supporting Rwanda's Vision 2020 Through Strategic Investment",
        date: "March 4, 2025",
        category: "Company news",
        excerpt: "Ngali Holdings continues to align its investment strategy with the Government of Rwanda's long-term development goals.",
        content: "Ngali Holdings continues to align its investment strategy with the Government of Rwanda's long-term development goals, with a particular focus on the ICT, transport, energy, health, and agricultural sectors. Through this alignment, the company aims to support job creation and economic growth in line with national priorities.",
        image: "http://localhost:3001/images/health.png",
      },
      {
        id: "subsidiary-spotlight-mining",
        title: "Subsidiary Spotlight: Advancing Mineral Exploration with Ngali Mining",
        date: "January 18, 2025",
        category: "Subsidiaries",
        excerpt: "A closer look at how Ngali Mining is positioning itself as a leader in responsible mineral exploration and processing.",
        content: "Ngali Mining is interested in exploration, mining, processing and trading of Rwanda's volcanic mineral deposits to tap into the market for the benefit of the Rwandan people. The subsidiary seeks to be a regional leader in exploration, production, and the transformation of natural resources by providing high-quality service through the use of advanced technology.",
        image: "http://localhost:3001/images/mining.png",
      },
    ],
  })

  console.log('Blog posts seeded successfully')

  await prisma.jobOpening.createMany({
    data: [
      {
        id: "finance-analyst",
        title: "Finance Analyst",
        department: "Finance",
        location: "Kigali, Rwanda",
        type: "Full-time",
        description: "We are looking for a detail-oriented Finance Analyst to support budgeting, forecasting, and financial reporting across our subsidiaries. The ideal candidate has a strong background in financial modeling and a passion for Africa's development sector.",
        deadline: "2026-07-15",
      },
      {
        id: "project-risk-manager",
        title: "Project Risk Manager",
        department: "Operations",
        location: "Kigali, Rwanda",
        type: "Full-time",
        description: "Ngali Holdings is seeking a Project Risk Manager to identify, assess, and mitigate risks across our portfolio of infrastructure and energy projects, ensuring smooth execution and long-term sustainability.",
        deadline: "2026-07-20",
      },
      {
        id: "communications-officer",
        title: "Communications Officer",
        department: "Marketing",
        location: "Kigali, Rwanda",
        type: "Full-time",
        description: "We're hiring a Communications Officer to manage our public relations, content creation, and brand messaging across our subsidiaries, helping tell the story of Ngali Holdings' impact across Africa.",
        deadline: "2026-07-31",
      },
    ],
  })

  console.log('Job openings seeded successfully')

  await prisma.sector.createMany({
    data: [
      {
        id: "agriculture",
        title: "Agriculture",
        text: "Improving commodity exchange and creating a financial platform to achieve food security and maximize farmer earnings through processing and mechanization.",
        image: "http://localhost:3001/images/agriculture.png",
      },
      {
        id: "mining",
        title: "Mining",
        text: "Exploring and trading Rwanda's volcanic mineral deposits through mining, processing, and exporting initiatives.",
        image: "http://localhost:3001/images/mining.png",
      },
      {
        id: "transport",
        title: "Transport",
        text: "Investing in aerospace, railways, canals, ports, and harbors to expand transportation infrastructure.",
        image: "http://localhost:3001/images/transport.png",
      },
      {
        id: "health",
        title: "Health",
        text: "Investing in healthcare and pharmaceuticals to improve health outcomes and access to medicine.",
        image: "http://localhost:3001/images/health.png",
      },
    ],
  })

  console.log('Sectors seeded successfully')

  await prisma.teamMember.createMany({
    data: [
      { name: "Benjamin MUSHABE", role: "Chief Executive Officer" },
      { name: "Emmanuel MUVARA", role: "Chief Operation Officer" },
      { name: "Dr. William NTAMBARA", role: "Chief Legal Officer and Company Secretary" },
      { name: "Nadine UWERA", role: "Group Head of Internal Audit & Risk Management" },
      { name: "John NDUNGUTSE", role: "Group Head, Corporate Services" },
    ],
  })

  console.log('Team members seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })