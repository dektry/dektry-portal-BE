import {MigrationInterface, QueryRunner} from "typeorm";

export class manyToOneRelationForEmloyeesAndSSI1664523896547 implements MigrationInterface {
    name = 'manyToOneRelationForEmloyeesAndSSI1664523896547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP CONSTRAINT "FK_9d8b2057a6196249ceb5fe43690"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "FK_9d8b2057a6196249ceb5fe43690" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_assessment" DROP CONSTRAINT "FK_9d8b2057a6196249ceb5fe43690"`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "REL_9d8b2057a6196249ceb5fe4369" UNIQUE ("employee_id")`);
        await queryRunner.query(`ALTER TABLE "soft_assessment" ADD CONSTRAINT "FK_9d8b2057a6196249ceb5fe43690" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
