// this is needed by umzug to run *.ts migrations
import "ts-node/register";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import mikroormconfig from "../mikro-orm.config";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...mikroormconfig,
          clientUrl: configService.get<string>("POSTGRES_URL", "postgres://postgres:password@127.0.0.1/postgres"),
          keepConnectionAlive: configService.get<string>("NODE_ENV", "development") === "test",
        };
      },
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly orm: MikroORM) {}

  async configure(): Promise<void> {
    const migrator = this.orm.getMigrator();
    await migrator.up();
  }
}
