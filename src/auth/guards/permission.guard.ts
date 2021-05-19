import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '../../enums/permissions.enum';
import { PERMISSIONS_KEY } from '../../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<Permissions>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )[0];
    const { user } = context.switchToHttp().getRequest();
    const currentPermissions = [];
    for (const permission of user.role.permissions) {
      currentPermissions.push(permission.name);
    }
    if (!requiredPermission) {
      return true;
    }
    return currentPermissions.includes(requiredPermission);
  }
}
