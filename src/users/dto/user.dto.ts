import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { RoleEntity } from '../entity/role.entity';

export class UserDto {
  @IsNotEmpty()
  @Length(2, 20)
  firstName: string;

  @IsNotEmpty()
  @Length(2, 20)
  lastName: string;

  @IsNotEmpty()
  @Length(2, 40)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @IsNotEmpty()
  role: RoleEntity;
}
