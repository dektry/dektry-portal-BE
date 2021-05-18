import { IsNotEmpty } from 'class-validator';
import { PermissionEntity } from '../entity/permission.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  permissions: string[];
}
