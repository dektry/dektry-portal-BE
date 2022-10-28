import { MigrationInterface, QueryRunner } from 'typeorm';

export class creatSoftSkillScoreTable1662556662132
  implements MigrationInterface
{
  name = 'creatSoftSkillScoreTable1662556662132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "soft_skill_score" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL DEFAULT '', "value" character varying NOT NULL DEFAULT '', "title" character varying(512) NOT NULL DEFAULT '', CONSTRAINT "PK_3c78c7492cecaffdea04ea041f2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "soft_skill_score"`);
  }
}
