import { MigrationInterface, QueryRunner } from 'typeorm';

export class softSkillsAssessmentCRUD1664436703538
  implements MigrationInterface
{
  name = 'softSkillsAssessmentCRUD1664436703538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_a137161ef9bd0571eceb6c32b2c"`,
    );
    await queryRunner.query(
      `CREATE TABLE "soft_skill_to_assessment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "softSkillScoreId" character varying, "comment" character varying(512), "soft_skill_id" uuid, "soft_assessment_id" uuid, CONSTRAINT "PK_d7edf5d036eab4be00e437e9a53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_to_soft_skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "soft_skill_id" uuid, CONSTRAINT "PK_bf253e7386ea15144e32815fd20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP CONSTRAINT "REL_a137161ef9bd0571eceb6c32b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP COLUMN "candidate_id"`,
    );
    await queryRunner.query(`ALTER TABLE "soft_interview" DROP COLUMN "hobby"`);
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD "hobby" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD "candidate_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "UQ_a137161ef9bd0571eceb6c32b2c" UNIQUE ("candidate_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD "employee_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "UQ_dc691af210d561931af10d6e0aa" UNIQUE ("employee_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_a137161ef9bd0571eceb6c32b2c" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568" FOREIGN KEY ("soft_assessment_id") REFERENCES "soft_interview"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_dc691af210d561931af10d6e0aa" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_to_soft_skill" ADD CONSTRAINT "FK_9c5622bd1b0c83ef05da23a8f4b" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill_to_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_to_soft_skill" DROP CONSTRAINT "FK_9c5622bd1b0c83ef05da23a8f4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_dc691af210d561931af10d6e0aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_a137161ef9bd0571eceb6c32b2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP CONSTRAINT "UQ_dc691af210d561931af10d6e0aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP COLUMN "employee_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP CONSTRAINT "UQ_a137161ef9bd0571eceb6c32b2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" DROP COLUMN "candidate_id"`,
    );
    await queryRunner.query(`ALTER TABLE "soft_interview" DROP COLUMN "hobby"`);
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD "hobby" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD "candidate_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "REL_a137161ef9bd0571eceb6c32b2" UNIQUE ("candidate_id")`,
    );
    await queryRunner.query(`DROP TABLE "question_to_soft_skill"`);
    await queryRunner.query(`DROP TABLE "soft_skill_to_assessment"`);
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_a137161ef9bd0571eceb6c32b2c" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
