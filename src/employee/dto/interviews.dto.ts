import {
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsArray,
  Length,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  OmitType,
  PartialType,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Grade } from '../../users/dto/hardSkillMatrix.dto';
import { InterviewResultColors } from '../utils/constants';

class InterviewGrade extends OmitType(Grade, ['levelId'] as const) {
  @IsNotEmpty({
    message: 'skillId must not be empty',
  })
  @Length(36)
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is React, NestJs...',
  })
  skillId: string;
}

class InterviewGradeEditDto extends InterviewGrade {
  @IsNotEmpty({
    message: 'gradeId must not be empty',
  })
  @Length(36)
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is id for None, Basic...',
  })
  gradeId: string;
}

export class InterviewAnswers {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is React, NestJs...',
  })
  skill: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Novice, Expert... (Selected during the assessment)',
  })
  assigned: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Novice, Expert... ( Selected during matrix creation)',
  })
  required: string;

  @ApiProperty({
    enum: InterviewResultColors,
    required: true,
    description: 'Background color for table row',
  })
  color: InterviewResultColors;
}

export class CompleteInterviewsDto {
  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  @MaxLength(36, { message: 'employeeId is too long' })
  @ApiProperty({ type: 'string', required: true })
  employeeId: string;

  @IsNotEmpty({
    message: 'PositionId must not be empty',
  })
  @MaxLength(36, { message: 'positionId is too long' })
  @ApiProperty({
    type: 'string',
    description: 'Means Full-stack, Front-end..',
    required: true,
  })
  positionId: string;

  @IsNotEmpty({
    message: 'LevelId must not be empty',
  })
  @MaxLength(36, { message: 'levelId is too long' })
  @ApiProperty({
    type: 'string',
    description: 'Means Junior, Middle..',
    required: true,
  })
  levelId: string;

  @IsArray()
  @ValidateNested()
  @Type(() => InterviewGrade)
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ApiProperty({
    type: InterviewGrade,
    isArray: true,
    description: 'Answers on questions',
    required: true,
  })
  grades: InterviewGrade[];

  @IsOptional()
  @MaxLength(512, { message: 'Comment is too long' })
  @ApiPropertyOptional({ type: 'string' })
  comment?: string;
}

export class EditInterviewDto extends OmitType(CompleteInterviewsDto, [
  'grades',
] as const) {
  @IsArray()
  @ValidateNested()
  @Type(() => InterviewGradeEditDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ApiProperty({
    type: InterviewGradeEditDto,
    isArray: true,
    description: 'Answers on questions',
    required: true,
  })
  grades: InterviewGradeEditDto[];
}

export class InterviewResultDto {
  @ApiProperty({
    type: Date,
    description: 'Assessment pass date',
    required: true,
  })
  created: Date;

  @ApiProperty({
    type: 'string',
    description: 'Full-stack, Front-end...',
    required: true,
  })
  position: string;

  @ApiProperty({
    type: 'string',
    description: 'Itern, Junior, Middle...',
    required: true,
  })
  level: string;

  @ApiProperty({
    isArray: true,
    type: InterviewAnswers,
    description: 'Assessment answers for table result',
    required: true,
  })
  answers: InterviewAnswers[];
}

export class GetAllInterviewsDto extends OmitType(InterviewResultDto, [
  'answers',
] as const) {
  @ApiProperty({
    type: Date,
    description: 'Assessment edited date',
    required: true,
  })
  updated: Date;

  @ApiProperty({
    type: 'string',
    description: 'Assessment',
    required: true,
  })
  type: string;

  @ApiProperty({
    type: 'string',
    description: 'Assessment for result row',
    required: true,
  })
  id: string;
}

export class EditInterviewsDto extends CompleteInterviewsDto {
  @IsOptional()
  isApproved: boolean;
}
