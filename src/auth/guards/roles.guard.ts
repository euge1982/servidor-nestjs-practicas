//Archivo para validar los roles

import { ForbiddenException, Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from "../jwt-payload.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //Metodo para validar si el endpoint es publico
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Permitir acceso
    }

    //Metodo para validar los roles
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
  
    //Obtiene el usuario del context
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    //Verifica si el usuario tiene los roles necesarios
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access Denied');
    }

    //Si el usuario tiene los roles necesarios
    return true;
  }
}