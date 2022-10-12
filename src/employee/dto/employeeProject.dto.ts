import { IsArray, ArrayMaxSize, IsNotEmpty } from 'class-validator';
import { ITechnology } from 'employee/utils/constants';

export class EmployeeProjectDto {
  id?: string;

  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({
    message: 'Project name must not be empty',
  })
  name: string;

  @IsNotEmpty({
    message: 'Project duration must not be empty',
  })
  duration: string;

  @IsNotEmpty({
    message: 'Project role must not be empty',
  })
  role: string;

  @IsNotEmpty({
    message: 'Project name must not be empty',
  })
  team_size: string;

  @IsNotEmpty({
    message: 'Project name must not be empty',
  })
  description: string;

  @IsNotEmpty({
    message: 'Responsibilities must not be empty',
  })
  @IsArray()
  @ArrayMaxSize(64, { message: 'Responsibiliries array max length exceeded' })
  responsibilities: string[];

  @IsNotEmpty({
    message: 'Responsibilities must not be empty',
  })
  @IsArray()
  @ArrayMaxSize(15, { message: 'Technologies array max length exceeded' })
  technologies: ITechnology[];
}
