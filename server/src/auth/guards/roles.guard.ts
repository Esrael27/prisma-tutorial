// src/auth/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';  // JWT guard to handle token validation
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;  // Get the user object from the request, attached by JwtAuthGuard

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()); // Get required roles
    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }

    if (!requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return true;  // Allow access if the user has the required role
  }
}
