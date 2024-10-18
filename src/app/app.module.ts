import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'src/config/config.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.modules';
import { AdminModule } from 'src/modules/admin/admin.module';
import { GoogleStrategy } from 'src/modules/auth/strategies/google.strategy';

@Module({
  imports: [ConfigModule,UserModule, AuthModule,AdminModule],
  controllers: [AppController],
  providers: [AppService,GoogleStrategy],
})
export class AppModule {}
