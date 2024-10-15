import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { BadRequestException, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { Request } from "express";
import { createResponse } from "src/utils/response/responseHandler";
import * as bcrypt from 'bcrypt';
import { restPasswordDto } from "../auth/dto/auth.dto";


export class userServices{

    constructor(@InjectRepository(User) private userRepository:Repository <User>, private authServices:AuthService) {}

    async findOneByUserNameOrEmail(userName: string, email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: [{ userName }, { email }],
        });
    }

    async findById(id:number): Promise<User | undefined>
    {
        return await this.userRepository.findOne({
            where:{id:id,isVerified:true}
        })
    }

    async home()
    {
     return "home"
    }

    async profile(req:Request)
    {
       const {iat,exp,...others} =req["decodedData"]

       return createResponse("User Profile",others,HttpStatus.OK)  
    }

    async updatePassword(body:restPasswordDto,req:Request)
    {
        
        const currpassword=body.currpassword
        const newpassword=body.password
        const confirmpassword=body.confirmpassword
        const user=req["decodedData"]

        const getUser=await this.userRepository.findOne({where:{email:user.email}});

        const currentpasswordCheck=await bcrypt.compare(currpassword, getUser.password)

     
        if(!currentpasswordCheck || newpassword===currpassword) throw new BadRequestException(currentpasswordCheck===true?"Please enter your current password correctlty":"You're entering your current password in new password field")

        if (newpassword !== confirmpassword)  throw new BadRequestException('New password and confirm password do not match.');

        getUser.password=await bcrypt.hash(newpassword,10);
        getUser.passwordUpdatedAt = new Date();

      
        const d=await this.userRepository.save(getUser);

        const token=this.authServices.generateToken({ username:getUser.userName,email:getUser.email,role:getUser.role,expiresIn:"1h" })

        return createResponse("","Password Updated Successfully",HttpStatus.OK,token)  
    }
}
