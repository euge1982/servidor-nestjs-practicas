// Archivo del modulo de prisma

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()   // Esto hace que este modulo sea global y se pueda usar en cualquier modulo sin tener que importarlo cada vez
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})

export class PrismaModule {}