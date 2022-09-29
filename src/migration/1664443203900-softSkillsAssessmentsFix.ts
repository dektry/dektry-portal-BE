import {MigrationInterface, QueryRunner} from "typeorm";

export class softSkillsAssessmentsFix1664443203900 implements MigrationInterface {
    name = 'softSkillsAssessmentsFix1664443203900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_dc691af210d561931af10d6e0aa"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568"`);
        await queryRunner.query(`CREATE TABLE "soft_assessment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "comment" character varying(512), "employee_id" uuid, CONSTRAINT "REL_9d8b2057a6196249ceb5fe4369" UNIQUE ("employee_id"), CONSTRAINT "PK_bc14ee5cf7d724c6cccdb1e01c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "UQ_dc691af210d561931af10d6e0aa"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "FK_9d8b2057a6196249ceb5fe43690" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568" FOREIGN KEY ("soft_assessment_id") REFERENCES "soft_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP CONSTRAINT "FK_9d8b2057a6196249ceb5fe43690"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "UQ_dc691af210d561931af10d6e0aa" UNIQUE ("employee_id")`);
        await queryRunner.query(`DROP TABLE "soft_assessment"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568" FOREIGN KEY ("soft_assessment_id") REFERENCES "soft_interview"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_dc691af210d561931af10d6e0aa" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
