import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailableCount1774357827571 implements MigrationInterface {
    name = 'AddAvailableCount1774357827571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "availableCount" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "availableCount"`);
    }

}
