import { IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

import { ISoftSkill } from '../utils/constants';

export class EditSoftInterviewsDto {
  @IsOptional()
  @MaxLength(255, { message: 'Hobby is too long' })
  hobby?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Comment is too long' })
  comment?: string;

  @IsNotEmpty({
    message: 'CandidateId must not be empty',
  })
  candidateId: string;

  @IsNotEmpty({
    message: 'Soft Skills must not be empty',
  })
  softSkills: Array<ISoftSkill>;
}
export class CompleteSoftInterviewsDto extends EditSoftInterviewsDto {
  @IsNotEmpty({
    message: 'PositionId must not be empty',
  })
  positionId: string;

  @IsNotEmpty({
    message: 'LevelId must not be empty',
  })
  levelId: string;
}
