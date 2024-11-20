import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/user/dto/login-user.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful', type: String })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() dto: LoginUserDto) { 
        const user = this.authService.login(dto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials(email o password)');
        }
        return user;
    }

}
