import { UpdateEmployeeDto } from 'employee/dto/employee.dto';

export function formatUpdatedEmployee(updatedEmployee: UpdateEmployeeDto) {
  return {
    firstName: updatedEmployee.firstName,
    lastName: updatedEmployee.lastName,
    position: updatedEmployee.position,
    level: updatedEmployee.level,
    location: updatedEmployee.location,
    email: updatedEmployee.email,
    personalEmail: updatedEmployee.personalEmail || null,
    mobileNumber: updatedEmployee.mobileNumber,
    dateOfBirth: updatedEmployee.dateOfBirth,
    gender: updatedEmployee.gender,
    avatarUrl: updatedEmployee.avatarUrl,
    hiredOn: updatedEmployee.hiredOn,
    skypeUsername: updatedEmployee.skypeUsername,
    slackUsername: updatedEmployee.slackUsername,
    facebookUrl: updatedEmployee.facebookUrl,
    linkedinUrl: updatedEmployee.linkedinUrl,
    twitterUsername: updatedEmployee.twitterUsername,
    timezone: updatedEmployee.timezone,
    description: updatedEmployee.description,
    yearsOfExperience: updatedEmployee.yearsOfExperience,
  };
}
