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

export class Grade {
  @IsNotEmpty({
    message: 'Grade value must not be empty',
  })
  @MaxLength(64, { message: 'value is too long' })
  @ApiProperty({
    type: 'string',
    description: 'Grade name(Basic, Novice, Expert...)',
    required: true,
  })
  value: string;

  @IsNotEmpty({
    message: 'Levelid must not be empty',
  })
  @Length(36)
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is CareerLevel(junior, middle...)',
  })
  levelId: string;
}

class CareerLevel {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'This is junior, middle, senior...',
  })
  name: string;
}

class GradeGet extends OmitType(Grade, ['levelId'] as const) {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: CareerLevel,
  })
  level_id: CareerLevel;
}

class Question {
  @IsNotEmpty({
    message: 'Question must not be empty',
  })
  @Length(256)
  @ApiProperty({ type: 'string', description: 'Question name', required: true })
  value: string;
}

class QuestionGet extends Question {
  @ApiProperty({ type: 'string' })
  id: string;
}

class currentSkillLevel extends QuestionGet {
  @ApiProperty({ type: 'string' })
  value: string;
}

class Skills {
  @IsNotEmpty({
    message: 'SkillName must not be empty',
  })
  @Length(64)
  @ApiProperty({ type: 'string', description: 'Skill name', required: true })
  value: string;

  @ApiProperty({ isArray: true, type: Grade })
  @IsArray()
  @ValidateNested({ each: true })
  grades: Grade[];

  @ApiProperty({ isArray: true, type: Question })
  @IsArray()
  @ValidateNested({ each: true })
  questions: Question[];
}

class SkillsGet extends OmitType(Skills, ['questions', 'grades'] as const) {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ isArray: true, type: GradeGet })
  levels: GradeGet[];

  @ApiProperty({ isArray: true, type: QuestionGet })
  questions: QuestionGet[];
}

class SkillsGetForAssessment extends SkillsGet {
  @ApiProperty({ type: currentSkillLevel })
  currentSkillLevel: currentSkillLevel;
}

class HardSkillMatrix {
  @IsNotEmpty({
    message: 'SkillGroupName must not be empty',
  })
  @Length(128)
  @ApiProperty({
    type: 'string',
    description: 'SkillGroup name',
    required: true,
  })
  value: string;

  @ApiProperty({ isArray: true, type: Skills })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  skills: Skills[];
}

class HardSkillMatrixGet extends OmitType(HardSkillMatrix, [
  'skills',
] as const) {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ isArray: true, type: SkillsGet })
  skills: SkillsGet[];
}

class hardSkillMatrixGetAssesment extends OmitType(HardSkillMatrixGet, [
  'skills',
] as const) {
  @ApiProperty({ isArray: true, type: SkillsGetForAssessment })
  skills: SkillsGetForAssessment[];
}

class Position {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  name: string;
}

export class HardSkillMatrixCreateDto {
  @IsNotEmpty({
    message: 'PositionId must not be empty',
  })
  @Length(36)
  @ApiProperty({ type: 'string', required: true })
  positionId: string;

  @ApiProperty({ isArray: true, type: HardSkillMatrix })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  skillGroups: HardSkillMatrix[];
}

export class HardSkillMatrixGetDto {
  @ApiProperty({ type: 'string', description: 'This isHardSkillMatrixId' })
  id: string;

  @ApiProperty({ type: Position })
  position: Position;
}

export class HardSkillMatrixGetForAssessment extends HardSkillMatrixGetDto {
  @ApiProperty({ isArray: true, type: hardSkillMatrixGetAssesment })
  skillGroups: hardSkillMatrixGetAssesment[];

  @ApiProperty({ type: 'string' })
  comment: string;

  @ApiProperty({ type: Date })
  created: Date;
}

export class HardSkillMatrixGetDetailsDto extends HardSkillMatrixGetDto {
  @ApiProperty({ isArray: true, type: HardSkillMatrixGet })
  skillGroups: HardSkillMatrixGet[];
}

export class HardSkillMatrixUpdateDto extends PartialType(
  OmitType(HardSkillMatrixGetDetailsDto, ['position', 'id'] as const),
) {
  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  positionId: string;
}

export class HardSkillMatrixCopyDto {
  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  positionId: string;

  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  hardSkillMatrixId: string;
}

export class HardSkillMatrixCopyResponseDto extends OmitType(
  HardSkillMatrixCopyDto,
  ['positionId'] as const,
) {}
