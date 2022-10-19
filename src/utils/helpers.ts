import { getRepository, In } from 'typeorm';
import { IAnswer } from '../candidates/utils/constants';

export class Helper {
  public getInterviewAnswers = async (
    interview,
    SkillToInterviewEntity,
    SkillToLevelEntity,
  ): Promise<IAnswer[]> => {
    const interviewSkills = await getRepository(SkillToInterviewEntity).find({
      where: {
        interview_id: interview?.id,
      },
      relations: ['skill_id'],
    });

    const interviewSkillsIds = interviewSkills.map(
      (skill: any) => skill?.skill_id.id,
    );

    const positionSkills = await getRepository(SkillToLevelEntity).find({
      where: {
        skill_id: In(interviewSkillsIds),
        level_id: interview.level.id,
      },
      relations: ['skill_id'],
    });

    const answers: IAnswer[] = interviewSkills.map((skill: any) => {
      const desiredSkill: any = positionSkills.find(
        (item: any) => item.skill_id.id === skill?.skill_id.id,
      );

      return {
        skill: skill.skill_id.value,
        actual: skill.value,
        desired: desiredSkill.value,
        id: skill.skill_id.id,
      };
    });

    return answers;
  };
}
