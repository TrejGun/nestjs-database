import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "../common/constants";

export class CreateTokenTable1570556116332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.token_type_enum AS ENUM (
        'EMAIL',
        'PASSWORD'
      );
    `);

    const table = new Table({
      name: `${ns}.token`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "code",
          type: "varchar",
        },
        {
          name: "type",
          type: `${ns}.token_type_enum`,
        },
        {
          name: "user_id",
          type: "int",
        },
        {
          name: "created_at",
          type: "timestamptz",
        },
        {
          name: "updated_at",
          type: "timestamptz",
        },
      ],
      foreignKeys: [
        {
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.user`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION delete_expired_tokens() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
        BEGIN
          DELETE FROM ${ns}.token WHERE created_at < NOW() - INTERVAL '1 hour';
          RETURN NEW;
        END;
      $$;
    `);

    await queryRunner.query(`
      CREATE TRIGGER delete_expired_tokens_trigger
      AFTER INSERT ON ${ns}.token
      EXECUTE PROCEDURE delete_expired_tokens()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.token`);
    await queryRunner.query(`drop type ${ns}.token_type_enum;`);
    await queryRunner.query("drop function delete_expired_tokens();");
  }
}
