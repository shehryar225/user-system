import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userServices } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService) {}

//   async validateUser(username: string, password: string): Promise<User | null> {
//     const user = await this.userService.findByUsername(username);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return user; // Return user if valid
//     }
//     return null; // Return null if invalid
//   }

  generateToken(username: string,email:string, userId: number): string {
    const payload = { username,email:email, sub: userId }; 
    return this.jwtService.sign(payload); 
  }
}