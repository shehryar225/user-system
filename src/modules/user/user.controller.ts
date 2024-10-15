import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes,ValidationPipe } from "@nestjs/common";
import { userServices } from "./user.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Roles } from "src/common/decorators/role.decorators";
import { UserRole } from "src/enums/userRoles.enum";
import { Request } from "express";
import { restPasswordDto } from "../auth/dto/auth.dto";
import { ValidationsPipe } from "src/pipes/customValidation.pipe";

@Controller("users")
@UseGuards(AuthGuard, RolesGuard)
export class userController
{
    constructor(private userservice:userServices) {}

    @Get("home")
    @Roles(UserRole.USER)    
    async home()
    {
        return this.userservice.home()
    }

    @Get("me")
    @Roles(UserRole.USER)
    async getProfile(@Req() req:Request)
    {
        return this.userservice.profile(req)
    }

    @Post("updatepassword")
    @Roles(UserRole.USER)
    @UsePipes(new ValidationsPipe)
    async updatePassword(@Body() body:restPasswordDto,@Req() req:Request)
    {
        return this.userservice.updatePassword(body,req)
    }
}