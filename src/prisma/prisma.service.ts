import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
//Se extiende la clase de prisma
export class PrismaService extends PrismaClient implements OnModuleInit {
    //Mejora los logs en la aplicacion
    private readonly logger = new Logger('PrismaService');

    async onModuleInit() {
        //Desde la instancia de esta clase se conecta por 
        //unica vez a la base de datos
        await this.$connect();
        this.logger.log('Conectado a la base de datos');
    }

    async onModuleDestroy() {
         await this.$disconnect();
        this.logger.log('Desconectado de la base de datos');
      }
}