import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? [] : ['query'], // toda vez que tiver uma consulta no banco de dados vai notificar
});
