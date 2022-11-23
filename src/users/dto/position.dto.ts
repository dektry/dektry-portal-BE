import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PositionDto {
  @IsNotEmpty()
  @Length(2, 20)
  @ApiProperty({ type: 'string' })
  name: string;
}
