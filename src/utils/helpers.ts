import { getRepository, In } from 'typeorm';
import {
  InterviewResultColors,
  SkillLevelsOrder,
} from '../employee/utils/constants';
import { InterviewAnswers } from '../employee/dto/interviews.dto';

export class Helper {
  private getAnswerColor(assigned: string, required: string) {
    const assignedOrder =
      SkillLevelsOrder[assigned.replace(/\s/g, '').toLowerCase()];
    const requiredOrder =
      SkillLevelsOrder[required.replace(/\s/g, '').toLowerCase()];

    return assignedOrder === requiredOrder
      ? InterviewResultColors.WHITE
      : assignedOrder > requiredOrder
      ? InterviewResultColors.GREEN
      : InterviewResultColors.RED;
  }

  public getInterviewAnswers = async (
    interview,
    SkillToInterviewEntity,
    SkillToLevelEntity,
  ): Promise<InterviewAnswers[]> => {
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

    const answers: InterviewAnswers[] = interviewSkills.map((skill: any) => {
      const desiredSkill: any = positionSkills.find(
        (item: any) => item.skill_id.id === skill?.skill_id.id,
      );

      return {
        skill: skill.skill_id.value,
        assigned: skill.value,
        required: desiredSkill.value,
        color: this.getAnswerColor(skill.value, desiredSkill.value),
      };
    });

    return answers;
  };
}
