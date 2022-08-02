import { IsOptional, MaxLength } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @MaxLength(255, { message: 'Name is too long' })
  fullName: string;

  @IsOptional()
  @MaxLength(255, { message: 'Position is too long' })
  position: string;

  @IsOptional()
  @MaxLength(40, { message: 'Level is too long' })
  level: string;

  @IsOptional()
  @MaxLength(255, { message: 'Location is too long' })
  location: string;

  // not presented in db yet, but is in UI
  @IsOptional()
  @MaxLength(255, { message: 'Email is too long' })
  email: string;

  @IsOptional()
  @MaxLength(255, { message: 'Personal email is too long' })
  presonalEmail?: null | string;
  
  @IsOptional()
  @MaxLength(255, { message: 'Mobile number is too long' })
  mobileNumber: string;

  @IsOptional()
  @MaxLength(255, { message: 'Date of birth is too long' })
  dateOfBirth: string;

  @IsOptional()
  @MaxLength(255, { message: 'Gender is too long' })
  gender: string;
  
  @IsOptional()
  @MaxLength(1000, { message: 'Avatar URL is too long' })
  avatarUrl: string;

  @IsOptional()
  @MaxLength(255, { message: 'Hired on is too long' })
  hiredOn: string;

  @IsOptional()
  @MaxLength(255, { message: 'Skype username is too long' })
  skypeUsername: string;

  @IsOptional()
  @MaxLength(255, { message: 'Slack username is too long' })
  slackUsername: string;

  @IsOptional()
  @MaxLength(255, { message: 'Twitter username is too long' })
  twitterUsername: string;

  @IsOptional()
  @MaxLength(255, { message: 'Facebook URL is too long' })
  facebookUrl: string;

  @IsOptional()
  @MaxLength(255, { message: 'Linkedin URL is too long' })
  linkedinUrl: string;

  @IsOptional()
  @MaxLength(40, { message: 'Timezone is too long' })
  timezone: string;

  @IsOptional()
  @MaxLength(255, { message: 'Languages is too long' })
  languages: string;

  @IsOptional()
  @MaxLength(255, { message: 'Formal education is too long' })
  formalEducation: string;
}

export class UpdateEmployeeDtoPF {
  @IsOptional()
  @MaxLength(255, { message: 'First name is too long' })
  first_name: string;

  @IsOptional()
  @MaxLength(255, { message: 'Last name is too long' })
  last_name: string;

  @IsOptional()
  @MaxLength(255, { message: 'Email is too long' })
  email: string;

  @IsOptional()
  @MaxLength(255, { message: 'Date of birth is too long' })
  dateOfBirth: string;

  @IsOptional()
  @MaxLength(255, { message: 'Hired on is too long' })
  hiredOn: string;

  @IsOptional()
  @MaxLength(255, { message: 'Gender is too long' })
  gender: string;

  @IsOptional()
  @MaxLength(255, { message: 'Personal email is too long' })
  presonalEmail?: null | string;

  @IsOptional()
  @MaxLength(255, { message: 'Mobile number is too long' })
  mobileNumber: string;
}