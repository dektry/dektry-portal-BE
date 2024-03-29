import { IsOptional, MaxLength } from 'class-validator';
import { InterviewEntity } from '../entity/interview.entity';
import { SoftInterviewEntity } from '../entity/softInterview.entity';

export class UpdateCandidateDto {
  @IsOptional()
  @MaxLength(255, { message: 'Name is too long' })
  fullName: string;

  @IsOptional()
  @MaxLength(255, { message: 'Position is too long' })
  position: string;

  @IsOptional()
  @MaxLength(40, { message: 'Level is too long' })
  level: string;

  @IsOptional()
  @MaxLength(255, { message: 'Location is too long' })
  location: string;

  // not presented in db yet, but is in UI
  @IsOptional()
  @MaxLength(255, { message: 'Email is too long' })
  email: string;

  @IsOptional()
  interview: null | InterviewEntity;

  @IsOptional()
  soft_interview: null | SoftInterviewEntity;
}

export class UpdateCandidatePFdto {
  @IsOptional()
  @MaxLength(255, { message: 'Name is too long' })
  full_name?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Position is too long' })
  position?: string;

  @IsOptional()
  @MaxLength(40, { message: 'Level is too long' })
  email?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Location is too long' })
  location?: string;
}
