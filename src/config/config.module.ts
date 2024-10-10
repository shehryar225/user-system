// src/config/config.module.ts

import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig, initializeDatabaseConnection } from './database.config';
import { ConfigService } from '@nestjs/config'; 

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
  ],
})
export class ConfigModule implements OnModuleInit {
  constructor(private configService: ConfigService) {} // Make sure ConfigService is available here

  async onModuleInit() {
   
    await initializeDatabaseConnection(this.configService);
  }
}
