import {
  IsNotEmpty,
  Length,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

import {
  HardSkillMatrixCreateDto,
  Skills,
  CareerLevel,
  SkillsGet,
  HardSkillMatrixGetDto,
  HardSkillMatrixCopyDto,
  HardSkillMatrixGetForAssessment,
} from './hardSkillMatrix.dto';

class PartialCareerLevel extends OmitType(CareerLevel, ['name'] as const) {}

class SoftLevels {
  @IsNotEmpty({
    message: 'value must not be empty',
  })
  @MaxLength(32, { message: 'value is too long' })
  @ApiProperty({
    type: 'string',
    description: 'Leves name(A, B, C, A1...)',
    required: true,
  })
  value: string;

  @IsNotEmpty({
    message: 'Description must not be empty',
  })
  @MaxLength(512, { message: 'description is too long' })
  @ApiProperty({
    type: 'string',
    description: 'Good man, have nice soul...',
    required: true,
  })
  description: string;

  @IsNotEmpty({
    message: 'level_id must not be empty',
  })
  @ApiProperty({
    type: PartialCareerLevel,
  })
  level_id: PartialCareerLevel;
}

class SoftLevelsGet extends OmitType(SoftLevels, ['level_id'] as const) {
  @ApiProperty({ type: 'string', description: 'This softSkillLevelId' })
  id: string;

  @ApiProperty({
    type: CareerLevel,
  })
  level_id: CareerLevel;
}

class SoftSkill extends OmitType(Skills, ['questions', 'grades'] as const) {
  @ApiProperty({ isArray: true, type: SoftLevels })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  levels: SoftLevels[];
}

class SoftSkillGet extends OmitType(SkillsGet, ['levels', 'questions']) {
  @ApiProperty({ isArray: true, type: SoftLevelsGet })
  levels: SoftLevelsGet[];
}

class currentSkillLevel {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string', description: 'A1, B, ...' })
  value: string;

  @ApiProperty({ type: 'string' })
  comment: string;
}

class SoftSkillGetForAssessment extends OmitType(SoftSkillGet, [
  'levels',
] as const) {
  @ApiProperty({ type: currentSkillLevel })
  currentSkillLevel: currentSkillLevel;
}

export class SoftSkillMatrixGetAllDto extends OmitType(HardSkillMatrixGetDto, [
  'id',
] as const) {
  @ApiProperty({ type: 'string', description: 'This isSoftSkillMatrixId' })
  id: string;
}
export class SoftSkillMatrixCreateDto extends OmitType(
  HardSkillMatrixCreateDto,
  ['skillGroups'] as const,
) {
  @ApiProperty({ isArray: true, type: SoftSkill })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  skills: SoftSkill[];
}

export class SoftSkillMatrixGetDetailsDto extends SoftSkillMatrixGetAllDto {
  @ApiProperty({ isArray: true, type: SoftSkillGet })
  skills: SoftSkillGet[];
}

export class SoftSkillMatrixCopyDto extends OmitType(HardSkillMatrixCopyDto, [
  'hardSkillMatrixId',
] as const) {
  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  softSkillMatrixId: string;
}

export class SoftSkillMatrixCopyResponseDto extends OmitType(
  SoftSkillMatrixCopyDto,
  ['positionId'] as const,
) {}

export class SoftSkillMatrixUpdateDto extends PartialType(
  OmitType(SoftSkillMatrixGetDetailsDto, ['id', 'position'] as const),
) {
  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  positionId: string;
}

export class SoftSkillMatrixGetForAssessment extends OmitType(
  HardSkillMatrixGetForAssessment,
  ['skillGroups', 'comment'],
) {
  @ApiProperty({ isArray: true, type: SoftSkillGetForAssessment })
  skills: SoftSkillGetForAssessment[];
}

export class SoftSkillDto {
  @IsNotEmpty()
  @Length(2, 20)
  value: string;
}
