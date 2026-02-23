import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLikesRelation1771855782998 implements MigrationInterface {
    name = 'AddUserLikesRelation1771855782998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_book_likes" ("userId" integer NOT NULL, "bookId" integer NOT NULL, CONSTRAINT "PK_246c12f0980b0d61e95e469d7ce" PRIMARY KEY ("userId", "bookId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b9219874c36b166de1d0f83097" ON "user_book_likes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_81baa407b2c30fc287e29c7426" ON "user_book_likes" ("bookId") `);
        await queryRunner.query(`ALTER TABLE "user_book_likes" ADD CONSTRAINT "FK_b9219874c36b166de1d0f830976" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_book_likes" ADD CONSTRAINT "FK_81baa407b2c30fc287e29c7426e" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book_likes" DROP CONSTRAINT "FK_81baa407b2c30fc287e29c7426e"`);
        await queryRunner.query(`ALTER TABLE "user_book_likes" DROP CONSTRAINT "FK_b9219874c36b166de1d0f830976"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_81baa407b2c30fc287e29c7426"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9219874c36b166de1d0f83097"`);
        await queryRunner.query(`DROP TABLE "user_book_likes"`);
    }

}
