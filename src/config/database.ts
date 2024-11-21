// Configuración de la base de datos

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;   // Variable para almacenar la instancia

try {
    prisma = new PrismaClient();
} 
catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Termina el proceso si no se puede conectar
}

export { prisma };