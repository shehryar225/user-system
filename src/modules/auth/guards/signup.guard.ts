import { Injectable, CanActivate, ExecutionContext, ConflictException } from '@nestjs/common';
import { userServices } from 'src/modules/user/user.service';


@Injectable()
export class UniqueUserGuard implements CanActivate {
    constructor(private userservice:userServices) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { userName, email } = request.body;

        const userExists = await this.userservice.findOneByUserNameOrEmail(userName, email);
        
        if (userExists) {
            throw new ConflictException(`${userExists.userName===userName?"Username":"Email"} already Exist`);
        }

        return true;
    }
}
