import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IAuthUser } from '../auth.interfaces';

export class AuthLoginDto {
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({ type: 'string' })
  username: string;

  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({ type: 'string' })
  password: string;
}
