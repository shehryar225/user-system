import { IsString, IsEmail, IsNotEmpty, IsEmpty, Matches, IsOptional } from 'class-validator';

export class userDto{

   
    @IsString()
    @IsNotEmpty() 
    firstName:string

   
    @IsString()
    @IsNotEmpty() 
    lastName:string
    
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]+$/,{message:"Username must contain numbers and letter"})
    userName:string

    @IsEmail({})
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Password must contain letters, numbers, and symbols."})
    password:string

    // @IsString()
    // @IsNotEmpty()
    // @Matches(
    //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Current Password must contain letters, numbers, and symbols."})
    // currpassword:string

    // @IsString()
    // @IsNotEmpty()
    // @Matches(
    //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Confirm Password must contain letters, numbers, and symbols."})   
    // confirmpassword:string
}