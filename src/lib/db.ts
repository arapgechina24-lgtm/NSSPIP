import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
    // 1. Production (Turso / LibSQL Remote)
    if (process.env.NODE_ENV === 'production') {
        const url = process.env.DATABASE_URL
        const authToken = process.env.TURSO_AUTH_TOKEN

        if (url && authToken) {
            const libsql = createClient({
                url,
                authToken,
            })
            // @ts-expect-error - mismatch between @libsql/client ^0.17 and Prisma 6/7 adapter typings
            const adapter = new PrismaLibSql(libsql)
            return new PrismaClient({ adapter })
        }
    }
    // 2. Development (Local SQLite natively to avoid libsql caching bugs)
    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
