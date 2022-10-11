import { MigrationInterface, QueryRunner } from 'typeorm';

export class hintFieldAddedToSoftSkill1665491080875
  implements MigrationInterface
{
  name = 'hintFieldAddedToSoftSkill1665491080875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "successfullySaved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_skill_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_assessment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "softSkillScoreId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "softSkillScoreId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "comment" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "soft_skill_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "soft_assessment_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill" ADD "hintText" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568" FOREIGN KEY ("soft_assessment_id") REFERENCES "soft_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_question" ADD CONSTRAINT "FK_a176f743828d817ca1103a2236c" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_skill_question" DROP CONSTRAINT "FK_a176f743828d817ca1103a2236c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408"`,
    );
    await queryRunner.query(`ALTER TABLE "soft_skill" DROP COLUMN "hintText"`);
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_assessment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "soft_skill_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP COLUMN "softSkillScoreId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "comment" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "softSkillScoreId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "soft_assessment_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "soft_skill_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD "successfullySaved" boolean`,
    );
  }
}
