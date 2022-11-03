import {MigrationInterface, QueryRunner} from "typeorm";

export class splitEmployeeNameToFirstAndLast1667466626045 implements MigrationInterface {
    name = 'splitEmployeeNameToFirstAndLast1667466626045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "firstName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "lastName" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "fullName" character varying(255)`);
    }

}
