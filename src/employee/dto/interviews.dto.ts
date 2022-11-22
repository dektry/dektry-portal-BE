import { IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CompleteInterviewsDto {
  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({
    message: 'PositionId must not be empty',
  })
  positionId: string;

  @IsNotEmpty({
    message: 'LevelId must not be empty',
  })
  levelId: string;

  @IsNotEmpty({
    message: 'Answers must not be empty',
  })
  answers: {
    [key: string]: string;
  };

  @IsOptional()
  @MaxLength(512, { message: 'Comment is too long' })
  comment?: string;
}
export class EditInterviewsDto extends CompleteInterviewsDto {
  @IsOptional()
  isApproved: boolean;
}
