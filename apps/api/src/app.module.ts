import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { ActivityEventsModule } from './activity-events/activity-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule.forRoot(),
    PrismaModule,
    HealthModule,
    EmployeesModule,
    SessionsModule,
    ActivityEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
