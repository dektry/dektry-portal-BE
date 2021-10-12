import {MigrationInterface, QueryRunner} from "typeorm";

export class vacations1632755891318 implements MigrationInterface {
    name = 'vacations1632755891318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vacations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "policy" character varying NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying NOT NULL, "reason" text NOT NULL, "userId" uuid, CONSTRAINT "PK_830973008a9b7e114e612442750" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "balance" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vacations" ADD CONSTRAINT "FK_89640b2dfe9d14d229c6943626f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vacations" DROP CONSTRAINT "FK_89640b2dfe9d14d229c6943626f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
        await queryRunner.query(`DROP TABLE "vacations"`);
    }

}
