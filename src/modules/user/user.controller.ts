import { Body, Controller, Post, UsePipes,ValidationPipe } from "@nestjs/common";
import { userServices } from "./user.service";
import { CreateUserDTO } from "../dto/createUser.dto";
import { UserRegistrationPipe } from "src/pipes/userRegister.pipe";
import { LoginUserDTO } from "../dto/loginUser.dto";

@Controller("users")
export class userController
{
    constructor(private userservice:userServices) {}
    @Post("register")
    @UsePipes(new ValidationPipe({ transform: true }), UserRegistrationPipe)
    async register(@Body() body:CreateUserDTO)
    {
        return this.userservice.register(body);
    }

    @Post("login")
    async login(@Body() body:LoginUserDTO)
    {
        return this.userservice.login(body);
    }
    
}