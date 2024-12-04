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
   * @param dto del tipo CreateUserDto
   * @returns el registro de un usuario SUPER
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user SUPER' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async registerSuper(@Body() dto: CreateUserDto) {
    try {
      // Llamamos al servicio
      return await this.authService.registerSuper(dto);
    } 
    catch (error) {
      // Manejo de errores específicos según el caso
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email already exists');
      }
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }


  /**
   * Desde este método se loguea un usuario, de cualquier rol
   * @param dto que es del tipo CreateUserDto
   * @returns una respuesta con el token
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful', type: String })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: CreateUserDto) {
    try {
      // Llamamos al servicio
      const user = await this.authService.login(dto);

      // Si el usuario no existe o las credenciales son inválidas, lanzamos una excepción
      if (!user) {
        throw new UnauthorizedException('Invalid credentials (email o password)');
      }

      // Devolvemos el token
      return user;
    } 
    catch (error) {
      // Manejo genérico de errores para login
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while logging in the user');
    }
  }
}