import { BadRequestException, Injectable,PipeTransform } from "@nestjs/common";
import { CreateUserDTO } from "src/modules/dto/createUser.dto";


export class UserRegistrationPipe implements PipeTransform {
    transform(value: CreateUserDTO) {
      const { userName,password,email } = value;
  
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

      if (!this.isPasswordComplex(password)) {
        throw new BadRequestException('Password must contain letters, numbers, and symbols.');
      }
  
      if (!this.isUsernameValid(userName)) {
        throw new BadRequestException('Username contains invalid characters.');
      }

      return value;
    }

    
  private isPasswordComplex(password: string): boolean {
    // Check for at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  }

  private isUsernameValid(username: string): boolean {
    // Ensure username only contains letters, numbers
    const usernameRegex = /^[A-Za-z0-9]+$/;
    return usernameRegex.test(username);
  }
}