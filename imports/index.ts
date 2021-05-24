import importRoles from './roles.import';
import importPermissions from './permissions.import';
import importUsers from './users.import';
import importPositions from './positions.import';

const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importPermissions();
      await importRoles();
      await importPositions();
      await importUsers();
      break;
    case 'roles':
      await importPermissions();
      await importRoles();
      break;
    case 'users':
      await importRoles();
      break;
    default:
      console.log(`No import function found for ${target}`);
      break;
  }
};

importData();
