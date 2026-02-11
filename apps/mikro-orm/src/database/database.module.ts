// this is needed by umzug to run *.ts migrations
import "ts-node/register";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

import mikroormconfig from "../mikro-orm.config";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (configService: ConfigService) => {
        return {
          ...mikroormconfig,
          clientUrl: configService.get<string>("POSTGRES_URL", "postgres://postgres:password@localhost/postgres"),
        };
      },
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly orm: MikroORM) {}

  public async configure(): Promise<void> {
    const migrator = this.orm.getMigrator();
    await migrator.up();
  }
}
