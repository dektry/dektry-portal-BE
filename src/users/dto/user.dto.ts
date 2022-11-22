import { IsEmail, IsNotEmpty, Length, IsOptional } from 'class-validator';
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
  @IsEmail(
    {},
    {
      message: 'Please enter a valid email address',
    },
  )
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;

  @IsNotEmpty({
    message: 'Role must not be empty',
  })
  roleId: string;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  birthday: Date;

  @IsNotEmpty()
  career: CareerEntity[];
}
