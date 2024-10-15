import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { userController } from "../user/user.controller";
import { userServices } from "../user/user.service";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { authController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { AuthGuard } from "./guards/auth.guard";
import { RolesGuard } from "./guards/role.guard";

@Module({
    imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET , 
        signOptions: { expiresIn: '1h' },
      }),
      TypeOrmModule.forFeature([User]),
    ],
    controllers:[authController],
    providers: [AuthService,JwtStrategy,userServices,AuthGuard],
    exports: [AuthService], 
  })
  export class AuthModule {}
  