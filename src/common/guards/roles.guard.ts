import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    username: string;
    role: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly relfector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;
    const roles = this.relfector.get<string[]>('roles', context.getHandler());

    return roles.includes(user.role);
  }
}
