import { InterviewEntity } from '../entity/interview.entity';
import { IAnswer } from '../../candidates/utils/constants';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

export interface ICompletedInterviewResponse {
  interview: InterviewEntity;
  answers?: IAnswer[];
}
export interface IDeletedInterviewResponse {
  answer: string;
}
export interface ICompleteInterview {
  employeeId: string;
  levelId: string;
  positionId: string;
  answers: {
    [key: string]: string;
  };
  comment?: string;
}
export interface IEditInterviewBody extends ICompleteInterview {
  isApproved: boolean;
}

export interface ISoftSkillQuestion {
  id: string;
  value: string;
}

export interface ICompletedInterviewResponse {
  interview: InterviewEntity;
  answers?: IAnswer[];
}

export interface ICompleteSoftAssessmentBody {
  employeeId: string;
  positionId?: string;
  levelId?: string;
  comment?: string;
  softSkills: ISoftSkill[];
}

export interface IEditSoftAssessmentBody {
  id: string;
  employeeId: string;
  comment?: string;
  softSkills: ISoftSkill[];
}

export interface ISoftSkill {
  id: string;
  value: string;
  softSkillScoreId: string;
  comment: string;
  questions?: Array<{ id: string; value: string }>;
  soft_skill_id: { id: string; value: string };
}

export interface ISoftAssessmentResultResponse {
  assessment: SoftAssessmentEntity;
  questions: ISoftSkillQuestion[];
}

export interface ISoftAssessment {
  id: string;
  createdAt: Date;
  comment: string;
  skills: ISoftSkill[];
}

export interface ITechnology {
  id?: string;
  name: string;
}

export const employeeNotFound = 'Employee not found!';
export const employeeCantBeSaved = 'Employee can not be saved!';

export const techAssessmentCantBeSaved =
  'Technical assessment can not be saved';
export const techAssessmentIsNotFound = 'Technical assessment is not found';
export const softSkillAssessmentNotFound = 'Soft skill assessment not found!';
export const softSkillAssessmentsNotFound = 'Soft skill assessments not found!';
export const softSkillAssessmentCantComplete =
  'Soft skill assessment cant be complete!';
export const softSkillAssessmentCantEdit =
  'Soft skill assessment cant be edit!';
export const softSkillAssessmentExist = 'Soft skill assessment already exists!';
export const positionNotFound = 'Position not found!';
export const levelNotFound = 'Level not found!';

export const projectCantBeSaved = 'Project can not be saved!';
export const projectNotFound = 'Project is not found!';
export const projectsNotFound = 'Projects are not found!';
export const cantDeleteProject = 'Can not delete project!';

export const technologyNotFound = 'Technology is not found!';

export const softSkillToCvNotFound = 'Soft skill not found!';
export const softSkillsToCvCantBeCreated = 'Soft skills can not be created';

export const descriptionMaxLength = 1024;
export const employeeTextFieldDefaultMaxLength = 255;
export const levelMaxLength = 40;
