import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import * as nodemailer from 'nodemailer';

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

  // async sendVerificationEmail(createUserDto: CreateUserDto): Promise<object> {
  //   const otp = this.generateOTP();
  //   const senderEmail = this.transporter.options.auth.user;
  //   const subject = 'Cash Me OTP Verification';
  //   const text = `
  //     Dear User,
  
  //     Thank you for choosing Cash Me! To proceed with your transaction, please use the following One-Time Password (OTP) to verify your identity:
  
  //     OTP Code: ${otp}
  
  //     Please note that this OTP is valid for the next 10 minutes. Do not share this code with anyone. If you did not request this OTP, please contact our support team immediately.
  
  //     Thank you for your cooperation.
  
  //     Best regards,
  //     The Cash Me Team
  
  //     Need help? Contact us at ${senderEmail}
  //   `;

  //   const mailOptions = {
  //     from: senderEmail,
  //     to: createUserDto.email,
  //     subject: subject,
  //     text: text,
  //   };

  //   try {
  //     const response = await this.transporter.sendMail(mailOptions);

  //     if (response) {
  //       // save otp in user model in mongodb
  //       const user = await this.usersService.create(createUserDto);
  //     }
  //     return { email: createUserDto.email, otp };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to send OTP');
  //   }
  // }


  // Create serdVerificationEmail method
  async sendVerificationEmail(email, otp) {

  }

}