import { Controller, Get } from '@nestjs/common';

import {
  HealthCheck,
  HealthCheckService,
  MikroOrmHealthIndicator,
  type HealthCheckResult,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MikroOrmHealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  live(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  ready(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db
        .pingCheck('database')
        .withTimeout(1000),
    ]);
  }
}
