import { IsString, IsEmail, IsNotEmpty, IsEmpty } from 'class-validator';
import { validationMessages } from 'src/utils/validationMessages';

export class LoginUserDTO{
        
    @IsString()
    @IsNotEmpty({message:validationMessages.userName.empty})
    userName:string

    @IsString()
    @IsNotEmpty({message:validationMessages.password.empty})
    password:string
}