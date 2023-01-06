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

class SoftInterviewGrade {
  @IsNotEmpty({
    message: 'skillId must not be empty',
  })
  @Length(36)
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'This is Communication...',
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

export class EditSoftInterviewsDto {
  @IsOptional()
  @MaxLength(255, { message: 'Hobby is too long' })
  hobby?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Comment is too long' })
  comment?: string;

  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({
    message: 'Soft Skills must not be empty',
  })
  @IsArray()
  @ArrayMaxSize(256, { message: 'Array max length exceeded' })
  softSkills: ISoftSkill[];
}
export class CompleteSoftInterviewsDto extends OmitType(CompleteInterviewsDto, [
  'comment',
  'grades',
] as const) {
  @IsArray()
  @ValidateNested()
  @Type(() => SoftInterviewGrade)
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ApiProperty({
    type: SoftInterviewGrade,
    isArray: true,
    description: 'Answers on questions',
    required: true,
  })
  grades: SoftInterviewGrade[];
}

export class GetAllSoftInterviewsDto extends OmitType(GetAllInterviewsDto, [
  'type',
] as const) {}
