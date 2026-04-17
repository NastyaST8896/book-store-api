import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsRead1776438017682 implements MigrationInterface {
    name = 'AddIsRead1776438017682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_notifications" ADD "isRead" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_notifications" DROP COLUMN "isRead"`);
    }

}
