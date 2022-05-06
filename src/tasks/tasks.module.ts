import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TasksController],
  imports: [TypeOrmModule.forFeature([TasksRepository]), AuthModule],
  providers: [TasksService],
})
export class TasksModule {}
