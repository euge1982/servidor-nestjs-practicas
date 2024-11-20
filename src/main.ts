import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Inventario')
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
