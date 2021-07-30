import { Migration } from "@mikro-orm/migrations";

import { ns } from "../common/constants";

export class CreateSchema1561991006215 extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  async up(): Promise<void> {
    this.addSql(`create schema ${ns};`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async down(): Promise<void> {
    this.addSql(`drop schema ${ns};`);
  }
}
