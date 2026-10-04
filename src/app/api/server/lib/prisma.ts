import { PrismaClient } from '@/generated/prisma/index.js'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { localPostgresqlContext } from './local-postgresql-context'

neonConfig.webSocketConstructor = ws

const TEST_SCHEMA_PATTERN = /^imp006_test_[0-9a-f]{32}$/
const TEST_CONFIRMATION = 'HIDROFLORESTAS_AUTH_TEST'

/** Uses PostgreSQL startup options and Prisma's schema qualifier for every pool connection. */
export function createPrismaClient(connectionString: string, schema?: string) {
  if (process.env.ACCOUNTS_LOCAL_APP === '1') {
    const url = new URL(connectionString)
    if (schema || process.env.IMP006_LOCAL_POSTGRESQL || url.hostname !== '127.0.0.1' || url.port !== '55427' || url.pathname !== '/accounts_development' || url.searchParams.has('options')) {
      throw new Error('Accounts application PostgreSQL guard failed')
    }
    url.searchParams.set('options', '-cTimeZone=UTC')
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: url.toString() }, { schema: 'public' }) })
  }
  const local = process.env.IMP006_LOCAL_POSTGRESQL === '1'
  const regressionPublic = local && process.env.IMP006_LOCAL_REGRESSION_PUBLIC === '1'
  const selectedSchema = schema ?? (local && !regressionPublic ? 'imp006_unbound' : undefined)
  if (schema && !TEST_SCHEMA_PATTERN.test(schema)) throw new Error('Invalid IMP-006 test schema')
  let selectedConnection = connectionString
  if (selectedSchema) {
    const url = new URL(connectionString)
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || url.searchParams.has('options') || url.searchParams.has('schema')) {
      throw new Error('IMP-006 test connection cannot safely select a schema')
    }
    if (url.hostname.split('.')[0].endsWith('-pooler')) throw new Error('IMP-006 isolated schema requires an explicit direct endpoint')
    url.searchParams.set('options', `-csearch_path=${selectedSchema}${local ? ' -cTimeZone=UTC' : ''}`)
    selectedConnection = url.toString()
  }
  if (local) {
    const url = new URL(connectionString)
    const context = localPostgresqlContext()
    if (url.hostname !== '127.0.0.1' || url.port !== context.port || process.env.TEST_DATABASE_CONFIRMATION !== TEST_CONFIRMATION) {
      throw new Error('IMP-006 local PostgreSQL guard failed')
    }
    if (regressionPublic && url.pathname !== `/${context.testDatabase}`) {
      throw new Error('Owned local regression database guard failed')
    }
    if (!selectedSchema) {
      if (url.searchParams.has('options')) throw new Error('IMP-006 local PostgreSQL startup options must be selected by the harness')
      url.searchParams.set('options', '-cTimeZone=UTC')
      selectedConnection = url.toString()
    }
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: selectedConnection }, { schema: selectedSchema ?? 'public' }) })
  }
  const adapter = new PrismaNeon({ connectionString: selectedConnection }, schema ? { schema } : undefined)
  return new PrismaClient({ adapter })
}

function applicationConnection() {
  const schema = process.env.IMP006_TEST_SCHEMA
  if (!schema) return { connectionString: process.env.DATABASE_URL! }
  if (process.env.TEST_DATABASE_CONFIRMATION !== TEST_CONFIRMATION || !TEST_SCHEMA_PATTERN.test(schema)) {
    throw new Error('IMP-006 application test schema guard failed')
  }
  const variable = process.env.IMP006_DATABASE_VARIABLE
  if (variable !== 'TEST_DATABASE_URL' && variable !== 'DATABASE_URL') {
    throw new Error('IMP-006 application database variable must be selected explicitly')
  }
  const connectionString = process.env[variable]
  if (!connectionString) throw new Error('IMP-006 application test database is unavailable')
  return { connectionString, schema }
}

const selected = applicationConnection()
export const prisma = createPrismaClient(selected.connectionString, selected.schema)
