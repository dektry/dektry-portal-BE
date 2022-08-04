import {MigrationInterface, QueryRunner} from "typeorm";

export class createEmployeeInterview1659532298473 implements MigrationInterface {
    name = 'createEmployeeInterview1659532298473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee_skill_interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "skill_id" uuid, "interview_id" uuid, CONSTRAINT "PK_5983e342d71a8678b0021104883" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isApproved" boolean, "comment" character varying(512), "employee_id" uuid, "level_id" uuid, "position_id" uuid, CONSTRAINT "REL_f06e46ac47470088d33c7c71ac" UNIQUE ("employee_id"), CONSTRAINT "PK_1e9d5c023e29bbd77b3a8fd7ed8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee_skill_interview" ADD CONSTRAINT "FK_a305c44e6fd7ba7922fcca768cd" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_skill_interview" ADD CONSTRAINT "FK_36e406553f0d3ee17d053f23e59" FOREIGN KEY ("interview_id") REFERENCES "employee_interview"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_interview" ADD CONSTRAINT "FK_f06e46ac47470088d33c7c71ace" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_interview" ADD CONSTRAINT "FK_6f0b61df536d01dfe460967a9f4" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_interview" ADD CONSTRAINT "FK_6bea4afe5e77a057d283b520503" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_interview" DROP CONSTRAINT "FK_6bea4afe5e77a057d283b520503"`);
        await queryRunner.query(`ALTER TABLE "employee_interview" DROP CONSTRAINT "FK_6f0b61df536d01dfe460967a9f4"`);
        await queryRunner.query(`ALTER TABLE "employee_interview" DROP CONSTRAINT "FK_f06e46ac47470088d33c7c71ace"`);
        await queryRunner.query(`ALTER TABLE "employee_skill_interview" DROP CONSTRAINT "FK_36e406553f0d3ee17d053f23e59"`);
        await queryRunner.query(`ALTER TABLE "employee_skill_interview" DROP CONSTRAINT "FK_a305c44e6fd7ba7922fcca768cd"`);
        await queryRunner.query(`DROP TABLE "employee_interview"`);
        await queryRunner.query(`DROP TABLE "employee_skill_interview"`);
    }

}
