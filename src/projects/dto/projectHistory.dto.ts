import { IsNotEmpty } from 'class-validator';

export class ProjectHistoryDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  projectId: string;
}
