import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { UserSeedService } from "./user-seed.service";

@Module({
  imports: [DatabaseModule],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
