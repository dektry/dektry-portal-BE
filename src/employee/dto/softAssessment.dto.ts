import {
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { CareerLevelEntity } from 'users/entity/careerLevel.entity';
import { PositionEntity } from 'users/entity/position.entity';

import { ISoftSkill } from '../utils/constants';

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
export class CompleteSoftInterviewsDto extends EditSoftInterviewsDto {
  @IsOptional()
  position?: PositionEntity;

  @IsOptional()
  level?: CareerLevelEntity;
}
