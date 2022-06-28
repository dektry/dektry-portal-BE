import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmail1656337089460 implements MigrationInterface {
    name = 'AddEmail1656337089460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "email" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "email"`);
    }

}
