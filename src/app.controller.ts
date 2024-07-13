import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpService } from './app.otp';
import { AppService } from './app.service';
import { AccessTokenGuard } from './common/guards/access-token.guard';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly otpService: OtpService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getProjectInfo(): object {
    return this.appService.getProjectInfo();
  }

  @Get('/ping')
  ping(): string {
    return this.appService.healthCheck();
  }

  @Get('/success')
  successPage() {
    return { message: 'Authentication successful' };
  }

  @Get('/error')
  errorPage() {
    return { message: 'Authentication failed' };
  }

  @Post('/otp')
  async generateOtp(@Body() body: { email?: string }): Promise<object> {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    const result = await this.otpService.sendOtp(body.email);
    return { message: 'OTP sent', result };
  }
}
