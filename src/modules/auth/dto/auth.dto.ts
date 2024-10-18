import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsEmpty, Matches, IsOptional, ValidateIf, isString } from 'class-validator';
import { AccountType } from 'src/enums/accountType.enum';

export class usernameDto {

    @ApiProperty({
        example: 'user225',
        required: true
     })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]+$/,{message:"Username must contain numbers and letter"})
    userName:string
}
export class loginDto extends usernameDto{

    @ApiProperty({
        example: 'passs123@#',
        required: true
     })
    @IsString()
    @ValidateIf((o) => o.accountType === AccountType.SIMPLE)
    @IsNotEmpty()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Password must contain letters, numbers, and symbols."})
    password?:string
}

export class EmailDTO{
       
    @ApiProperty({
        example: 'rehmat.sayani@gmail.com',
        required: true
     })
    @IsEmail({})
    @IsNotEmpty()
    email: string;
}

export class restPasswordDto{

    // @IsString()
    // @IsNotEmpty()
    // @Matches(/^[a-zA-Z0-9]+$/,{message:"Username must contain numbers and letter"})
    // userName:string

    @ApiProperty({
        example: 'pass123@!',
        required: true
     })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Password must contain letters, numbers, and symbols."})
    currpassword:string

    
    @ApiProperty({
        example: 'pass123@!',
        required: true
     })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Password must contain letters, numbers, and symbols."})
    password:string

    
    @ApiProperty({
        example: 'pass123@!',
        required: true
     })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message:"Password must contain letters, numbers, and symbols."})
    confirmpassword:string    
}

export class registrationDto extends loginDto
{
    @ApiProperty({
        example: 'rehmat',
     })
    @IsString()
    @IsNotEmpty() 
    firstName:string

    @ApiProperty({
        example: 'sayani',
     })
    @IsString()
    @IsNotEmpty() 
    lastName:string
   
    @ApiProperty({
        example: 'rehmat.sayani@gmail.com',
        required: true
     })
    @IsEmail({})
    @IsNotEmpty()
    email: string; 

}
