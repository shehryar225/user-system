import { CanActivate, Injectable, UnauthorizedException,ExecutionContext, ForbiddenException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { userServices } from "src/modules/user/user.service";


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authServices: AuthService,private readonly userservice: userServices) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("AuthGuard: canActivate called");
    
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Please log in first');
    }

    const authToken = authorization.split(' ')[1]; // This will get the token after 'Bearer '
    
    try {
      const decodedData = await this.authServices.validateToken(authToken);
      request['decodedData'] = decodedData;
           
      const getUser=await this.userservice.findOneByUserNameOrEmail(decodedData.userName,decodedData.email);
      
      if (getUser?.passwordUpdatedAt > new Date(decodedData?.iat * 1000)) throw new UnauthorizedException('Token is no longer valid. Please log in again.');

      return true;
    } catch (error) {
      console.log('AuthGuard Error:', error.message);
      throw new ForbiddenException(error.message || 'Session expired! Please sign in');
    }
  }
}