import {MigrationInterface, QueryRunner} from "typeorm";

export class employee1659078664623 implements MigrationInterface {
    name = 'employee1659078664623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "avatarUrl" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "avatarUrl" character varying(255)`);
    }

}
