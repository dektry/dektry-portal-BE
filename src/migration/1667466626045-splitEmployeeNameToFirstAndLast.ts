import {MigrationInterface, QueryRunner} from "typeorm";

export class splitEmployeeNameToFirstAndLast1667466626045 implements MigrationInterface {
    name = 'splitEmployeeNameToFirstAndLast1667466626045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_dc691af210d561931af10d6e0aa"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "UQ_dc691af210d561931af10d6e0aa"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "firstName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "lastName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "PK_bc14ee5cf7d724c6cccdb1e01c4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" ADD CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568" FOREIGN KEY ("soft_assessment_id") REFERENCES "soft_assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_16399fff3c5bdaf0287a4a53568"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_assessment" DROP CONSTRAINT "FK_ecbf0f93eb93bc98459985ff408"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP CONSTRAINT "PK_bc14ee5cf7d724c6cccdb1e01c4"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "UQ_dc691af210d561931af10d6e0aa" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "fullName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_dc691af210d561931af10d6e0aa" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
