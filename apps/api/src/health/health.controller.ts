import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaIndicator: PrismaHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Returns the health status of the API and its dependencies.
   * Checks database connectivity and process memory usage.
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'All indicators are healthy' })
  @ApiServiceUnavailableResponse({
    description: 'One or more indicators are unhealthy',
  })
  check() {
    return this.health.check([
      () => this.prismaIndicator.pingCheck('database', this.prisma),
      // Warn if heap exceeds 300 MB
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      // Warn if RSS exceeds 512 MB
      () => this.memory.checkRSS('memory_rss', 512 * 1024 * 1024),
    ]);
  }
}
