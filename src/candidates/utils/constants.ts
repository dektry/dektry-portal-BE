import { InterviewEntity } from 'candidates/entity/interview.entity';

export enum LevelTypesEnum {
  None = 'none',
  Novice = 'novice',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

export const levelTypesPriority: { [key in LevelTypesEnum]: number } = {
  [LevelTypesEnum.None]: 1,
  [LevelTypesEnum.Novice]: 2,
  [LevelTypesEnum.Intermediate]: 3,
  [LevelTypesEnum.Expert]: 4,
};

export interface ICompleteInterview {
  candidateId: string;
  levelId: string;
  positionId: string;
  answers: {
    [key: string]: string;
  };
  comment?: string;
}

export interface IEditInterviewBody extends ICompleteInterview {
  isOffered: boolean;
}

export interface IAnswer {
  skill: string;
  actual: string;
  desired: string;
  id: string;
}

export interface ICompletedInterviewResponse {
  interview: InterviewEntity;
  answers?: IAnswer[];
}

export interface ICompleteSoftInterviewBody {
  candidateId: string;
  positionId?: string;
  levelId?: string;
  hobby?: string;
  comment?: string;
  softSkills: Array<ISoftSkill>;
}

export interface IEditSoftInterviewBody {
  candidateId: string;
  hobby?: string;
  comment?: string;
  softSkills: Array<ISoftSkill>;
}

export interface ISoftSkill {
  id: string;
  value: string;
  softSkillScoreId: string;
  comment: string;
}

export interface ISoftInterviewResultResponse {
  id: string;
  createdAt: Date;
  hobby: string;
  comment: string;
  skills: Array<{
    id: string;
    softSkillScoreId: string;
    comment: string;
    soft_skill_id: { id: string; value: string };
  }>;
}

export const candidateNotFound = 'Candidate not found';
export const interviewIsOver = 'The interview is over!';
export const interviewsNotFound = 'The interviews not found';
export const interviewWasNotDeleted = 'The interview was not deleted';
export const positionNotFound = 'Position not found';
export const levelNotFound = 'Level not found';
export const softSkillInterviewExist = 'Soft skill interview already exists!';
export const softSkillInterviewNotFound = 'Soft skill interview not found!';
export const softSkillInterviewCantComplete =
  'Soft skill interview cant be complete!';
export const softSkillInterviewCantEdit = 'Soft skill interview cant be edit!';
