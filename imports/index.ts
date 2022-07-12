import importRoles from './roles.import';
import importPermissions from './permissions.import';
import importUsers from './users.import';
import importPositions from './positions.import';
import importCareers from './careers.import';
import importPositionGroup from './positionGroup.import';
import importArticles from './articles.import';
import importProjects from './projects.import';
import importProjectsHistory from './projectsHistory.import';
import importOnBoardingsTemplates from './onBoardingTemplates.import';
import importTasks from './OTTasks.import';
import importVacations from './vacations.import';
import importCareerLevels from './careerLevels.import';
import importSkillGroups from './skillGroups.import';
import importSkills from './skills.import';
import importSkillLevels from './skillLevels.import';
import importSoftSkills from './softSkill.imports';

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
      await importProjects();
      await importProjectsHistory();
      await importTasks();
      await importOnBoardingsTemplates();
      await importVacations();
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

importData();
