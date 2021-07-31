import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";

import { MongoDBStorage, Umzug } from "umzug";
import { ns } from "../common/constants";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URL", "postgres://postgres:password@127.0.0.1/postgres"),
        };
      },
    }),
  ],
})
export class DatabaseModule {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async configure(): Promise<void> {
    const umzug = new Umzug({
      migrations: { glob: "src/migrations/*.ts" },
      context: this.connection,
      logger: console,
      storage: new MongoDBStorage({
        connection: this.connection,
        collectionName: ns,
      }),
    });

    await umzug.up();
  }
}
