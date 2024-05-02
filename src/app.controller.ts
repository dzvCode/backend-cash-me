import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProjectInfo(): object {
    return this.appService.getProjectInfo();
  }

  @Get('/ping')
  ping(): string {
    return this.appService.healthCheck();
  }
}
