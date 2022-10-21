import { IsOptional, MaxLength, IsNotEmpty, IsArray } from 'class-validator';
import {
  descriptionMaxLength,
  employeeTextFieldDefaultMaxLength,
  levelMaxLength,
} from 'employee/utils/constants';

export class UpdateEmployeeDto {
  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, { message: 'Name is too long' })
  fullName: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Position is too long',
  })
  position: string;

  @IsOptional()
  @MaxLength(levelMaxLength, { message: 'Level is too long' })
  level: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Location is too long',
  })
  location: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Email is too long',
  })
  email: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Personal email is too long',
  })
  presonalEmail?: null | string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Mobile number is too long',
  })
  mobileNumber: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Date of birth is too long',
  })
  dateOfBirth: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Gender is too long',
  })
  gender: string;

  @IsOptional()
  @MaxLength(1000, { message: 'Avatar URL is too long' })
  avatarUrl: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Hired on is too long',
  })
  hiredOn: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Skype username is too long',
  })
  skypeUsername: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Slack username is too long',
  })
  slackUsername: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Twitter username is too long',
  })
  twitterUsername: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Facebook URL is too long',
  })
  facebookUrl: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Linkedin URL is too long',
  })
  linkedinUrl: string;

  @IsOptional()
  @MaxLength(40, { message: 'Timezone is too long' })
  timezone: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Languages is too long',
  })
  languages: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Formal education is too long',
  })
  formalEducation: string;

  @IsOptional()
  @MaxLength(descriptionMaxLength, { message: 'Description is too long' })
  description: string;

  @IsNotEmpty({
    message: 'Soft skills to CV must not be empty',
  })
  @IsArray()
  softSkillsToCv: string[];
}

export class UpdateEmployeeDtoPF {
  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'First name is too long',
  })
  first_name: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Last name is too long',
  })
  last_name: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Email is too long',
  })
  email: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Date of birth is too long',
  })
  dateOfBirth: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Hired on is too long',
  })
  hiredOn: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Gender is too long',
  })
  gender: string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Personal email is too long',
  })
  presonalEmail?: null | string;

  @IsOptional()
  @MaxLength(employeeTextFieldDefaultMaxLength, {
    message: 'Mobile number is too long',
  })
  mobileNumber: string;
}
