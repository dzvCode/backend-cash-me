import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpService } from 'src/app.otp';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // create dummy get endpoint
  @Get()
  getOtp() {
    return "otp";
  }
}
