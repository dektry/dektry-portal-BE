import { IsNotEmpty } from 'class-validator';
import { PermissionEntity } from '../entity/permission.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  roleName: string;

  @IsNotEmpty()
  permission: PermissionEntity[];
}
