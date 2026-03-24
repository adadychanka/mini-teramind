import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeSessionsController } from './employee-sessions.controller';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  controllers: [SessionsController, EmployeeSessionsController],
  providers: [SessionsService, PrismaService],
})
export class SessionsModule {}
