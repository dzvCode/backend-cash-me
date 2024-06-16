import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCodeScrape } from 'src/common/scrape/user-code.scrape';
import { UserEmailScrape } from 'src/common/scrape/user-email.scrape';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class StudentsService {
  /**
   * Scrapes student data from the university website using a student code.
   * @param codigo - The student code.
   * @returns A promise that resolves to the scraped student data.
   */
  constructor(private authService: AuthService) {}

  async studentDataByCode(codigo: string) {
    const extractedStudentData = await UserCodeScrape.scrapeAlumno(codigo);

    if (!extractedStudentData) {
      throw new NotFoundException('No student data found');
    }

    return {
      message: 'Student data fetched successfully',
      result: extractedStudentData,
    };
  }

  async validateStudentEmail(email: string) {
    await this.authService.userExists(email, '');
    const extractedStudentData = await UserEmailScrape.scrapeAlumno(email);

    if (!extractedStudentData) {
      throw new NotFoundException('Email not found');
    }

    return {
      message: 'Student email validated',
      result: extractedStudentData,
    };
  }
}
