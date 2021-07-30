import { Migration } from "@mikro-orm/migrations";

import { ns } from "../common/constants";

export class SeedUserTable1563804021014 extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async up(): Promise<void> {
    this.addSql(`
      insert into ${ns}.user (
        first_name,
        last_name,
        email,
        password,
        roles,
        status
      ) values (
        'Trej',
        'Gun',
        'trejgun@gmail.com',
        '92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff', -- My5up3r5tr0ngP@55w0rd
        '{ADMIN}',
        'ACTIVE'
      );
    `);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async down(): Promise<void> {
    this.addSql(`truncate table ${ns}.user restart identity cascade;`);
  }
}
