import {MigrationInterface, QueryRunner} from "typeorm";

export class userDefaultBalance1634053432562 implements MigrationInterface {
    name = 'userDefaultBalance1634053432562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "balance" SET DEFAULT '160'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "balance" DROP DEFAULT`);
    }

}
