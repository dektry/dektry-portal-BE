import { IsNotEmpty } from 'class-validator';
import { RoleEntity } from '../entity/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: RoleEntity[];
}
