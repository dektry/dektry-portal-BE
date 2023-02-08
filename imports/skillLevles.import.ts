import { createConnection, Connection } from 'typeorm';

import { SkillLevelsListEntity } from '../src/users/entity/skillLevelsList.entity';
import { skillLevelsSeed } from './seeds/skillLevels.seed';

const importSkillLevels = async () => {
  const connection: Connection = await createConnection('data-import');
  const skillLevelsRepo = connection.getRepository(SkillLevelsListEntity);
  const skillLevels = await skillLevelsRepo.find();

  const newLevels = skillLevelsSeed.filter(
    (level) =>
      !skillLevels.some((levelExist) => level.name === levelExist.name),
  );

  for (const level of newLevels) {
    await skillLevelsRepo.save(skillLevelsRepo.create(level));
  }

  console.log(`Skill levels has been imported!`);
  await connection.close();
};

export default importSkillLevels;
