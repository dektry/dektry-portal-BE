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
    description: 'Grade name(A1, A2, B1...)',
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

export class CareerLevel {
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

export class Skills {
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

export class SkillsGet extends OmitType(Skills, [
  'questions',
  'grades',
] as const) {
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

class EnglishSkillMatrix {
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
  english_skills: Skills[];
}

class EnglishSkillMatrixGet extends OmitType(EnglishSkillMatrix, [
  'english_skills',
] as const) {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ isArray: true, type: SkillsGet })
  english_skills: SkillsGet[];
}

class englishSkillMatrixGetAssesment extends OmitType(EnglishSkillMatrixGet, [
  'english_skills',
] as const) {
  @ApiProperty({ isArray: true, type: SkillsGetForAssessment })
  english_skills: SkillsGetForAssessment[];
}

class Position {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ type: 'string' })
  name: string;
}

class Level extends Position {}

export class EnglishSkillMatrixCreateDto {
  @IsNotEmpty({
    message: 'PositionId must not be empty',
  })
  @Length(36)
  @ApiProperty({ type: 'string', required: true })
  positionId: string;

  @ApiProperty({ isArray: true, type: EnglishSkillMatrix })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  skillGroups: EnglishSkillMatrix[];
}

export class EnglishSkillMatrixGetDto {
  @ApiProperty({ type: 'string', description: 'This isEnglishSkillMatrixId' })
  id: string;

  @ApiProperty({ type: Position })
  position: Position;
}

export class EnglishSkillMatrixGetForAssessment extends EnglishSkillMatrixGetDto {
  @ApiProperty({ isArray: true, type: englishSkillMatrixGetAssesment })
  skillGroups: englishSkillMatrixGetAssesment[];

  @ApiProperty({ type: 'string' })
  comment: string;

  @ApiProperty({ type: Date })
  created: Date;

  @ApiProperty({ type: Level })
  level: Level;
}

export class EnglishSkillMatrixGetDetailsDto extends EnglishSkillMatrixGetDto {
  @ApiProperty({ isArray: true, type: EnglishSkillMatrixGet })
  englishSkillGroups: EnglishSkillMatrixGet[];
}

export class EnglishSkillMatrixUpdateDto extends PartialType(
  OmitType(EnglishSkillMatrixGetDetailsDto, ['position', 'id'] as const),
) {
  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  positionId: string;
}

export class EnglishSkillMatrixCopyDto {
  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  positionId: string;

  @MaxLength(36)
  @ApiProperty({ type: 'string' })
  englishSkillMatrixId: string;
}

export class EnglishSkillMatrixCopyResponseDto extends OmitType(
  EnglishSkillMatrixCopyDto,
  ['positionId'] as const,
) {}
