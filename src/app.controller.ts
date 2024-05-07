import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
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
    // Render a success page or return a JSON response indicating success
    return { message: 'Authentication successful' };
  }

  @Get('/error')
  errorPage() {
    // Render an error page or return a JSON response indicating error
    return { message: 'Authentication failed' };
  }
}
