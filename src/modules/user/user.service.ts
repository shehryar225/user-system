import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "../dto/createUser.dto";
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { LoginUserDTO } from "../dto/loginUser.dto";
import * as bcrypt from 'bcrypt';
import { AuthService } from "../auth/auth.service";


export class userServices{

    constructor(@InjectRepository(User) private userRepository:Repository <User>, private authServices:AuthService) {}

    async register(createUserDto: CreateUserDTO): Promise<User> {

        const newUser = this.userRepository.create(createUserDto);
        
        try{
            const {userName,email}=createUserDto    
            
                // Check if the username and email already exists
            const existingUser = await this.userRepository.findOne({
                where: [{userName}, { email }],
              });

            if(existingUser)  throw new ConflictException(`${existingUser.userName===userName?"Username":"Email"} already exist`);

            return this.userRepository.save(newUser);
        }
        catch(error)
        {
            console.error('Error occurred while saving the user:', error);
            
            throw error
            // Throw a generic InternalServerErrorException to be caught by the filter
            // throw new InternalServerErrorException('An error occurred while registering the user');
        }
          
    }

    async login(loginuserdto:LoginUserDTO):Promise<any>
    {
            const {userName,password}=loginuserdto

             //Check user is already in database or not
            const checkUser = await this.userRepository.findOne({
               where:{userName:userName}
              });
           
            if(!checkUser || !(await bcrypt.compare(password,checkUser.password))) throw new UnauthorizedException(`Invalid Credentials`);  
            
            const generateJwt=this.authServices.generateToken(checkUser.userName,checkUser.email,checkUser.id)

            return {
                message:"You are logged In",
                token:generateJwt
            }
    }
    
}