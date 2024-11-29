// Configuración de la base de datos

import { PrismaClient } from '@prisma/client';

// Variable para almacenar la instancia de Prisma
let prisma: PrismaClient;   

try {
    prisma = new PrismaClient();   // Crea una nueva instancia de Prisma
} 
catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);   // Termina el proceso si no se puede conectar
}

export { prisma };   // Exporta la instancia de Prisma