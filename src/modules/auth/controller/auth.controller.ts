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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { User } from 'src/modules/users/interfaces/user.interface';

@ApiTags('auth')
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
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  //@UseGuards(JwtAuthGuard)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.loginWithEmail(loginDto);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
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
