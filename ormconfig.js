const common =
  process.env.NODE_ENV === 'production'
    ? {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        migrationsRun: process.env.RUN_MIGRATIONS,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        migrationsRun: process.env.RUN_MIGRATIONS,
      };

module.exports = [
  {
    ...common,
    logging: true,
    name: 'default',
    synchronize: false,
    entities: ['dist/src/users/entity/*.entity.js'],
    migrationsTableName: '__migrations',
    migrations: ['dist/src/migration/*.js'],
    cli: {
      migrationsDir: 'src/migration',
    },
  },
  {
    ...common,
    name: 'data-import',
    entities: [`${__dirname}/src/**/*.entity.ts`],
    migrationsTableName: '__migrations',
    migrations: [`${__dirname}/src/migration/*.ts`],
  },
];
