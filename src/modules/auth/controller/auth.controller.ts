import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';
import { AccessTokenGuard } from '../../../common/guards/access-token.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from '../../../common/guards/refresh-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@ApiBearerAuth()
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
  async googleAuthRedirect(@Req() req) {
    return await this.authService.googleLogin(req);    
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login with email and password ' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
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
