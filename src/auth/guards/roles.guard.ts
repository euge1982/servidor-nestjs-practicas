//Archivo para validar los roles

import { ForbiddenException, Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from "../jwt-payload.interface";

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  //Metodo para validar los roles
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    //Obtiene el token
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