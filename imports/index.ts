import { Logger } from '@nestjs/common';

import importUsers from './users.import';
import importSkillLevels from './skillLevles.import';

const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importUsers();
      await importSkillLevels();
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
