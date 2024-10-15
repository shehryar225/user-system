import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from 'src/modules/user/entities/user.entity';

config();

const configService = new ConfigService();
console.log(configService.get('DB_HOST'))

export default new DataSource({
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username:"postgres",
  password:"sheryar1234",
  database: "UserSystem",
  entities: [User],
  migrations: [`src/database/migrations/*.ts`],
  migrationsTableName: 'migrations',
});