import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentNotifications1776421493163 implements MigrationInterface {
    name = 'AddCommentNotifications1776421493163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_notifications" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "commentId" integer NOT NULL, "meta" jsonb, "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a48e77e54d8bfb0ad4ecc984b5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment_notifications" ADD CONSTRAINT "FK_824719aa43513b1ccfeb366549f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_notifications" ADD CONSTRAINT "FK_ec407cd825b57fae6e894474748" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_notifications" DROP CONSTRAINT "FK_ec407cd825b57fae6e894474748"`);
        await queryRunner.query(`ALTER TABLE "comment_notifications" DROP CONSTRAINT "FK_824719aa43513b1ccfeb366549f"`);
        await queryRunner.query(`DROP TABLE "comment_notifications"`);
    }

}
