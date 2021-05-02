module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'check',
  synchronize: true,
  autoLoadEntities: true,
  // migrationsTableName: 'custom_migration_table',
  // migrations: ['./migration/*.ts'],
  // cli: {
  //   migrationsDir: 'migration',
  // },
  // migrationsRun: true,
};
