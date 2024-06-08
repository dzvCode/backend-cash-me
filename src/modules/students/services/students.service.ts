import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCodeScrape } from 'src/common/scrape/user-code.scrape';
import { UserEmailScrape } from 'src/common/scrape/user-email.scrape';

@Injectable()
export class StudentsService {
  /**
   * Scrapes student data from the university website using a student code.
   * @param codigo - The student code.
   * @returns A promise that resolves to the scraped student data.
   */
  async studentDataByCode(codigo: string) {
    const extractedStudentData = await UserCodeScrape.scrapeAlumno(codigo);

    if (!extractedStudentData) {
      throw new NotFoundException('No student data found');
    }

    return extractedStudentData;
  }

  async validateStudentEmail(email: string) {
    const extractedStudentData = await UserEmailScrape.scrapeAlumno(email);

    if (!extractedStudentData) {
      throw new NotFoundException('Email not found');
    }

    return extractedStudentData;
  }
}
