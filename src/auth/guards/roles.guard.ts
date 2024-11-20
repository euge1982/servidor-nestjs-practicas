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

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access Denied');
    }

    return true;
  }
}