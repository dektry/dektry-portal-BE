import { getRepository, In } from 'typeorm';
import {
  InterviewResultColors,
  SkillLevelsOrder,
  SoftSkillsLevelsOrder,
} from '../employee/utils/constants';
import { InterviewAnswers } from '../employee/dto/interviews.dto';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';
import { SoftSkillMatrixGetDetailsDto } from 'users/dto/softSkillMatrix.dto';

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

  private getSoftAnswerColor(assigned: string, required: string) {
    const assignedOrder =
      SoftSkillsLevelsOrder[assigned.replace(/\s/g, '').toLowerCase()];
    const requiredOrder =
      SoftSkillsLevelsOrder[required.replace(/\s/g, '').toLowerCase()];

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

  public getSoftAssessmentAnswers = (
    softAssessment: SoftAssessmentEntity,
    softMatrix: SoftSkillMatrixGetDetailsDto,
  ): InterviewAnswers[] => {
    const answers: InterviewAnswers[] = softAssessment.skills.map(
      (skill: any) => {
        const currentSkill: any = softMatrix.skills.find(
          (item: any) => item.value === skill?.soft_skill_id.value,
        );

        const desiredLevel = currentSkill.levels.find(
          (level) => level.level_id.id === softAssessment.level.id,
        );

        return {
          skill: skill.soft_skill_id.value,
          assigned: skill.value,
          required: desiredLevel.value,
          color: this.getSoftAnswerColor(skill.value, desiredLevel.value),
        };
      },
    );

    return answers;
  };
}
