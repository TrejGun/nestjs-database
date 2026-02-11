import { Module } from "@nestjs/common";

import { PrismaModule } from "../database/prisma.module";
import { TokenService } from "./token.service";

@Module({
  imports: [PrismaModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
