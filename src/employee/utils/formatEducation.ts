import { EducationDto } from '../dto/education.dto';
import { EmployeeEntity } from '../entity/employee.entity';

export function formatEducation(
  education: EducationDto,
  employee: EmployeeEntity,
) {
  const formattedEducation = {
    university: education.university,
    specialization: education.specialization,
    startYear: education.startYear,
    endYear: education.endYear,
    employee,
  };

  const result = education.id
    ? {
        id: education.id,
        ...formattedEducation,
      }
    : formattedEducation;
  return result;
}
