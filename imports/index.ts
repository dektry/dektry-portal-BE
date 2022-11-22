import { Logger } from '@nestjs/common';

import importRoles from './roles.import';
import importPermissions from './permissions.import';
import importUsers from './users.import';
import importPositions from './positions.import';
import importCareers from './careers.import';
import importPositionGroup from './positionGroup.import';
import importArticles from './articles.import';
import importOnBoardingsTemplates from './onBoardingTemplates.import';
import importTasks from './OTTasks.import';
import importVacations from './vacations.import';
import importCareerLevels from './careerLevels.import';
import importSkillGroups from './skillGroups.import';
import importSkills from './skills.import';
import importSkillLevels from './skillLevels.import';
import importSoftSkills from './softSkill.imports';
import importSoftSkillsScore from './softSkillScore.import';

const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importPermissions();
      await importPositionGroup();
      await importRoles();
      await importPositions();
      await importCareerLevels();
      await importSkillGroups();
      await importSkills();
      await importSoftSkills();
      await importSkillLevels();
      await importUsers();
      await importCareers();
      await importArticles();
      await importTasks();
      await importOnBoardingsTemplates();
      await importVacations();
      await importSoftSkillsScore();
      break;
    case 'templates':
      await importTasks();
      await importPositionGroup();
      await importOnBoardingsTemplates();
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
