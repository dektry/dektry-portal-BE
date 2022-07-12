import { createConnection, Connection } from 'typeorm';
import { SoftSkillEntity } from '../src/users/entity/softSkill.entity';
import { softSkillsSeed } from './seeds/softSkill.seed';
import { difference } from 'lodash';

const importSoftSkills = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentSoftSkills = await connection
    .getRepository(SoftSkillEntity)
    .find();

  const newSoftSkills = softSkillsSeed.filter((newSoftSkill) => {
    const isSoftSkillExist = currentSoftSkills.some(
      (existSoftSkill) => newSoftSkill.value === existSoftSkill.value,
    );
    return !isSoftSkillExist;
  });
  const alreadyExistedNewSoftSkill = difference(softSkillsSeed, newSoftSkills);
  alreadyExistedNewSoftSkill.forEach((element) => {
    console.log(`Soft skill ${element.value} is already exist!`);
  });

  const сreatedSoftSkills = await connection
    .getRepository(SoftSkillEntity)
    .save(
      newSoftSkills.map((softSkill) => {
        return connection.getRepository(SoftSkillEntity).create(softSkill);
      }),
    );
  console.log(`Added ${сreatedSoftSkills.length} new soft skills!`);
  await connection.close();
};

export default importSoftSkills;
