import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UniqueUserGuard } from "./guards/signup.guard";
import { registrationDto, loginDto, EmailDTO, restPasswordDto } from "./dto/auth.dto";
import { ValidationsPipe } from "src/pipes/customValidation.pipe";
import { RolesGuard } from "./guards/role.guard";
import { AuthGuard } from "./guards/auth.guard";
import { Roles } from "src/common/decorators/role.decorators";
import { UserRole } from "src/enums/userRoles.enum";

@Controller("auth")

export class authController
{
    constructor(private userservice:AuthService) {}
    @Post("register")
    @UsePipes(new ValidationsPipe)
    @UseGuards(UniqueUserGuard)
    // @UsePipes(new ValidationPipe({ transform: true }), UserRegistrationPipe)
    async register(@Body() body:registrationDto)
    {
        return this.userservice.register(body);
    }

    @Post("login")
    async login(@Body() body:loginDto)
    {
        return this.userservice.login(body);
    }

    
    @Get("/home")
    
    
   
    // @UseGuards(AuthGuard)
    

    @Post("verifyemail/:token")
    async verifyEmail(@Param() param:Record<string,any>)
    {
        return this.userservice.verifyAccount(param)
    }

    @Post("/resendemail")
    async resendEmail(@Body() body:registrationDto)
    {
        return this.userservice.resedEmail(body.email)
    }
    
    @Post("/forgetpassword")
    async forgetPassword(@Body() body:EmailDTO)
    {
        return this.userservice.resentPasswordRequest(body.email)
    }

    @Post("/verifyresendpassword/:token")
    // @UsePipes(new ValidationPipe({ transform: true }),resetPassword)
    @UsePipes(new ValidationsPipe)
    async verifyResetPassword(@Param() param:Record<string,any>,@Body() body:restPasswordDto)
    {
        return this.userservice.verifyResetEmail(param,body)
    }
}