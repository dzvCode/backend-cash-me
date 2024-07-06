import { Module } from '@nestjs/common';
import { OtpService } from 'src/app.otp'; 

@Module({
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
