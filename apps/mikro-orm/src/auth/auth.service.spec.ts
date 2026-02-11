import { Test, TestingModule } from "@nestjs/testing";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";

import mikroormconfig from "../mikro-orm.config";
import { DatabaseModule } from "../database/database.module";
import { UserSeedModule } from "../user/user-seed.module";
import { UserSeedService } from "../user/user-seed.service";
import { AuthService } from "./auth.service";
import { JwtHttpStrategy } from "./strategies";
import { UserModule } from "../user/user.module";
import { AuthEntity } from "./auth.entity";
import { EmailModule } from "../email/email.module";
import { TokenModule } from "../token/token.module";

describe("AuthService", () => {
  let testModule: TestingModule;
  let service: AuthService;
  let seedService: UserSeedService;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env",
        }),
        DatabaseModule.forRootAsync({ ...mikroormconfig, allowGlobalContext: true }),
        MikroOrmModule.forFeature([AuthEntity]),
        UserSeedModule,
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

    service = testModule.get<AuthService>(AuthService);
    seedService = testModule.get<UserSeedService>(UserSeedService);

    await seedService.setup();
  });

  afterAll(async () => {
    await seedService.teardown();
    await testModule.close();
  });

  it("should signup", async () => {
    const userEntity = await service.signup({
      firstName: "Test",
      lastName: "Gun",
      email: "test-signup@example.com",
      password: "TestPassword123",
    });

    expect(userEntity).toBeDefined();
    expect(userEntity.email).toBe("test-signup@example.com");
    expect(userEntity.firstName).toBe("Test");
    expect(userEntity.lastName).toBe("Gun");
  });

  it("should login", async () => {
    const jwt = await service.login({
      email: "trejgun@gmail.com",
      password: "My5up3r5tr0ngP@55w0rd",
    });

    expect(jwt).toBeDefined();
    expect(jwt.accessToken).toBeDefined();
    expect(jwt.refreshToken).toBeDefined();
    expect(jwt.accessTokenExpiresAt).toBeDefined();
    expect(jwt.refreshTokenExpiresAt).toBeDefined();
    expect(typeof jwt.accessToken).toBe("string");
    expect(typeof jwt.refreshToken).toBe("string");
    expect(typeof jwt.accessTokenExpiresAt).toBe("number");
    expect(typeof jwt.refreshTokenExpiresAt).toBe("number");
  });

  it("should refresh", async () => {
    const loginJwt = await service.login({
      email: "trejgun@gmail.com",
      password: "My5up3r5tr0ngP@55w0rd",
    });

    const refreshJwt = await service.refresh({
      refreshToken: loginJwt.refreshToken,
    });

    expect(refreshJwt).toBeDefined();
    expect(refreshJwt.accessToken).toBeDefined();
    expect(refreshJwt.refreshToken).toBeDefined();
    expect(refreshJwt.refreshToken).not.toBe(loginJwt.refreshToken);
  });

  it("should logout", async () => {
    const loginJwt = await service.login({
      email: "trejgun@gmail.com",
      password: "My5up3r5tr0ngP@55w0rd",
    });

    await service.logout({ refreshToken: loginJwt.refreshToken });

    await expect(service.refresh({ refreshToken: loginJwt.refreshToken })).rejects.toThrow(UnauthorizedException);
  });
});
