import { Logger } from '@nestjs/common';

import importUsers from './users.import';

const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importUsers();
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
