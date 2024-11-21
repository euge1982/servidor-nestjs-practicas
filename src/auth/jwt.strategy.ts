import { Injectable, UnauthorizedException } from "@nestjs/common";
import { envs } from "src/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UserService } from "../user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.JWT_SECRET,
        });
    }

    /**
     * Este metodo se encarga de validar el token
     * @param payload 
     * @returns 
     */
    async validate(payload: JwtPayload) {
        //Buscamos el usuario por email del payload
        const user = await this.userService.findByEmail(payload.email);

        //Si el usuario no existe, devolvemos una excepcion
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        //Devolvemos el usuario
        return user;
    }
}