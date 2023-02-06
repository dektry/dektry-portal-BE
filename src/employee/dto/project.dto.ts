import { IsArray, ArrayMaxSize, IsNotEmpty, MaxLength } from 'class-validator';
import { ITechnology } from 'employee/utils/constants';

export class ProjectDto {
  id?: string;

  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({
    message: 'Project name must not be empty',
  })
  name: string;

  order?: number;

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
  @MaxLength(1000, { message: 'Description is too long' })
  description: string;

  @IsNotEmpty({
    message: 'Responsibilities must not be empty',
  })
  @IsArray()
  @ArrayMaxSize(64, { message: 'Responsibiliries array max length exceeded' })
  responsibilities: string[];

  @IsNotEmpty({
    message: 'Technologies must not be empty',
  })
  @IsArray()
  @ArrayMaxSize(15, { message: 'Technologies array max length exceeded' })
  technologies: ITechnology[];
}
