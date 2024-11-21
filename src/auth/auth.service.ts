//Archivo de servicios de autenticación

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    /**
     * 
     * Valida el usuario
     * @param email 
     * @param password 
     * @returns 
     
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }*/

    /**
     * 
     * Este servicio realiza el login de cualquier usuario
     * @param user que es del tipo CreateUserDto
     * @returns el token
     */
    async login(user: CreateUserDto) {
        //Llamamos al servicio para obtener el usuario por email
        const userRecord = await this.userService.findByEmail(user.email);

        //Si el usuario no existe o la contraseña no coincide, devolvemos una excepción
        if (!userRecord || !(await bcrypt.compare(user.password, userRecord.password))) {
            throw new UnauthorizedException('Invalid credentials(email o password)');
        }

        //Construimos el payload
        const payload = { 
            sub: userRecord.id, 
            email: user.email, 
            role: userRecord.role };
        
        //Devolvemos el token
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    /**
     * Este servicio se encarga de crear un usuario SUPER
     * @param dto que es del tipo CreateUserDto
     * @returns 
     */
    async registerSuper(dto: CreateUserDto) {
        //Buscamos el usuario por email
        const user = await this.userService.findByEmail(dto.email);

        //Si el usuario ya existe, devolvemos una excepcion
        if (user) {
            throw new UnauthorizedException('Email already exists');
        }
        
        //Sino, creamos el usuario
        return this.userService.registerSuper(dto);   //La contraseña ya se cifra en userService
    }
}
