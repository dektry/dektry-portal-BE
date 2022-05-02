import { getRepository, In } from 'typeorm';
import { levelTypesPriority } from './constants';
import { IAnswer, ICompleteInterview } from '../services/interview.service';
import { SkillsToLevelsEntity } from 'users/entity/skillsToLevels.entity';
import { InterviewEntity } from '../entity/interview.entity';
import { SkillToInterviewEntity } from '../entity/skillToInterview.entity';
import { SkillEntity } from 'users/entity/skill.entity';

export const countReviewResult = async (
  interview: ICompleteInterview,
  filteredSkills: SkillEntity[],
): Promise<number> => {
  const amountForOne = 100 / Object.keys(interview.answers).length;
  let result = 0;

  const skillsLevels = await getRepository(SkillsToLevelsEntity).find({
    where: {
      skill_id: In(Object.keys(interview.answers)),
      level_id: interview.levelId,
    },
    relations: ['skill_id'],
  });

  filteredSkills.map((skill) => {
    const record = skillsLevels.find(
      ({ skill_id }) => skill_id.id === skill.id,
    );
    if (
      levelTypesPriority[interview.answers[skill.id]] >=
      levelTypesPriority[record.value]
    ) {
      result += amountForOne;
    }
  });

  return Math.round(result);
};

export const getInterviewAnswers = async (interview: InterviewEntity) => {
  const interviewSkills = await getRepository(SkillToInterviewEntity).find({
    where: {
      interview_id: interview.id,
    },
    relations: ['skill_id'],
  });
  const positionSkills = await getRepository(SkillsToLevelsEntity).find({
    where: {
      skill_id: In(interviewSkills.map(({ skill_id }) => skill_id.id)),
      level_id: interview.level.id,
    },
    relations: ['skill_id'],
  });

  const answers: IAnswer[] = interviewSkills.map((skill) => {
    const desiredSkill = positionSkills.find(
      (item) => item.skill_id.id === skill.skill_id.id,
    );

    return {
      skill: skill.skill_id.value,
      actual: skill.value,
      desired: desiredSkill.value,
      id: skill.id,
    };
  });
  return answers;
};
