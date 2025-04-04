//Archivo de configuración de prisma

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Mejora los logs en la aplicacion
    private readonly logger = new Logger('PrismaService');

    // Metodo que se ejecuta cuando se inicia la aplicacion
    async onModuleInit() {
        // Desde la instancia de esta clase se conecta por unica vez a la base de datos
        await this.$connect();
        this.logger.log('✅Conectado a la base de datos');
    }

    // Metodo que se ejecuta cuando se cierra la aplicacion
    async onModuleDestroy() {
        // Desde la instancia de esta clase se desconecta de la base de datos
        await this.$disconnect();
        this.logger.log('❌Desconectado de la base de datos');
    }
}