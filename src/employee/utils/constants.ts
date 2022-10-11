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

export const employeeNotFound = 'Employee not found!';

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
  id: string;
  createdAt: Date;
  comment: string;
  skills: ISoftSkill[];
}

export const softSkillAssessmentNotFound = 'Soft skill assessment not found!';
export const softSkillAssessmentsNotFound = 'Soft skill assessments not found!';
export const softSkillAssessmentCantComplete =
  'Soft skill assessment cant be complete!';
export const softSkillAssessmentCantEdit =
  'Soft skill assessment cant be edit!';
export const softSkillAssessmentExist = 'Soft skill assessment already exists!';
export const positionNotFound = 'Position not found!';
export const levelNotFound = 'Level not found!';
