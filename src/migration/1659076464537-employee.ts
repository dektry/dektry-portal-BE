import {MigrationInterface, QueryRunner} from "typeorm";

export class employee1659076464537 implements MigrationInterface {
    name = 'employee1659076464537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "department" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "department"`);
    }

}
