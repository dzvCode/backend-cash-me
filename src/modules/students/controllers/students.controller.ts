import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentCodeDto } from '../dtos/create-student-code.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { CreateStudentEmailDto } from '../dtos/create-student-email.dto';

@ApiBearerAuth()
@ApiTags('students')
@Controller('students')
@UseInterceptors(TransformInterceptor)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('verify-code')
  async studenDataByCode(@Body() student: CreateStudentCodeDto) {
    try {
      const result = await this.studentsService.studentDataByCode(student.code);
      return {
        message: 'Student data fetched successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: error.message,
        error: error.message,
      };
    }
  }

  @Post('/verify-email')
  async validateStudentEmail(@Body() student: CreateStudentEmailDto) {
    try {
      const result = await this.studentsService.validateStudentEmail(
        student.email,
      );
      return {
        message: 'Student email exists',
        result: result,
      };
    } catch (error) {
      return {        
        message: error.message,
        error: error.message,
      };
    }
  }
}
