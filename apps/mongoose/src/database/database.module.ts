// this is needed by umzug to run *.ts migrations
import "ts-node/register";

import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InjectConnection, MongooseModule } from "@nestjs/mongoose";
import * as os from "node:os";
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
          uri: configService.get<string>("MONGO_URL", "mongodb://localhost:27017"),
          // mongodb 7.6 loads `os` via import(); Jest ESM swallows that and the
          // handshake is sent without the required `driver` metadata field.
          runtimeAdapters: { os },
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  public async onModuleInit(): Promise<void> {
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
