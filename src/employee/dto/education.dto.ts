import { MaxLength, IsNotEmpty, IsOptional } from 'class-validator';

import { defaultMaxLength } from '../utils/constants';

export class EducationDto {
  @IsOptional()
  id: string;

  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({ message: 'University name must not be empty' })
  @MaxLength(defaultMaxLength, { message: 'University name is too long' })
  university: string;

  @IsNotEmpty({ message: 'Specialization name must not be empty' })
  @MaxLength(defaultMaxLength, { message: 'Specialization name is too long' })
  specialization: string;

  @IsNotEmpty({ message: 'Start year name must not be empty' })
  startYear: number;

  @IsOptional()
  endYear: number;
}
