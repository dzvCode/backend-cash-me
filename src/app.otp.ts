import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string): Promise<object> {
    const otp = this.generateOtp();
    
    const mailOptions = {
      from: this.transporter.options.auth.user,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { email, otp };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }
}
