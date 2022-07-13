import { InterviewEntity } from 'candidates/entity/interview.entity';
import { IAnswer } from 'candidates/services/interview.service';

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

export interface ICompletedInterviewResponse {
  interview: InterviewEntity;
  answers?: IAnswer[];
}

export interface ICompleteSoftInterviewBody {
  candidateId: string;
  hobby?: string;
  comment?: string;
  softSkills: Array<ISoftSkill>;
}

export interface ISoftSkill {
  id: string;
  value: string;
  isActive: boolean;
}

export interface ISoftInterviewResultResponse {
  id: string;
  createdAt: Date;
  hobby: string;
  comment: string;
  skills: Array<{
    id: string;
    isActive: boolean;
    soft_skill_id: { id: string; value: string };
  }>;
}

export const candidateNotFound = 'Candidate not found';
export const softSkillInterviewExist = 'Soft skill interview already exists!';
export const softSkillInterviewNotFound = 'Soft skill interview not found!';
export const softSkillInterviewCantComplete =
  'Soft skill interview cant be complete!';
export const softSkillInterviewCantEdit = 'Soft skill interview cant be edit!';
