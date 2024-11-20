import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';



@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: LoginUserDto) {
        const userRecord = await this.userService.findByEmail(user.email);

        if (!userRecord || !(await bcrypt.compare(user.password, userRecord.password))) {
            throw new UnauthorizedException('Invalid credentials(email o password)');
        }

        const payload = { 
            sub: userRecord.id, email: user.email, 
            role: userRecord.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(dto: CreateUserDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (user) {
            throw new UnauthorizedException('Email already exists');
        }
        
        return this.userService.create(dto);   //La contraseña ya se cifra en userService
    }
}
