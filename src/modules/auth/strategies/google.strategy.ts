import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { registrationDto } from "../dto/auth.dto";
import { AccountType } from "src/enums/accountType.enum";
import { verifyGoogleAccessToken } from "src/utils/helperFunction";



@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google')
{
    constructor(private readonly authService: AuthService){
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
          });
    }

    async validate(_accessToken: string,_refreshToken: string,profile: any,done: VerifyCallback): Promise<any> {
        const { id, name, emails, photos } = profile;

  
        // const checkEmail=await this.authService.getUserByEmail(emails[0].name)

        // if(!checkEmail) {new throw BadRequestException("sadadad")}

        const user = {
            firstName: name.givenName,
            lastName: name.familyName,
            email: emails[0].value,
            userName:`${name.givenName}${Math.floor(100 + Math.random() * 900)}`,
            accountType:AccountType.GOOGLE,
          
            };

            // Verify the access token

            const isValidToken = await  verifyGoogleAccessToken(_accessToken)
       
        if (!isValidToken) throw new UnauthorizedException('Invalid access token');
    
      
          done(null, user);
      }
    
      
}