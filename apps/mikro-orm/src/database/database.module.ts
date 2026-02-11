import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MikroOrmModuleOptions } from "@mikro-orm/nestjs/typings";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

import { MikroOrmMigrationProvider } from "./migration.provider";

@Module({})
export class DatabaseModule {
  static forRootAsync(options: MikroOrmModuleOptions): DynamicModule {
    const { contextName, ...rest } = options;

    return {
      module: DatabaseModule,
      imports: [
        MikroOrmModule.forRootAsync({
          contextName,
          imports: [ConfigModule],
          inject: [ConfigService],
          driver: PostgreSqlDriver,
          useFactory: (configService: ConfigService): MikroOrmModuleOptions => {
            return {
              ...rest,
              clientUrl: configService.get<string>("POSTGRES_URL", "postgres://postgres:password@localhost/postgres"),
            };
          },
        }),
      ],
      providers: [MikroOrmMigrationProvider],
    };
  }
}
