import { MigrationInterface, QueryRunner } from "typeorm";

export class User1729171694396 implements MigrationInterface {
    name = 'User1729171694396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password_update_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password_update_at" TIMESTAMP`);
    }

}
