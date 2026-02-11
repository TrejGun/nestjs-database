import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "../database/database.module";
import { UserSeedModule } from "./user-seed.module";
import { UserSeedService } from "./user-seed.service";
import { UserService } from "./user.service";
import { UserModel, UserSchema } from "./user.model";
import { UserRole, UserStatus } from "./interfaces";

describe("UserService", () => {
  let testModule: TestingModule;
  let service: UserService;
  let seedService: UserSeedService;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ".env",
        }),
        DatabaseModule,
        MongooseModule.forFeature([
          {
            name: UserModel.name,
            schema: UserSchema,
          },
        ]),
        UserSeedModule,
      ],
      providers: [UserService],
    }).compile();

    service = testModule.get<UserService>(UserService);
    seedService = testModule.get<UserSeedService>(UserSeedService);

    await seedService.setup();
  });

  afterAll(async () => {
    await seedService.teardown();
    await testModule.close();
  });

  it("should find one user", async () => {
    const userEntity = await service.findOne({ email: "trejgun@gmail.com" });

    expect(userEntity).toBeDefined();
    expect(userEntity!.firstName).toBe("Trej");
    expect(userEntity!.lastName).toBe("Gun");
    expect(userEntity!.email).toBe("trejgun@gmail.com");
    expect(userEntity!.roles).toContain(UserRole.ADMIN);
    expect(userEntity!.status).toBe(UserStatus.ACTIVE);
  });

  it("should find all users", async () => {
    const [rows, count] = await service.findAndCount();

    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(rows.length).toBe(count);
  });

  it("should create user", async () => {
    const email = "test-create@example.com";

    const userEntity = await service.create({
      firstName: "Test",
      lastName: "User",
      email,
      password: "TestPassword123",
    });

    expect(userEntity).toBeDefined();
    expect(userEntity.email).toBe(email);
    expect(userEntity.firstName).toBe("Test");
    expect(userEntity.lastName).toBe("User");
  });
});
