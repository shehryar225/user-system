import { Module } from "@nestjs/common";
import { userServices } from "./user.service";
import { userController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AuthModule } from "../auth/auth.modules";


@Module({
    imports:[TypeOrmModule.forFeature([User]),
    AuthModule,
    ],
    controllers:[userController],
    providers:[userServices],
    exports:[userServices]
})

export class UserModule{}