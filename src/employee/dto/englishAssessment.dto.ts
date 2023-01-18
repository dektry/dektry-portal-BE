import {
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsArray,
  Length,
  ArrayMinSize,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  OmitType,
  PartialType,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { CompleteInterviewsDto, GetAllInterviewsDto } from './interviews.dto';

import { ISoftSkill } from '../utils/constants';

class EnglishInterviewGrade {
  @IsNotEmpty({
    message: 'skillId must not be empty',
  })
  @Length(36)
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is Vocabulary...',
  })
  skillId: string;

  @IsNotEmpty({
    message: 'Grade value must not be empty',
  })
  @MaxLength(61, { message: 'value is too long' })
  @ApiProperty({
    type: 'string',
    description: 'Grade name(A1, A, B...)',
    required: true,
  })
  value: string;

  @IsOptional()
  @MaxLength(512, { message: 'Comment is too long' })
  @ApiPropertyOptional({
    type: 'string',
    description: 'This is Total commonet for skill section',
  })
  comment?: string;
}

class EnglishInterviewGradeEditDto extends EnglishInterviewGrade {
  @IsNotEmpty({
    message: 'gradeId must not be empty',
  })
  @Length(36)
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is id for A1, A2...',
  })
  gradeId: string;
}

export class CompleteSoftInterviewsDto extends OmitType(CompleteInterviewsDto, [
  'comment',
  'grades',
] as const) {
  @IsArray()
  @ValidateNested()
  @Type(() => EnglishInterviewGrade)
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ApiProperty({
    type: EnglishInterviewGrade,
    isArray: true,
    description: 'Answers on questions',
    required: true,
  })
  grades: EnglishInterviewGrade[];
}

export class EditSoftInterviewDto extends OmitType(CompleteSoftInterviewsDto, [
  'grades',
] as const) {
  @IsArray()
  @ValidateNested()
  @Type(() => EnglishInterviewGradeEditDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ApiProperty({
    type: EnglishInterviewGradeEditDto,
    isArray: true,
    description: 'Answers on questions',
    required: true,
  })
  grades: EnglishInterviewGradeEditDto[];
}

export class GetAllEnglishInterviewsDto extends OmitType(GetAllInterviewsDto, [
  'type',
] as const) {}
