import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userServices } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { loginDto, registrationDto, restPasswordDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository:Repository <User>,
    private jwtService: JwtService) {}

//   async validateUser(username: string, password: string): Promise<User | null> {
//     const user = await this.userService.findByUsername(username);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return user; // Return user if valid
//     }
//     return null; // Return null if invalid
//   }

async register(createUserDto: registrationDto): Promise<any> {

    const newUser = this.userRepository.create(createUserDto);
    
    try{
        const {userName,email}=createUserDto    
        
        console.log(newUser)
        const user= await this.userRepository.save(newUser)
        
        //Generate the Email Verification Token from jwt token
        const jwt=this.generateTempToken({id:user.id,type:"temporary",expiresIn:'5m'})

        return {
            message:`Registration Successfully Please verify your account http://localhost:3000/auth/verifyemail/${jwt}`,
        };
    }
    catch(error)
    {
        console.error('Error occurred while saving the user:', error);
        
        throw error
       
        // throw new InternalServerErrorException('An error occurred while registering the user');
    }
      
}


async login(loginuserdto:loginDto):Promise<any>
{
    const {userName,password}=loginuserdto

    if (!userName || !password)  throw new BadRequestException(`${userName?"Password":"Username"} must be required`);
    
    try{
    
        const checkUser = await this.userRepository.findOne({
           where:{userName:userName}
          });
          
        if(!checkUser) throw new UnauthorizedException("Username not Found")
          
        if (!checkUser.isVerified) throw new UnauthorizedException('Please verify your email before logging in.');
        
    
        if(!(await bcrypt.compare(password,checkUser.password))) throw new UnauthorizedException(`Invalid Credentials`);  
        
        const generateJwt=this.generateToken({username:checkUser.userName,email:checkUser.email,role:checkUser.role,expiresIn:'1h'})

        return {
            message:"You are logged In",
            token:generateJwt
        }
    }catch(error)
    {
        console.error('Error occurred while saving the user:', error);
        
        throw error
    }
}


async verifyAccount(param):Promise<{message:string}>
{
    const {token}=param;

    try{

        const checkToken=await this.validateToken(token)


        const user=await this.userRepository.findOne({where:{id:checkToken.email}});
       
        if (!user) throw new BadRequestException('User not found');
        
        if(user.isVerified) throw new BadRequestException('You are already Verified');

        if(!checkToken) throw new BadRequestException('Invalid token');

        if (checkToken.exp && checkToken.exp < Date.now() / 1000)  throw new BadRequestException('Verification token has expired. Please request a new verification email.');
      
        user.isVerified=true
        
        await this.userRepository.save(user);

        return { message: 'Email successfully verified!' }
    }
    catch(err)
    {
        console.log("An Error Occurs ",err)
        throw err
    }
    
}  

async resedEmail(email:string):Promise<{message:string}>
{
    try{
    const checkEmail =await this.userRepository.findOne({where:{email:email,isVerified: false}})

    if(!checkEmail) throw new BadRequestException(`${!checkEmail?"User not found":"Your are already verified"}`);

    const reGenerateJwt=this.generateTempToken({id:checkEmail.id,type:"temporary",expiresIn:'5m'})

    return{message:`A link has been sent to your email account http://localhost:3000/auth/verifyresendpassword/${reGenerateJwt}`}
    
    }
    catch(err)
    {
        throw err
    }    
}

async resentPasswordRequest(email:string):Promise<{message:string}>
{
    try{

        const checkEmail=await this.userRepository.findOne({where:{email:email}})

        if(!checkEmail) throw new BadRequestException("Email not found")

        const generateJwt=this.generateTempToken({id:checkEmail.id,type:"temporary",expiresIn:'5m'}) 

        await this.userRepository.save(checkEmail);

        return {message:`A link has been sent to your email  http://localhost:3000/auth/verifyresendpassword/${generateJwt}`}
    
    }
    catch(err)
    {
        throw err
    } 
}

async verifyResetEmail(param,body:restPasswordDto):Promise<{message:string}>
{
    const currpassword=body.currpassword
    const newpassword=body.password
    const confirmpassword=body.confirmpassword
    const {token}=param
    try{

        const checkToken=await this.validateToken(token)

        if(!checkToken) throw new BadRequestException('Invalid token');

        if (checkToken.exp && checkToken.exp < Date.now() / 1000)  throw new BadRequestException('Verification token has expired. Please request a new verification email.');
              
        const user=await this.userRepository.findOne({where:{email:checkToken.email}});    

        const currentpasswordCheck=await bcrypt.compare(currpassword, user.password)

        if(!currentpasswordCheck || newpassword===currpassword) throw new BadRequestException(currentpasswordCheck===true?"Please enter your current password correctlty":"You're entering your current password in new password field")

        if (newpassword !== confirmpassword)  throw new BadRequestException('New password and confirm password do not match.');
        
        checkToken.password=await bcrypt.hash(newpassword, 10)
        await this.userRepository.save(checkToken);

        return { message: 'Your password has been reset successfully'}
    }
    catch(err)
    {
        console.log("An Error Occurs ",err)
        throw err
    }  

}

  generateToken(obj): string {
    const payload = { username:obj.username,email:obj.email,role:obj.role }; 
    return this.jwtService.sign(payload,{ expiresIn: obj.expiresIn }); 
  }

  generateTempToken(obj):string
  {
    const payload={id:obj.id,temporary:obj.temporary};
    return this.jwtService.sign(payload,{ expiresIn: obj.expiresIn }); 
  }

  validateToken(token: string) {
    try{

    return this.jwtService.verify(token, {
        secret : process.env.JWT_SECRET_KEY
    });
    } catch (error) {
    throw new BadRequestException('Invalid token');
    }
}


}