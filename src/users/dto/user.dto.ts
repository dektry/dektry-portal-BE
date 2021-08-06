import { IsEmail, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { RoleEntity } from '../entity/role.entity';
import { PositionEntity } from '../entity/position.entity';
import { CareerEntity } from 'users/entity/career.entity';

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

  @IsOptional()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @IsNotEmpty()
  role: RoleEntity;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  birthday: Date;

  @IsNotEmpty()
  career: CareerEntity[];
}
