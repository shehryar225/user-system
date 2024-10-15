import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { userServices } from "src/modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private userservice: userServices) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // Use your secret from config
        });
        
    }

    async validate(payload:JwtPayload) {
        const user = await this.userservice.findById(payload.id); 
        if (!user) {
            throw new UnauthorizedException(); 
        }
        return user;
    }
}