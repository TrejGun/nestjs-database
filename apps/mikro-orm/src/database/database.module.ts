import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule, MikroOrmModuleAsyncOptions } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import type { Options } from "@mikro-orm/postgresql";

import { MikroOrmMigrationProvider } from "./migration.provider";

export type DatabaseModuleForRootOptions = Partial<Options> & { contextName?: string };

@Module({})
export class DatabaseModule {
  static forRootAsync(options: DatabaseModuleForRootOptions): DynamicModule {
    const { contextName, ...rest } = options;

    return {
      module: DatabaseModule,
      imports: [
        MikroOrmModule.forRootAsync({
          contextName,
          imports: [ConfigModule],
          inject: [ConfigService],
          driver: PostgreSqlDriver,
          useFactory: (configService: ConfigService): Partial<Options> => ({
            ...rest,
            clientUrl: configService.get<string>("POSTGRES_URL", "postgres://postgres:password@localhost/postgres"),
          }),
        } as unknown as MikroOrmModuleAsyncOptions),
      ],
      providers: [MikroOrmMigrationProvider],
    };
  }
}
