import { MigrationInterface, QueryRunner } from 'typeorm';

export class skillLevelsList1675854546860 implements MigrationInterface {
  name = 'skillLevelsList1675854546860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`,
    );
    await queryRunner.query(
      `CREATE TABLE "skill_levels_list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_1e4a829b16a383bd4ad970de854" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`,
    );
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
    await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "skill" ADD "english_skill_group_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`,
    );
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
    await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "skill" ADD "english_skill_group_id" uuid`,
    );
    await queryRunner.query(`DROP TABLE "skill_levels_list"`);
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
