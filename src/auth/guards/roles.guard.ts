// Archivo de guard de roles

import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "../jwt-payload.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      // Método para validar si el endpoint es público
      const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
      if (isPublic) {
        return true; // Permitir acceso
      }

      // Método para validar los roles
      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!requiredRoles) {
        return true; // Si no se requieren roles, permitir acceso
      }

      // Obtener el usuario del contexto
      const request = context.switchToHttp().getRequest();
      const user = request.user as JwtPayload;

      // Verificar que el usuario esté definido
      if (!user) {
        throw new UnauthorizedException('User is not authenticated');
      }

      // Verificar si el usuario tiene los roles necesarios
      const hasRole = requiredRoles.some((role) => role === user.role);
      if (!hasRole) {
        throw new ForbiddenException(`Access Denied: Required roles are ${requiredRoles.join(', ')}`);
      }

      // Si el usuario tiene los roles necesarios
      return true;
    } 
    catch (error) {
      // Manejar cualquier error inesperado
      throw error instanceof ForbiddenException || error instanceof UnauthorizedException
        ? error
        : new ForbiddenException('An error occurred during role validation');
    }
  }
}
