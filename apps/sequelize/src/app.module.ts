import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { JwtGuard, RolesGuard } from "./common/guards";
import { CustomValidationPipe } from "./common/pipes";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
