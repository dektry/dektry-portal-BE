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
};


export const candidateNotFound = 'Candidate not found';
