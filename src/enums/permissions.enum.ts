export enum Permissions {
  deleteUsers = 'DELETE_USERS',
  createUser = 'CREATE_USER',
  getUser = 'GET_USER',
  getAllUsers = 'GET_ALL_USERS',

  getCareer = 'GET_USER_CAREER',
  createCareer = 'CREATE_CAREER',
  deleteCareer = 'DELETE_CAREER',

  getAllRoles = 'GET_ALL_ROLES',
  getRoleByName = 'GET_ROLE_BY_NAME',
  createRole = 'CREATE_ROLE',
  updateRole = 'UPDATE_ROLE',
  deleteRole = 'DELETE_ROLE',

  getPermissionByName = 'GET_PERMISSION_BY_NAME',
  getAllPermissions = 'GET_ALL_PERMISSIONS',
  createPermission = 'CREATE_PERMISSION',

  getAllPositions = 'GET_ALL_POSITIONS',
  createPosition = 'CREATE_POSITION',
  updatePosition = 'UPDATE_POSITION',
  deletePosition = 'DELETE_POSITION',

  getAllArticles = 'GET_ALL_ARTICLES',
  getArticle = 'GET_ARTICLE',
  updateArticle = 'UPDATE_ARTICLE',
  readArticle = 'READ_ARTICLE',
  workWithOnBoardingTemplates = 'ONBOARDING_TEMPLATES',
}
