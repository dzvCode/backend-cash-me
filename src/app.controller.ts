import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
// import { OtpService } from './app.otp';
import { AccessTokenGuard } from './common/guards/access-token.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly otpService: OtpService,
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

}
