import { MigrationInterface, QueryRunner } from 'typeorm';

export class cleanDb1669121287935 implements MigrationInterface {
  name = 'cleanDb1669121287935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "access" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "article_edit_positions" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "article_read_positions" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "articles" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "careers" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "onBoardingGroups" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "onBoardingOrderedTasks" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "onBoardingTasks" CASCADE`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "onBoardingTemplates" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "onBoarding_templates_read" CASCADE`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "onBoarding_templates_write" CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "positions_access" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vacations" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "roles" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects_history" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
