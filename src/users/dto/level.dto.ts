import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LevelDto {
  @IsNotEmpty()
  @Length(2, 128)
  @ApiProperty({ type: 'string' })
  name: string;
}
