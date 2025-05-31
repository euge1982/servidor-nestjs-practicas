// Archivo de controlador de autenticación

import { Controller, UnauthorizedException, Body, Post, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Desde este método se registra un nuevo usuario SUPER
   * es solo para ese rol
   * 
   * @param dto del tipo CreateUserDto
   * @returns el registro de un usuario SUPER
   */
  @Post('register')
  @ApiOperation({ summary: 'Regista un nuevo usuario SUPER' })
  @ApiResponse({ status: 201, description: 'Usuario Creado' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 409, description: 'El email ya existe' })
  async registerSuper(@Body() dto: CreateUserDto) {
    try {
      // Llamamos al servicio
      return await this.authService.registerSuper(dto);
    } 
    catch (error) {
      // Manejo de errores específicos según el caso
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El email ya existe');
      }
      throw new InternalServerErrorException('Ocurrio un error mientras se registraba el usuario');
    }
  }


  /**
   * Desde este método se loguea un usuario, de cualquier rol
   * 
   * @param dto que es del tipo CreateUserDto
   * @returns una respuesta con el token
   */
  @Post('login')
  @ApiOperation({ summary: 'Login del usuario y obtencion del JWT token' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: String })
  @ApiResponse({ status: 401, description: 'Credenciales invalidas' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() dto: CreateUserDto) {
    try {
      // Llamamos al servicio
      return await this.authService.login(dto);
      
    } 
    catch (error) {
      // Manejo genérico de errores para login
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Ocurrio un error durante el login del usuario');
    }
  }
}