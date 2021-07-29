import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import mikroormconfig from "../mikro-orm.config";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...mikroormconfig,
          // keepConnectionAlive: process.env.NODE_ENV === "test",
        };
      },
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly orm: MikroORM) {}

  async configure(): Promise<void> {
    // const generator = this.orm.getSchemaGenerator();
    // const updateDump = await generator.getUpdateSchemaSQL();
    const migrator = this.orm.getMigrator();
    await migrator.up();
  }
}
