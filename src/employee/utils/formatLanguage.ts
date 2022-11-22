import { LanguageDto } from '../dto/language.dto';
import { EmployeeEntity } from 'employee/entity/employee.entity';

export function formatLanguage(
  language: LanguageDto,
  employee: EmployeeEntity,
) {
  const formattedLanguage = {
    value: language.value,
    level: language.level,
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
