import { IsString, IsEmail, IsNotEmpty, IsEmpty } from 'class-validator';
import { validationMessages } from 'src/utils/validationMessages';

export class CreateUserDTO{
    
    @IsString()
    @IsNotEmpty({message:validationMessages.firstName.empty}) 
    firstName:string
    
    @IsString()
    @IsNotEmpty({message:validationMessages.lastName.empty}) 
    lastName:string
    
    @IsString()
    @IsNotEmpty({message:validationMessages.userName.empty})
    userName:string

    @IsEmail({}, { message: validationMessages.email.invalid })
    @IsNotEmpty({message:validationMessages.email.empty})
    email: string;

    @IsString()
    @IsNotEmpty({message:validationMessages.password.empty})
    password:string
}