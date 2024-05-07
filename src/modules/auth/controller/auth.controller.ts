import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAuthGuard } from 'src/modules/auth/guards/google-auth.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(@Req() req) {
    const { user } = req;
    console.log('req user', user);
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req, @Res() res) {
    console.log('req user', req.user);

    // Redirect the user based on authentication status
    if (req.user) {
      // User is authenticated, redirect to a success page
      return res.redirect('/success');
    } else {
      // User is not authenticated, redirect to an error page
      return res.redirect('/error');
    }
  }

  @Post('/login')
  //@UseGuards(JwtAuthGuard)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.loginWithEmail(loginDto);
  }

  @Post('/register')
  async register(@Body() createUserDto: any): Promise<any> {
    const existingUser = await this.usersService.findByGoogleIdOrEmail(
      createUserDto.googleId ?? '',
      createUserDto.email ?? '',
    );
    if (existingUser) {
      return 'User already exists';
    }
    return this.authService.register(createUserDto);
  }
}
