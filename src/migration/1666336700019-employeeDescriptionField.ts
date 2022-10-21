import {MigrationInterface, QueryRunner} from "typeorm";

export class employeeDescriptionField1666336700019 implements MigrationInterface {
    name = 'employeeDescriptionField1666336700019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "description" character varying(1024)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "description"`);
    }

}
