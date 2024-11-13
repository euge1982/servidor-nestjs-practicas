import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';


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

  await app.listen(envs.PORT ?? 3000);
  console.log(`Server running on port ${envs.PORT}`);
}
bootstrap();
