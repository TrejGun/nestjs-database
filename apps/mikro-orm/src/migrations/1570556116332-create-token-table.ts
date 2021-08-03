import { Migration } from "@mikro-orm/migrations";

import { ns } from "../common/constants";

export class CreateTokenTable1570556116332 extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async up(): Promise<void> {
    this.addSql(`
      CREATE TYPE ${ns}.token_type_enum AS ENUM (
        'EMAIL',
        'PASSWORD'
      );
    `);

    this.addSql(
      `create table ${ns}.token (
      id serial primary key,
      code varchar not null,
      type ${ns}.token_type_enum not null,
      user_id int not null,
      created_at timestamptz not null default current_timestamp,
      updated_at timestamptz not null default now(),
      foreign key (user_id) references ${ns}.user (id) on delete cascade
      );`,
    );

    this.addSql(`
      CREATE OR REPLACE FUNCTION delete_expired_tokens() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
        BEGIN
          DELETE FROM ${ns}.token WHERE created_at < NOW() - INTERVAL '1 hour';
          RETURN NEW;
        END;
      $$;
    `);

    this.addSql(`
      CREATE TRIGGER delete_expired_tokens_trigger
      AFTER INSERT ON ${ns}.token
      EXECUTE PROCEDURE delete_expired_tokens()
    `);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async down(): Promise<void> {
    this.addSql(`${ns}.token`);
    this.addSql(`DROP TYPE ${ns}.token_type_enum;`);
    this.addSql("DROP FUNCTION delete_expired_tokens();");
  }
}
