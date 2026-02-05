import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFullNameNullable1770296350238 implements MigrationInterface {
    name = 'UserFullNameNullable1770296350238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "fullName" SET NOT NULL`);
    }

}
