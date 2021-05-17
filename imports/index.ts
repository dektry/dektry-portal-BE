import importPermissions from './permissions.import';
import importRoles from './roles.import';
const importData = async () => {
  const target = process.argv[2];
  switch (target) {
    case 'all':
      await importPermissions();
      await importRoles();
      break;

    case 'permissions':
      await importPermissions();
      break;
    default:
      console.log(`No import function found for ${target}`);
      break;
  }
};

importData();
