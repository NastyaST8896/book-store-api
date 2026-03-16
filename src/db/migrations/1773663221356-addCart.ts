import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCart1773663221356 implements MigrationInterface {
    name = 'AddCart1773663221356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" DROP CONSTRAINT "FK_caefc6f57fbf8afae4dd78affc4"`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" RENAME COLUMN "userId" TO "cartId"`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "status" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "unique-active-cart" ON "cart" ("userId") WHERE "status" = false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "cartId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa" UNIQUE ("cartId")`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" ADD CONSTRAINT "FK_ada53dc358494d70879b27f3bc5" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" DROP CONSTRAINT "FK_ada53dc358494d70879b27f3bc5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cartId"`);
        await queryRunner.query(`DROP INDEX "public"."unique-active-cart"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" RENAME COLUMN "cartId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" ADD CONSTRAINT "FK_caefc6f57fbf8afae4dd78affc4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
