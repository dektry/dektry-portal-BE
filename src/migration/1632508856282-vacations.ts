import {MigrationInterface, QueryRunner} from "typeorm";

export class vacations1632508856282 implements MigrationInterface {
    name = 'vacations1632508856282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vacations" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "vacations" ADD "end" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vacations" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "vacations" ADD "end" TIMESTAMP NOT NULL`);
    }

}
