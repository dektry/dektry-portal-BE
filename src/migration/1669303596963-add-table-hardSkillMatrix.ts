import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableHardSkillMatrix1669303596963
  implements MigrationInterface
{
  name = 'addTableHardSkillMatrix1669303596963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hardSkillMatrix" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position_id" uuid, CONSTRAINT "REL_0754a55ac6610eb4410c14d7c7" UNIQUE ("position_id"), CONSTRAINT "PK_8a23b1ad98ebc2ac38b8fdb21a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "skillGroup" ADD "hard_skill_matrix_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "hardSkillMatrix" ADD CONSTRAINT "FK_0754a55ac6610eb4410c14d7c74" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "skillGroup" ADD CONSTRAINT "FK_2eedf2b9d03f9b0d140c2832a2b" FOREIGN KEY ("hard_skill_matrix_id") REFERENCES "hardSkillMatrix"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skillGroup" DROP CONSTRAINT "FK_2eedf2b9d03f9b0d140c2832a2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hardSkillMatrix" DROP CONSTRAINT "FK_0754a55ac6610eb4410c14d7c74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "skillGroup" DROP COLUMN "hard_skill_matrix_id"`,
    );
    await queryRunner.query(`DROP TABLE "hardSkillMatrix"`);
    await queryRunner.query(
      `ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_dc691af210d561931af10d6e0aa" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
