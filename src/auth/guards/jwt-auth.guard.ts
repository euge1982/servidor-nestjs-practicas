import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new Error('Unauthorized');  // Aquí puedes lanzar un error personalizado si no hay un usuario válido
    }

    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}