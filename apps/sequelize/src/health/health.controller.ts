import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  SequelizeHealthIndicator,
} from "@nestjs/terminus";

@Controller("/health")
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly db: SequelizeHealthIndicator) {}

  @Get()
  @HealthCheck()
  readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck("database", {
          timeout: 300,
        }),
    ]);
  }
}
