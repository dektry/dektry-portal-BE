import { getRepository, In } from 'typeorm';
import { levelTypesPriority } from './constants';
import { ICompleteInterview } from '../utils/constants';
import { SkillsToLevelsEntity } from 'users/entity/skillsToLevels.entity';
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
