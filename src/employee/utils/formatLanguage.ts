import { LanguageDto } from '../dto/language.dto';
import { EmployeeEntity } from 'employee/entity/employee.entity';

export function formatLanguage(
  language: LanguageDto,
  employee: EmployeeEntity,
) {
  const formattedLanguage = {
    language: language.language,
    languageLevel: language.languageLevel,
    employee,
  };

  const result = language.id
    ? {
        id: language.id,
        ...formattedLanguage,
      }
    : formattedLanguage;
  return result;
}
