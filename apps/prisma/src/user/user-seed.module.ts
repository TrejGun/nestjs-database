import { Module } from "@nestjs/common";

import { PrismaModule } from "../database/prisma.module";
import { UserSeedService } from "./user-seed.service";

@Module({
  imports: [PrismaModule],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
