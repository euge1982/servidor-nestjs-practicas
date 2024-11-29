// Archivo principal

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //Habilitar CORS
  app.enableCors();
  //Establecer prefijo global para las rutas
  app.setGlobalPrefix('api/v1');
  //Usar ValidationsPipes global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  //Solo permitir los campos que esten en el DTO
      forbidNonWhitelisted: true,   //No permitir campos que no esten en el DTO
    })
  );
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  // Configuración de la carpeta de archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'),{
    prefix: '/uploads',
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de gestión de usuarios y productos')
    .setDescription('Documentación de la API para gestión de usuarios y productos')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Configura la autenticación JWT
    ) // Agrega autenticación JWT en la documentación
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(envs.PORT ?? 3000);
  console.log(`Server running on port ${envs.PORT}`);
}

bootstrap();