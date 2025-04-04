// Archivo de estrategia de autenticación

import { Injectable, UnauthorizedException, InternalServerErrorException } from "@nestjs/common";
import { envs } from "src/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UserService } from "../user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.JWT_SECRET,
        });
    }

    /**
     * Este método se encarga de validar el token
     * @param payload El payload del JWT
     * @returns El usuario correspondiente
     */
    async validate(payload: JwtPayload) {
        // Buscamos el usuario por el id del payload
        const user = await this.userService.findById(payload.sub);

        // Si el usuario no existe, devolvemos una excepción
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        // Devolvemos el usuario
        return user;
    }
}