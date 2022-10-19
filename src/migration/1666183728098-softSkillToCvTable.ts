import { MigrationInterface, QueryRunner } from 'typeorm';

export class softSkillToCvTable1666183728098 implements MigrationInterface {
  name = 'softSkillToCvTable1666183728098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "soft_skill_to_cv" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_6e37bb62b1deb73da09fb4afbb9" UNIQUE ("name"), CONSTRAINT "PK_02bd9647e07376a08db7c93f2f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_soft_skills_to_cv_soft_skill_to_cv" ("employeeId" uuid NOT NULL, "softSkillToCvId" uuid NOT NULL, CONSTRAINT "PK_cc0a6e596b2187bd92bbb811719" PRIMARY KEY ("employeeId", "softSkillToCvId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33feb2f6148ededbb861e6a06b" ON "employee_soft_skills_to_cv_soft_skill_to_cv" ("employeeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a04301911279bbf9474e7afce" ON "employee_soft_skills_to_cv_soft_skill_to_cv" ("softSkillToCvId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_soft_skills_to_cv_soft_skill_to_cv" ADD CONSTRAINT "FK_33feb2f6148ededbb861e6a06be" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_soft_skills_to_cv_soft_skill_to_cv" ADD CONSTRAINT "FK_0a04301911279bbf9474e7afce4" FOREIGN KEY ("softSkillToCvId") REFERENCES "soft_skill_to_cv"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_soft_skills_to_cv_soft_skill_to_cv" DROP CONSTRAINT "FK_0a04301911279bbf9474e7afce4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_soft_skills_to_cv_soft_skill_to_cv" DROP CONSTRAINT "FK_33feb2f6148ededbb861e6a06be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a04301911279bbf9474e7afce"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_33feb2f6148ededbb861e6a06b"`,
    );
    await queryRunner.query(
      `DROP TABLE "employee_soft_skills_to_cv_soft_skill_to_cv"`,
    );
    await queryRunner.query(`DROP TABLE "soft_skill_to_cv"`);
  }
}
