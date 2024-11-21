//Archivo para controlar la autenticación

import { Controller, UnauthorizedException, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Desde este método se registra un nuevo usuario SUPER
     * es solo para eso
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
        //Llamamos al servicio
        return this.authService.registerSuper(dto);
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
        //Llamamos al servicio
        const user = this.authService.login(dto);

        //Si el usuario no existe, devolvemos una excepción
        if (!user) {
            throw new UnauthorizedException('Invalid credentials(email o password)');
        }

        //Devolvemos el token
        return user;
    }

}