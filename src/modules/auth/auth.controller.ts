import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UniqueUserGuard } from "./guards/signup.guard";
import { registrationDto, loginDto, EmailDTO, restPasswordDto } from "./dto/auth.dto";
import { ValidationsPipe } from "src/pipes/customValidation.pipe";
import { RolesGuard } from "./guards/role.guard";
import { Roles } from "src/common/decorators/role.decorators";
import { UserRole } from "src/enums/userRoles.enum";
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { createApiResponse } from "src/utils/response/createResponse";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@ApiTags("Auth")
@Controller("auth")

export class authController
{
    constructor(private userservice:AuthService) {}
    @Post("register")
    @ApiCreatedResponse(createApiResponse(HttpStatus.CREATED,"Registration Successfully Please verify your account"))
    @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST,{email:["Email must be valid"],username:["Username must contain letter and number"],password:["Password must contain letters, numbers, and symbols","Password required"]}))
    @ApiConflictResponse(createApiResponse(HttpStatus.CONFLICT,{email: ["Email Already Exist"],userName:["Username already Exist"]}))    
    @ApiBody({
        type: registrationDto,
        description: 'Json structure for user object',
     })

    @UsePipes(new ValidationsPipe)
    @UseGuards(UniqueUserGuard)
    // @UsePipes(new ValidationPipe({ transform: true }), UserRegistrationPipe)
    async register(@Body() body:registrationDto)
    {
        return this.userservice.register(body);
    }

    @Post("login")
    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"You are logged In"))
    @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST,{username:["Username must be required"],password:["Password must be required","Password required"]}))
    @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED,{userName:["Username not Found","Invalid Credentials"],password:["Invalid Credentials"],isVerified:["Please verify your email before logging in."]}))
    @ApiBody({
       type: loginDto,
       description: 'Json structure for user object',
    })
    async login(@Body() body:loginDto)
    {
        return this.userservice.login(body);
    }

    
    @Get("/homee")
    async home()
    {
        return "Home"
    }
    
   
    // @UseGuards(AuthGuard)
    

    @Get("/verifyemails")
    // @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"Email successfully verified!"))
    // @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST,{token:["invalid token","Verification token has expired. Please request a new verification email"],email:["You are already verified"]}))
    // @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED,{token:["Token Required"]}))
    // @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND,{email:["User not found"]}))
    async verifyEmail(@Query() query:Record<string,any>)
    {
        return this.userservice.verifyAccount(query)
    }

    @Post("/resendemail")
    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"A link has been sent to your email account"))
    @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST,{email:["You are already verified","invalid email"]}))
    @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND,{email:["User not found."]}))
    @ApiBody({
       type: registrationDto,
       description: 'Json structure for user object',
    })
    async resendEmail(@Body() body:registrationDto)
    {
        return this.userservice.resedEmail(body.email)
    }
    
    @Post("/forgetpassword")
    
    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"A link has been sent to your email"))
    @ApiNotFoundResponse(createApiResponse(HttpStatus.NOT_FOUND,{email:["Email not found","email is invalid"]}))

    @ApiBody({
       type: EmailDTO,
       description: 'Json structure for user object',
    })

    async forgetPassword(@Body() body:EmailDTO)
    {
        return this.userservice.resentPasswordRequest(body.email)
    }

    @Post("/verifyresendpassword/:token")
    // @UsePipes(new ValidationPipe({ transform: true }),resetPassword)

    @ApiCreatedResponse(createApiResponse(HttpStatus.OK,"Your password has been reset successfully"))
    @ApiBadRequestResponse(createApiResponse(HttpStatus.BAD_REQUEST,{token:["Verification token has expired. Please request a new verification email."],newpassword:["New Password must contain letters, numbers, and symbols","Password required","New password and confirm password do not match."],currpassword:["Current Password must contain letters, numbers, and symbols","Please enter your current password correctlty","You're entering your current password in new password field"],confirmpassword:["New Password must contain letters, numbers, and symbols","Password required","New password and confirm password do not match."]}))
    @ApiUnauthorizedResponse(createApiResponse(HttpStatus.UNAUTHORIZED,{token:["Invalid Token"]}))
    @ApiBody({
        type: restPasswordDto,
        description: 'Json structure for user object',
     })
    @UsePipes(new ValidationsPipe)
    async verifyResetPassword(@Param() param:Record<string,any>,@Body() body:restPasswordDto)
    {
        return this.userservice.verifyResetEmail(param,body)
    }

    @Get()
    @UseGuards(AuthGuard("google"))
    async googleAuth(@Req() req:Request){ }
    
    @Get('api/auth/google/callback')
    @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req:Request)
    {

       
        return await this.userservice.validateUser({
                    ...req.user,
                    password: undefined,
                }as registrationDto);
        
            
        //   return await this.userservice.register({
        //     ...req.user,
        //     password: undefined,
        // }as registrationDto);
        
        //     return this.userservice.googleLogin(req)
    }
}