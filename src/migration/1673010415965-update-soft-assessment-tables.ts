import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateSoftAssessmentTables1673010415965
  implements MigrationInterface
{
  name = 'updateSoftAssessmentTables1673010415965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" DROP COLUMN "successfullySaved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" DROP COLUMN "comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "softSkillScoreId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "value" character varying(128) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "value" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" DROP COLUMN "updated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" DROP COLUMN "created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" ADD "comment" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" ADD "successfullySaved" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_assessment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" RENAME COLUMN "value" TO "softSkillScoreId"`,
    );
  }
}
