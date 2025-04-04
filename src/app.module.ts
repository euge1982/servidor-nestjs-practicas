// Archivo de modulo principal de la app

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductoModule } from './producto/producto.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [AuthModule, UserModule, ProductoModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}