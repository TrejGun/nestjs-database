import { Test, TestingModule } from "@nestjs/testing";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { JwtHttpStrategy } from "./strategies";
import { UserModule } from "../user/user.module";
import { AuthEntity } from "./auth.entity";
import { DatabaseModule } from "../database/database.module";
import { EmailModule } from "../email/email.module";
import { TokenModule } from "../token/token.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env",
        }),
        DatabaseModule,
        MikroOrmModule.forFeature([AuthEntity]),
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>("JWT_SECRET_KEY"),
          }),
        }),
        EmailModule,
        TokenModule,
      ],
      providers: [AuthService, JwtHttpStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
