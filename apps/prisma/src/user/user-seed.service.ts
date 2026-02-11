import { Injectable } from "@nestjs/common";
import { User, UserRole, UserStatus } from "@prisma/client";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UserSeedService {
  constructor(private readonly prismaService: PrismaService) {}

  public async setup(): Promise<User> {
    return this.prismaService.user.upsert({
      where: { email: "trejgun@gmail.com" },
      update: {},
      create: {
        firstName: "Trej",
        lastName: "Gun",
        email: "trejgun@gmail.com",
        password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
        roles: [UserRole.ADMIN],
        status: UserStatus.ACTIVE,
      },
    });
  }

  public async teardown(): Promise<void> {
    await this.prismaService.token.deleteMany();
    await this.prismaService.auth.deleteMany();
    await this.prismaService.user.deleteMany();
  }
}
