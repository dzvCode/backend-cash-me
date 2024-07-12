import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { UsersService } from './modules/users/services/users.service';
import { CreateUserDto } from './modules/users/dtos/create-user.dto';
import { getOtpTemplate } from './modules/auth/otp/utils/mail-templates.util';
import { html } from 'cheerio/lib/api/manipulation';



@Injectable()
export class OtpService {
  private transporter;

  constructor(private readonly usersService: UsersService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  generateOTP(): string {
    const now = Date.now(); // Get the current timestamp in milliseconds
    const randomPart = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
    const combined = (randomPart + now).toString(); // Combine with the current time and convert to string
    const otp = combined.slice(-5); // Take the last 5 digits to ensure it is a 5-digit number
  
    return otp;
  }

  async sendOTP(createUserDto: CreateUserDto): Promise<object> {
    const otp = this.generateOTP();
    const senderEmail = this.transporter.options.auth.user;
    const subject = 'Cash Me OTP Verification';
    const text = getOtpTemplate('es').replace('{{otpCode}}', otp);
  
    const mailOptions = {
      from: senderEmail,
      to: createUserDto.email,
      subject: subject,
      html: text
    };
  
    try {
      const response = await this.transporter.sendMail(mailOptions);
      
      if (response) {
        // save otp in user model in mongodb
        const user = await this.usersService.create(createUserDto);
      }
      return { email: createUserDto.email, otp };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }
  
}
