import { IsNotEmpty, Length } from 'class-validator';

export class SoftSkillDto {
  @IsNotEmpty()
  @Length(2, 20)
  value: string;
}
