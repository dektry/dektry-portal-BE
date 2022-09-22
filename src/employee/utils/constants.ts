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
}

export interface ISoftSkillQuestion {
  id: string;
  value: string;
}
