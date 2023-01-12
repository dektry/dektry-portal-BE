import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

export function formatSoftAssessments(assessments: SoftAssessmentEntity[]) {
  const sortedAssessments = assessments.sort(
    (a, b) => Number(new Date(a.created)) - Number(new Date(b.created)),
  );

  const intermediateDataStructure = {};
  const tableHead = ['Skill'];
  const tableBody = [];
  for (const el of sortedAssessments) {
    for (const skill of el.skills) {
      const currentGroup = intermediateDataStructure[skill.soft_skill_id.value];
      if (!currentGroup) {
        intermediateDataStructure[skill.soft_skill_id.value] = {
          value: skill.soft_skill_id.value,
          skills: [{ value: skill.soft_skill_id.value, levels: [skill.value] }],
          skillHash: { [skill.soft_skill_id.value]: skill.value },
        };
      } else {
        if (currentGroup.skillHash[skill.soft_skill_id.value]) {
          let skillIndex = -1;
          for (let i = 0; i < currentGroup.skills.length; i++) {
            if (currentGroup.skills[i].value === skill.soft_skill_id.value) {
              skillIndex = i;
            }
          }
          currentGroup.skills[skillIndex].levels.push(skill.value);
        } else {
          currentGroup.skills.push({
            value: skill.soft_skill_id.value,
            levels: [skill.value],
          });
          currentGroup.skillHash[skill.soft_skill_id.value] =
            skill.soft_skill_id.value;
        }
      }
    }

    tableHead.push(new Date(el.created).toLocaleDateString('en-GB'));
  }

  const allSkillGroups = Object.keys(intermediateDataStructure);
  for (const group of allSkillGroups) {
    tableBody.push({
      groupName: group,
      skills: intermediateDataStructure[group].skills.map((skill) => [
        skill.value,
        ...skill.levels,
      ]),
    });
  }

  return { head: tableHead, body: tableBody };
}
