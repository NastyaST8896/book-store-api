import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreateDateColumn1775562791458 implements MigrationInterface {
    name = 'AddCreateDateColumn1775562791458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "createAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createAt"`);
    }

}
