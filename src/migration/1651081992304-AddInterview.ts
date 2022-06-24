import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInterview1651081992304 implements MigrationInterface {
  name = 'AddInterview1651081992304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "skill_interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "skill_id" uuid, "interview_id" uuid, CONSTRAINT "PK_5ee3b6182591ce05f00ae7c8391" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "candidate_id" uuid, CONSTRAINT "REL_3aec56b0feb4008c1e63abd3c3" UNIQUE ("candidate_id"), CONSTRAINT "PK_44c49a4feadefa5c6fa78bfb7d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_interview" ADD CONSTRAINT "FK_0419cc8b941242e0500745e020f" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_interview" ADD CONSTRAINT "FK_41b863c04c3994cc329e328309a" FOREIGN KEY ("interview_id") REFERENCES "interview"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "interview" ADD CONSTRAINT "FK_3aec56b0feb4008c1e63abd3c3b" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "interview" DROP CONSTRAINT "FK_3aec56b0feb4008c1e63abd3c3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_interview" DROP CONSTRAINT "FK_41b863c04c3994cc329e328309a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skill_interview" DROP CONSTRAINT "FK_0419cc8b941242e0500745e020f"`,
    );
    await queryRunner.query(`DROP TABLE "interview"`);
    await queryRunner.query(`DROP TABLE "skill_interview"`);
  }
}
