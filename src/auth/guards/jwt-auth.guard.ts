//Archivo para validar el token

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  //Metodo para validar el token
  handleRequest(err, user, info) {

    //Si hay un error o no hay un usuario
    if (err) {
      throw err || new Error('Unauthorized'); 
    }
    //Si el usuario no existe
    if (!user) {
      throw new Error('User not found');
    }
    
    //Devolvemos el usuario
    return user;
  }
}