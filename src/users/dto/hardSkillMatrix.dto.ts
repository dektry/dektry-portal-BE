import {
  IsNotEmpty,
  Length,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

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

class Skills {
  @IsNotEmpty({
    message: 'SkillName must not be empty',
  })
  @Length(64)
  @ApiProperty({ type: 'string', description: 'Skill name', required: true })
  value: string;

  @ApiProperty({ isArray: true, type: Question })
  questions: Question[];
}

class SkillsGet extends OmitType(Skills, ['questions'] as const) {
  @ApiProperty({ type: 'string' })
  id: string;

  @ApiProperty({ isArray: true, type: QuestionGet })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  questions: QuestionGet[];
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
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  skillGroups: HardSkillMatrix[];
}

export class HardSkillMatrixGetDto {
  @ApiProperty({ type: 'string', description: 'This isHardSkillMatrixId' })
  id: string;

  @ApiProperty({ type: Position })
  position: Position;
}

export class HardSkillMatrixGetDetailsDto extends HardSkillMatrixGetDto {
  @ApiProperty({ isArray: true, type: HardSkillMatrixGet })
  skillGroups: HardSkillMatrixGet[];
}

export class HardSkillMatrixUpdateDto extends PartialType(
  OmitType(HardSkillMatrixGetDetailsDto, ['position'] as const),
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
