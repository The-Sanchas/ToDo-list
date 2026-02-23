import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { TimeBlockModule } from './time-block/time-block.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { SwaggerModule } from '@nestjs/swagger'

@Module({
  imports: [
		ConfigModule.forRoot({}),
		AuthModule,
		UserModule,
		PrismaModule,
		TaskModule,
		TimeBlockModule,
		PomodoroModule,
		SwaggerModule]
})
export class AppModule {}
