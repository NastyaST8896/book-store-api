import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIdFromRefresh1770666697588 implements MigrationInterface {
    name = 'RemoveIdFromRefresh1770666697588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "token" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "PK_c31d0a2f38e6e99110df62ab0af" PRIMARY KEY ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "PK_c31d0a2f38e6e99110df62ab0af"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "token" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")`);
    }

}
