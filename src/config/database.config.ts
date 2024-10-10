// src/config/database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT', '5432')),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Only for development; use migrations for production
});


export const initializeDatabaseConnection = async (configService: ConfigService) => {
  const dbConfig:any = getDatabaseConfig(configService);

  const dataSource = new DataSource(dbConfig);

  try {
    
    await dataSource.initialize();
    console.log('Database connection established successfully.'); 
  } catch (error) {
    console.error('Error connecting to the database:', error); 
    throw error; 
  }
};
