// Archivo de servicio de autenticación

import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}


  /**
   * Este servicio realiza el login de cualquier usuario
   * 
   * @param user que es del tipo CreateUserDto
   * @returns el token
   */
  async login(user: CreateUserDto) {
    try {
      // Llamamos al servicio para obtener el usuario por email
      const userRecord = await this.userService.findByEmail(user.email);

      // Si el usuario no existe o la contraseña no coincide, devolvemos una excepción
      if (!userRecord || !(await this.userService.validatePassword(user.password, userRecord.password))) {
        throw new UnauthorizedException('Credenciales Invalidas (email o password)');
      }

      // Construimos el payload
      const payload = { 
        sub: userRecord.id, 
        email: user.email, 
        role: userRecord.role 
      };

      // Devolvemos el token
      return { access_token: this.jwtService.sign(payload) };
    } 
    catch (error) {
      // Capturamos errores inesperados
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during login');
    }
  }


  /**
   * Este servicio se encarga de crear un usuario SUPER
   * @param dto que es del tipo CreateUserDto
   * @returns el registro del usuario
   */
  async registerSuper(dto: CreateUserDto) {
    try {
      // Buscamos el usuario por email
      const user = await this.userService.findByEmail(dto.email);

      // Si el usuario ya existe, devolvemos una excepción
      if (user) {
        throw new ConflictException('El email ya existe');
      }

      // Sino, creamos el usuario
      return await this.userService.registerSuper(dto);   // La contraseña ya se cifra en userService
    } 
    catch (error) {
      // Capturamos errores inesperados
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrio un error durante el registro de usuario');
    }
  }
}