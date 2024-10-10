import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { userController } from "../user/user.controller";
import { userServices } from "../user/user.service";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";


@Module({
    imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET || 'your_secret_key', // Use environment variable for the secret
        signOptions: { expiresIn: '1h' }, // Token expiration
      }),
    ],
    providers: [AuthService],
    exports: [AuthService], // Export AuthService if needed in other modules
  })
  export class AuthModule {}
  