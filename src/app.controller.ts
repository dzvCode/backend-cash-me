import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProjectInfo(): object {
    return this.appService.getProjectInfo();
  }

  @Get('/ping')
  ping(): string {
    return this.appService.healthCheck();
  }
  
  @Get('/auth/google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {}

  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    console.log("req user", req.user);
    
    // Redirect the user based on authentication status
    if (req.user) {
      // User is authenticated, redirect to a success page
      return res.redirect('/success');
    } else {
      // User is not authenticated, redirect to an error page
      return res.redirect('/error');
    }
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
  
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

}
