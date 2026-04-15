import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsCheckoutInCart1776263454025 implements MigrationInterface {
    name = 'AddedIsCheckoutInCart1776263454025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" RENAME COLUMN "status" TO "isCheckout"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" RENAME COLUMN "isCheckout" TO "status"`);
    }

}
