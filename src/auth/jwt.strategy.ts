import { Injectable, UnauthorizedException } from "@nestjs/common";
import { envs } from "src/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
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

    async validate(payload: JwtPayload) {
        const user = await this.userService.findByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}