import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service.js';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import mikroOrmConfig from './mikro-orm.config.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...mikroOrmConfig,
        clientUrl: config.getOrThrow<string>('DATABASE_URL'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
