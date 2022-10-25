import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { InterviewEntity } from './interview.entity';
import { ProjectEntity } from './project.entity';
import { SoftAssessmentEntity } from './softAssessment.entity';
import { SoftSkillToCvEntity } from './softSkillToCV.entity';
import { EducationEntity } from './education.entity';
import { LanguageEntity } from './language.entity';

@Entity({ name: 'employee' })
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  pfId: number;

  @Column({ nullable: true })
  pfUpdatedAt: string;

  @Column({ length: 255, nullable: true })
  fullName: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  personalEmail: string;

  @Column({ length: 255, nullable: true })
  mobileNumber: string;

  @Column({ length: 255, nullable: true })
  dateOfBirth: string;

  @Column({ length: 255, nullable: true })
  gender: string;

  @Column({ length: 1000, nullable: true })
  avatarUrl: string;

  @Column({ length: 255, nullable: true })
  hiredOn: string;

  @Column({ length: 255, nullable: true })
  skypeUsername: string;

  @Column({ length: 255, nullable: true })
  slackUsername: string;

  @Column({ length: 255, nullable: true })
  twitterUsername: string;

  @Column({ length: 255, nullable: true })
  facebookUrl: string;

  @Column({ length: 255, nullable: true })
  linkedinUrl: string;

  @Column({ length: 255, nullable: true })
  position: string;

  @Column({ length: 255, nullable: true })
  level: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ length: 255, nullable: true })
  division: string;

  @Column({ length: 40, nullable: true })
  timezone: string;

  @Column({ length: 1024, nullable: true })
  description: string;

  // The date from which the employee's work experience is calculated
  @Column({ type: 'timestamp', nullable: true })
  startingPoint: string;

  @Column({ type: 'json', nullable: true })
  interests: string;

  @Column({ type: 'json', nullable: true })
  department: string;

  @OneToMany(() => InterviewEntity, (interview) => interview.employee)
  interview: InterviewEntity;

  @OneToMany(() => ProjectEntity, (project) => project.employee)
  projects: ProjectEntity[];

  @OneToMany(
    () => SoftAssessmentEntity,
    (softAssessment) => softAssessment.employee,
  )
  softAssessment: SoftAssessmentEntity;

  @ManyToMany(() => SoftSkillToCvEntity, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  softSkillsToCv: SoftSkillToCvEntity[];

  @OneToMany(() => EducationEntity, (education) => education.employee)
  education: EducationEntity;

  @OneToMany(() => LanguageEntity, (language) => language.employee)
  languages: LanguageEntity[];
}
