import {MigrationInterface, QueryRunner} from "typeorm";

export class onBoardingTemplates1627565061543 implements MigrationInterface {
    name = 'onBoardingTemplates1627565061543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "onBoardingTasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_935a7b7f06c97230a429347fa1f" UNIQUE ("title"), CONSTRAINT "PK_af44ef78b3e382a507c7e657b6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoardingTemplates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "groupId" uuid, CONSTRAINT "UQ_7c0e2c1c622835c05afbcc071bf" UNIQUE ("name"), CONSTRAINT "PK_44efc448ed9969b66c83ed8a38e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoardingGroups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_71800d152fc78a075f121c1e7f9" UNIQUE ("name"), CONSTRAINT "PK_a9f4b8f7efdf1be0424cf63e53d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoarding_templates_tasks" ("onBoardingTemplatesId" uuid NOT NULL, "onBoardingTasksId" uuid NOT NULL, CONSTRAINT "PK_7128876a77c384ea40251e29327" PRIMARY KEY ("onBoardingTemplatesId", "onBoardingTasksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_441b0e9184774cdc1d0a416008" ON "onBoarding_templates_tasks" ("onBoardingTemplatesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dedf4ddd2f56bd6f8c51fd0e9d" ON "onBoarding_templates_tasks" ("onBoardingTasksId") `);
        await queryRunner.query(`CREATE TABLE "onBoarding_templates_write" ("onBoardingTemplatesId" uuid NOT NULL, "positionGroupId" uuid NOT NULL, CONSTRAINT "PK_456cfab683d88015153f4bcf42c" PRIMARY KEY ("onBoardingTemplatesId", "positionGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc2733d5664df5872d7492b6d4" ON "onBoarding_templates_write" ("onBoardingTemplatesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b1fbe17811a587f99ba1623b9a" ON "onBoarding_templates_write" ("positionGroupId") `);
        await queryRunner.query(`CREATE TABLE "onBoarding_templates_read" ("onBoardingTemplatesId" uuid NOT NULL, "positionGroupId" uuid NOT NULL, CONSTRAINT "PK_9325e86230e4d10560460348a8b" PRIMARY KEY ("onBoardingTemplatesId", "positionGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b504831eb92c7d54eded52eadb" ON "onBoarding_templates_read" ("onBoardingTemplatesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33913debccee6072cb177c0953" ON "onBoarding_templates_read" ("positionGroupId") `);
        await queryRunner.query(`ALTER TABLE "onBoardingTemplates" ADD CONSTRAINT "FK_93c7ab1926258231b4d58234ca5" FOREIGN KEY ("groupId") REFERENCES "onBoardingGroups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_tasks" ADD CONSTRAINT "FK_441b0e9184774cdc1d0a416008f" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_tasks" ADD CONSTRAINT "FK_dedf4ddd2f56bd6f8c51fd0e9dc" FOREIGN KEY ("onBoardingTasksId") REFERENCES "onBoardingTasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_cc2733d5664df5872d7492b6d41" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_b1fbe17811a587f99ba1623b9ad" FOREIGN KEY ("positionGroupId") REFERENCES "positionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_b504831eb92c7d54eded52eadba" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_33913debccee6072cb177c09537" FOREIGN KEY ("positionGroupId") REFERENCES "positionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_33913debccee6072cb177c09537"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_b504831eb92c7d54eded52eadba"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_b1fbe17811a587f99ba1623b9ad"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_cc2733d5664df5872d7492b6d41"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_tasks" DROP CONSTRAINT "FK_dedf4ddd2f56bd6f8c51fd0e9dc"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_tasks" DROP CONSTRAINT "FK_441b0e9184774cdc1d0a416008f"`);
        await queryRunner.query(`ALTER TABLE "onBoardingTemplates" DROP CONSTRAINT "FK_93c7ab1926258231b4d58234ca5"`);
        await queryRunner.query(`DROP INDEX "IDX_33913debccee6072cb177c0953"`);
        await queryRunner.query(`DROP INDEX "IDX_b504831eb92c7d54eded52eadb"`);
        await queryRunner.query(`DROP TABLE "onBoarding_templates_read"`);
        await queryRunner.query(`DROP INDEX "IDX_b1fbe17811a587f99ba1623b9a"`);
        await queryRunner.query(`DROP INDEX "IDX_cc2733d5664df5872d7492b6d4"`);
        await queryRunner.query(`DROP TABLE "onBoarding_templates_write"`);
        await queryRunner.query(`DROP INDEX "IDX_dedf4ddd2f56bd6f8c51fd0e9d"`);
        await queryRunner.query(`DROP INDEX "IDX_441b0e9184774cdc1d0a416008"`);
        await queryRunner.query(`DROP TABLE "onBoarding_templates_tasks"`);
        await queryRunner.query(`DROP TABLE "onBoardingGroups"`);
        await queryRunner.query(`DROP TABLE "onBoardingTemplates"`);
        await queryRunner.query(`DROP TABLE "onBoardingTasks"`);
    }

}
