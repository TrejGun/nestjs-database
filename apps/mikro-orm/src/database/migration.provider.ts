import { Inject, OnModuleInit } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";

export class MikroOrmMigrationProvider implements OnModuleInit {
  constructor(
    @Inject(MikroORM)
    private readonly orm: MikroORM,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.orm.migrator.up();
  }
}
