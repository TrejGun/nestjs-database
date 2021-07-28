// this is needed by umzug to run *.ts migrations
import "ts-node/register";

import { Module } from "@nestjs/common";
import { InjectConnection, SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

import { UserModel } from "../user/user.model";

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        host: configService.get<string>("POSTGRES_HOST", "localhost"),
        port: configService.get<number>("POSTGRES_PORT", 5432),
        username: configService.get<string>("POSTGRES_USER", "postgres"),
        password: configService.get<string>("POSTGRES_PASSWORD", "password"),
        database: configService.get<string>("POSTGRES_DB", "secondconnect"),
        models: [UserModel],
      }),
    }),
  ],
})
export class DatabaseModule {
  constructor(
    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  async configure(): Promise<void> {
    const umzug = new Umzug({
      migrations: { glob: "src/migrations/*.ts" },
      context: this.sequelize,
      logger: console,
      storage: new SequelizeStorage({
        sequelize: this.sequelize,
        modelName: "SequelizeMeta",
      }),
    });

    await umzug.up();
  }
}
