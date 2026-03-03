import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookDescription1772550012117 implements MigrationInterface {
    name = 'AddBookDescription1772550012117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "description"`);
    }

}
