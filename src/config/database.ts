/*import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();*/

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Error connecting to the database:', error);
  process.exit(1); // Termina el proceso si no se puede conectar
}

export { prisma };
