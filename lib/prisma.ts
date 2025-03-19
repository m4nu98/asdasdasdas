import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

// Test de conexión
prisma.$connect()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida')
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos:', error)
  }) 