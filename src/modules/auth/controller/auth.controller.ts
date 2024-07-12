import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OtpService } from 'src/app.otp';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../../../common/guards/refresh-token.guard';
<<<<<<< Updated upstream
import { AuthOtpDto } from '../dtos/auth-otp.dto';
import { LoginDto } from '../dtos/login.dto';
import { LoginGoogleDto } from '../dtos/login-google.dto';
=======
import { LoginDto } from '../dtos/login.dto';
import { OtpService } from 'src/app.otp';
>>>>>>> Stashed changes

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private authService: AuthService,  private readonly otpService: OtpService) {}

  @Post('/google')      
  async googleAuth(@Body() loginGoogle: LoginGoogleDto) {
    return await this.authService.googleLogin(loginGoogle);    
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login with email and password ' })
  @ApiResponse({ status: 201, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('/otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate and send OTP to email' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async generateOtp(@Body() createUserDto: CreateUserDto): Promise<object> {
    const result = await this.otpService.sendOTP(createUserDto);
    return { message: `OTP successfully sent to ${createUserDto.email}`, result };
  }


  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() req: Request) {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
