import {MigrationInterface, QueryRunner} from "typeorm";

export class techAssessmentChanged1663146501650 implements MigrationInterface {
    name = 'techAssessmentChanged1663146501650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_interview" DROP CONSTRAINT "FK_f06e46ac47470088d33c7c71ace"`);
        await queryRunner.query(`ALTER TABLE "employee_interview" DROP CONSTRAINT "REL_f06e46ac47470088d33c7c71ac"`);
        await queryRunner.query(`ALTER TABLE "employee_interview" ADD CONSTRAINT "FK_f06e46ac47470088d33c7c71ace" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_interview" DROP CONSTRAINT "FK_f06e46ac47470088d33c7c71ace"`);
        await queryRunner.query(`ALTER TABLE "employee_interview" ADD CONSTRAINT "REL_f06e46ac47470088d33c7c71ac" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "employee_interview" ADD CONSTRAINT "FK_f06e46ac47470088d33c7c71ace" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
