import { Injectable } from '@nestjs/common';
import { userServices } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/enums/userRoles.enum';
// import { CreateAdminDto } from './dto/create-admin.dto';
// import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  

  constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,
  ) {}  

 async findAll() {
    
    try{

      const getUser=await this.userRepository.find({
        where: { role: UserRole.USER }, // Filter for users whose role is 'admin'
        select: ['id', 'userName', 'email', 'role'], // Specify fields to include, excluding 'password'
      });

      
      return {
        message:"All Users",
        status:"success",
        data:getUser
      };
    }
    catch(error)
    {
        console.error('Error occurred while saving the user:', error);
        throw error
    }


  }

}
