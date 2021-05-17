const common = {
  name: 'data-import',
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
};

module.exports = [
  {
    ...common,
    name: 'default',
    synchronize: false,
    entities: ['dist/src/users/entity/*.entity.js'],
    migrationsTableName: '__migrations',
    migrations: ['dist/src/migration/*.js'],
    cli: {
      migrationsDir: 'src/migration',
    },
    migrationsRun: process.env.RUN_MIGRATIONS,
  },
  {
    ...common,
    entities: [`${__dirname}/src/**/*.entity.ts`],
  },
];
