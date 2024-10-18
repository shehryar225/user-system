import { Body, Controller, Get, HttpStatus, Param, Post, Req, UseGuards, UsePipes,ValidationPipe } from "@nestjs/common";
import { userServices } from "./user.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Roles } from "src/common/decorators/role.decorators";
import { UserRole } from "src/enums/userRoles.enum";
import { Request } from "express";
import { restPasswordDto } from "../auth/dto/auth.dto";
import { ValidationsPipe } from "src/pipes/customValidation.pipe";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { createApiResponse } from "src/utils/response/createResponse";


@ApiTags('User')
@Controller("users")
@UseGuards(AuthGuard, RolesGuard)

export class userController
{
    constructor(private userservice:userServices) {}

    @Get("home")
    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"Home"))
    @ApiForbiddenResponse(createApiResponse(HttpStatus.FORBIDDEN,{role:["You do not have permission to access this resource","Access denied"],token:['Session expired! Please sign in']}))
    @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED,{token:["Please log in first","Token is no longer valid. Please log in again."]}))
    @Roles(UserRole.USER)    
    async home()
    {
        return this.userservice.home()
    }

    @Get("me")
    @Roles(UserRole.USER)
    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"My Profile"))
    @ApiForbiddenResponse(createApiResponse(HttpStatus.FORBIDDEN,{role:["You do not have permission to access this resource","Access denied"],token:['Session expired! Please sign in']}))
    @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED,{token:["Please log in first","Token is no longer valid. Please log in again."]}))
    async getProfile(@Req() req:Request)
    {
        return this.userservice.profile(req)
    }

    @Post("updatepassword")
    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"Password Updated Successfully"))
    @ApiForbiddenResponse(createApiResponse(HttpStatus.FORBIDDEN,{role:["You do not have permission to access this resource","Access denied"],token:['Session expired! Please sign in']}))
    @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED,{token:["Please log in first","Token is no longer valid. Please log in again."]}))
    @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST,{newpassword:["New Password must contain letters, numbers, and symbols","Password required","New password and confirm password do not match."],currpassword:["Current Password must contain letters, numbers, and symbols","Please enter your current password correctlty","You're entering your current password in new password field"],confirmpassword:["New Password must contain letters, numbers, and symbols","Password required","New password and confirm password do not match."]}))
 
    @ApiBody({
       type: restPasswordDto,
       description: 'Json structure for user object',
    })
    @Roles(UserRole.USER)
    @UsePipes(new ValidationsPipe)
    async updatePassword(@Body() body:restPasswordDto,@Req() req:Request)
    {
        return this.userservice.updatePassword(body,req)
    }
}