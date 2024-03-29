import {MigrationInterface, QueryRunner} from "typeorm";

export class articles1629800653744 implements MigrationInterface {
    name = 'articles1629800653744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "positions" DROP CONSTRAINT "FK_a4edd0887ce57867532f5c2914a"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_cc2733d5664df5872d7492b6d41"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_b504831eb92c7d54eded52eadba"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_3c28437db9b5137136e1f6d6096" UNIQUE ("title"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "positions_access" ("positionsId" uuid NOT NULL, "accessId" uuid NOT NULL, CONSTRAINT "PK_15021e68dbd613baf1d6ef195cf" PRIMARY KEY ("positionsId", "accessId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79480f874d3ab95574b02d449f" ON "positions_access" ("positionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84a995ca380d8a4f3c8e7d40fa" ON "positions_access" ("accessId") `);
        await queryRunner.query(`CREATE TABLE "article_edit_positions" ("positionsId" uuid NOT NULL, "articlesId" uuid NOT NULL, CONSTRAINT "PK_e547913ed4eb738b271394b6fbb" PRIMARY KEY ("positionsId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7546587c0a633e531d68a08f5f" ON "article_edit_positions" ("positionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd74c51b4c5a44664de35bc627" ON "article_edit_positions" ("articlesId") `);
        await queryRunner.query(`CREATE TABLE "article_read_positions" ("positionsId" uuid NOT NULL, "articlesId" uuid NOT NULL, CONSTRAINT "PK_03dd8c7413e31d806a4619e77b1" PRIMARY KEY ("positionsId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_32784ed06174605483e71c9904" ON "article_read_positions" ("positionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e85306b9ca78bf537cfb2dba8e" ON "article_read_positions" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN "accessId"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_cc2733d5664df5872d7492b6d41" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_b504831eb92c7d54eded52eadba" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions_access" ADD CONSTRAINT "FK_79480f874d3ab95574b02d449fa" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions_access" ADD CONSTRAINT "FK_84a995ca380d8a4f3c8e7d40fa0" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" ADD CONSTRAINT "FK_7546587c0a633e531d68a08f5f0" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" ADD CONSTRAINT "FK_fd74c51b4c5a44664de35bc6274" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" ADD CONSTRAINT "FK_32784ed06174605483e71c99049" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" ADD CONSTRAINT "FK_e85306b9ca78bf537cfb2dba8e0" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" DROP CONSTRAINT "FK_e85306b9ca78bf537cfb2dba8e0"`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" DROP CONSTRAINT "FK_32784ed06174605483e71c99049"`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" DROP CONSTRAINT "FK_fd74c51b4c5a44664de35bc6274"`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" DROP CONSTRAINT "FK_7546587c0a633e531d68a08f5f0"`);
        await queryRunner.query(`ALTER TABLE "positions_access" DROP CONSTRAINT "FK_84a995ca380d8a4f3c8e7d40fa0"`);
        await queryRunner.query(`ALTER TABLE "positions_access" DROP CONSTRAINT "FK_79480f874d3ab95574b02d449fa"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_b504831eb92c7d54eded52eadba"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_cc2733d5664df5872d7492b6d41"`);
        await queryRunner.query(`ALTER TABLE "positions" ADD "accessId" uuid`);
        await queryRunner.query(`DROP INDEX "IDX_e85306b9ca78bf537cfb2dba8e"`);
        await queryRunner.query(`DROP INDEX "IDX_32784ed06174605483e71c9904"`);
        await queryRunner.query(`DROP TABLE "article_read_positions"`);
        await queryRunner.query(`DROP INDEX "IDX_fd74c51b4c5a44664de35bc627"`);
        await queryRunner.query(`DROP INDEX "IDX_7546587c0a633e531d68a08f5f"`);
        await queryRunner.query(`DROP TABLE "article_edit_positions"`);
        await queryRunner.query(`DROP INDEX "IDX_84a995ca380d8a4f3c8e7d40fa"`);
        await queryRunner.query(`DROP INDEX "IDX_79480f874d3ab95574b02d449f"`);
        await queryRunner.query(`DROP TABLE "positions_access"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_b504831eb92c7d54eded52eadba" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_cc2733d5664df5872d7492b6d41" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions" ADD CONSTRAINT "FK_a4edd0887ce57867532f5c2914a" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
