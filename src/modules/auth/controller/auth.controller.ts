import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptors/TransformInterceptor';
import { GoogleAuthGuard } from 'src/modules/auth/guards/google-auth.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
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
  @ApiOperation({ summary: 'Login with email and password ' })
  @ApiResponse({ status: 200, description: 'Login successful' })  
  async login(@Body() loginDto: LoginDto) {    
    const data = await this.authService.loginWithEmail(loginDto);
    return { message: 'Login successful', result: data };
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() createUserDto: CreateUserDto) {    
    const result = await this.authService.register(createUserDto);
    return { message: 'User registered successfully', result };
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() req: Request) {    
    this.authService.logout(req.user['sub']);
    return { message: 'Logout successful' };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const data = this.authService.refreshToken(userId, refreshToken);
    return { message: 'Token refreshed successfully', result: data };
  }
}
