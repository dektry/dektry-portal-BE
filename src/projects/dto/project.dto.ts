import { IsNotEmpty, Length } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  managers: string[];

  users: string[];
}
