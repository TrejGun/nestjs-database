import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { RedisHealthModule } from "@liaoliaots/nestjs-redis-health";

import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule, RedisHealthModule],
  controllers: [HealthController],
})
export class HealthModule {}
