import { IsOptional, MaxLength } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @MaxLength(255, { message: 'Name is too long' })
  fullName?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Position is too long' })
  position?: string;

  @IsOptional()
  @MaxLength(40, { message: 'Level is too long' })
  level?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Location is too long' })
  location?: string;
}
