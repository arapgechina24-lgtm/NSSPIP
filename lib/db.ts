import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
    if (process.env.NODE_ENV === 'production') {
        const url = process.env.DATABASE_URL
        const authToken = process.env.TURSO_AUTH_TOKEN
        if (url && authToken) {
            const adapter = new PrismaLibSql({ url, authToken })
            return new PrismaClient({ adapter })
        }
    }
    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
