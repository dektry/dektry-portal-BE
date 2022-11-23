import { Logger } from '@nestjs/common';

import importUsers from './users.import';
import importSkillGroups from './skillGroups.import';
import importSkills from './skills.import';
import importSkillLevels from './skillLevels.import';
import importSoftSkills from './softSkill.imports';
import importSoftSkillsScore from './softSkillScore.import';
import importPositions from './positions.import';

const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importSkillGroups();
      await importSkills();
      await importSoftSkills();
      await importSkillLevels();
      await importUsers();
      await importSoftSkillsScore();
      await importPositions();
      break;
    default:
      console.log(`No import function found for ${target}`);
      break;
  }
};
try {
  importData();
} catch (err) {
  console.error('[ERROR_SEED_RUN]', err);
  Logger.error(err);
}
