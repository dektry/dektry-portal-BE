import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { defaultMaxLength } from '../utils/constants';

export class LanguageDto {
  @IsOptional()
  id: string;

  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({ message: 'Language name must not be empty' })
  @MaxLength(defaultMaxLength, { message: 'Language name is too long' })
  value: string;

  @IsNotEmpty({ message: 'Language level name must not be empty' })
  @MaxLength(5, { message: 'Language level name is too long' })
  level: string;
}
