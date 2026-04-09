import { PrismaClient } from '@/generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import { PrismaNeon } from '@prisma/adapter-neon';
import { IS_PRODUCTION } from './env';

let adapter = null;

if (!IS_PRODUCTION) {
  adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  });
} else {
  adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  });
}


export const prisma = new PrismaClient({ adapter });

