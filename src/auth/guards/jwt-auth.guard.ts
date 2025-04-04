// Archivo de guard de autenticación

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // Metodo para validar si un usuario puede acceder a una ruta o no
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Validar si la ruta es pública
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    
    if (isPublic) return true;   // Permitir acceso sin autenticación

    // Si no es pública, aplicar la validación de JWT
    return super.canActivate(context);
  }

  // Metodo para manejar los errores y la información de autenticación
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Manejo explícito de errores y de información de autenticación faltante
    if (err || !user) {
      throw new UnauthorizedException(info?.message || 'Invalid token or no token provided');
    }

    return user;
  }
}