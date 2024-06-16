import { Module } from '@nestjs/common';
import { StudentsController } from './controllers/students.controller';
import { StudentsService } from './services/students.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [StudentsController],
  providers: [StudentsService]
})
export class StudentsModule {}
