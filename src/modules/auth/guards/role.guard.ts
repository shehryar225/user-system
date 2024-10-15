import { Injectable,CanActivate,ExecutionContext,ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/common/decorators/role.decorators";
import { UserRole } from "src/enums/userRoles.enum";
import {Request} from "express";

@Injectable()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // If no roles are required, allow access
    if (!requiredRoles) {
      return true; 
    }

    // Access the request object
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['decodedData'];

    // Check if user exists and has a role
    console.log("Your role is",user?.role)
    const role=user?.role

    // console.log(role)
    if (!role) throw new ForbiddenException('Access denied'); // Throw an exception if no user role

    // // Check if the user's role is included in the required roles
    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    // If all checks pass, allow access
    return true; 
  }
}