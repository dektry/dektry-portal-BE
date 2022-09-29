import { InterviewEntity } from '../entity/interview.entity';
import { IAnswer } from '../../candidates/utils/constants';

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
}
export interface IEditInterviewBody extends ICompleteInterview {
  comment?: string;
  isApproved: boolean;
}

export const employeeNotFound = 'Employee not found!';

export interface ISoftSkill {
  id: string;
  value: string;
  softSkillScoreId: string;
  comment: string;
  question: string;
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
  softSkills: Array<ISoftSkill>;
}

export interface IEditSoftAssessmentBody {
  employeeId: string;
  comment?: string;
  softSkills: Array<ISoftSkill>;
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
export const softSkillAssessmentCantComplete =
  'Soft skill assessment cant be complete!';
export const softSkillAssessmentCantEdit =
  'Soft skill assessment cant be edit!';
export const softSkillAssessmentExist = 'Soft skill assessment already exists!';
