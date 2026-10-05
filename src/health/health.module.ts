import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller.js';
import shutdownConfig from '../config/shutdown.config.js';

@Module({
  imports: [TerminusModule.forRootAsync(shutdownConfig.asProvider())],
  controllers: [HealthController],
})
export class HealthModule {}
