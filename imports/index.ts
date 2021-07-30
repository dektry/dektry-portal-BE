import importRoles from './roles.import';
import importPermissions from './permissions.import';
import importUsers from './users.import';
import importPositions from './positions.import';
import importCareers from './careers.import';
import importPositionGroup from './positionGroup.import';
import importProjects from './projects.import';

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
      await importProjects();
      break;
    default:
      console.log(`No import function found for ${target}`);
      break;
  }
};

importData();
