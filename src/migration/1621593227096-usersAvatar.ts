import {MigrationInterface, QueryRunner} from "typeorm";

export class usersAvatar1621593227096 implements MigrationInterface {
    name = 'usersAvatar1621593227096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarFileName" character varying(255) NOT NULL DEFAULT 'default_admin.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarFileName"`);
    }

}
