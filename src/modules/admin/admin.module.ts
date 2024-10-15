import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { userServices } from '../user/user.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.modules';

@Module({
  imports:[TypeOrmModule.forFeature([User]),
    AuthModule,
    ],
  controllers: [AdminController],
  providers: [AdminService,userServices,AuthGuard],
})
export class AdminModule {}
