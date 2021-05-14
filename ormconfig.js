module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrationsTableName: 'migration',
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
  migrationsRun: process.env.RUN_MIGRATIONS,
};
