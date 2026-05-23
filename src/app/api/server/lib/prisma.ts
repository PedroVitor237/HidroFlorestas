import { PrismaClient } from '@/generated/prisma/index.js'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaNeon({ connectionString })

export const prisma = new PrismaClient({
  adapter,
})
