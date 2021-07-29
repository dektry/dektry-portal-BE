import importRoles from './roles.import';
import importPermissions from './permissions.import';
import importUsers from './users.import';
import importPositions from './positions.import';
import importCareers from './careers.import';
import importPositionGroup from './positionGroup.import';
import importOnBoardingsTemplates from './onBoardingTemplates.import';

const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importPermissions();
      await importPositionGroup();
      await importRoles();
      await importPositions();
      await importUsers();
      await importCareers();
      await importOnBoardingsTemplates();
      break;
    case 'templates':
      await importPositionGroup();
      await importOnBoardingsTemplates();
      break;
    default:
      console.log(`No import function found for ${target}`);
      break;
  }
};

importData();
