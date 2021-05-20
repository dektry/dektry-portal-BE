import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'src/enums/permissions.enum';
import { PERMISSIONS_KEY } from 'src/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<Permissions>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )[0];
    const { user } = context.switchToHttp().getRequest();
    const currentPermissions = user.role.permissions.map((permission) => {
      return permission.name;
    });
    return requiredPermission
      ? currentPermissions.includes(requiredPermission)
      : true;
  }
}
