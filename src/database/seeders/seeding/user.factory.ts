
import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { UserRole } from 'src/enums/userRoles.enum';
import { User } from 'src/modules/user/entities/user.entity';


export const UserFactory = setSeederFactory(User, (faker: Faker) => {
    const user = new User();
   user.firstName = faker.name.firstName();  
  user.lastName = faker.name.lastName();    
  user.userName = faker.internet.userName();
  user.email = faker.internet.email();      
  user.password = faker.internet.password();
  user.role = UserRole.USER;
  user.isVerified=true 
  
    return user;
  });
