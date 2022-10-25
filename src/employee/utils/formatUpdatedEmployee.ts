import { UpdateEmployeeDto } from 'employee/dto/employee.dto';

export function formatUpdatedEmployee(updatedEmployee: UpdateEmployeeDto) {
  return {
    fullName: updatedEmployee.fullName,
    position: updatedEmployee.position,
    level: updatedEmployee.level,
    location: updatedEmployee.location,
    email: updatedEmployee.email,
    mobileNumber: updatedEmployee.mobileNumber,
    dateOfBirth: updatedEmployee.dateOfBirth,
    gender: updatedEmployee.gender,
    avatarUrl: updatedEmployee.avatarUrl,
    hiredOn: updatedEmployee.hiredOn,
    skypeUsername: updatedEmployee.skypeUsername,
    slackUsername: updatedEmployee.slackUsername,
    facebookUrl: updatedEmployee.facebookUrl,
    linkedinUrl: updatedEmployee.linkedinUrl,
    timezone: updatedEmployee.timezone,
    description: updatedEmployee.description,
  };
}
