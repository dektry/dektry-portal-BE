import {MigrationInterface, QueryRunner} from "typeorm";

export class languageTable1666694513234 implements MigrationInterface {
    name = 'languageTable1666694513234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "value" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" ADD "level" character varying(5) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "language" ADD "languageLevel" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" ADD "language" integer NOT NULL`);
    }

}
