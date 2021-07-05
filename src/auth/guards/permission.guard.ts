import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'enums/permissions.enum';
import { PERMISSIONS_KEY } from 'decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<
      Permissions[] | Permissions
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    const { user } = context.switchToHttp().getRequest();
    const currentPermissions = user.role.permissions.map((permission) => {
      return permission.name;
    });
    const isAccessibly = currentPermissions.some((perm) =>
      requiredPermission.includes(perm),
    );
    return !requiredPermission.length || isAccessibly;
  }
}
