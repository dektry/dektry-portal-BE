import { IsNotEmpty, IsOptional } from 'class-validator';

import { languageLevels, languages } from '../utils/constants';

export class LanguageDto {
  @IsOptional()
  id: string;

  @IsNotEmpty({
    message: 'EmployeeId must not be empty',
  })
  employeeId: string;

  @IsNotEmpty({ message: 'Language name must not be empty' })
  language: languages;

  @IsNotEmpty({ message: 'Language level name must not be empty' })
  languageLevel: languageLevels;
}
