import { IsNotEmpty } from 'class-validator';
import { permission } from '../../permission/entity/permission.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  roleName: string;

  @IsNotEmpty()
  permission: permission[];
}
