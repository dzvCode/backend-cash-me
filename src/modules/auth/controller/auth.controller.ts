import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptors/TransformInterceptor';
import { GoogleAuthGuard } from 'src/modules/auth/guards/google-auth.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { LoginDto } from '../dtos/login.dto';

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
  //@UseGuards(JwtAuthGuard)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmailAndPassword(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const data = await this.authService.loginWithEmail(user);
    return { message: 'Login successful', result: data };
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() createUserDto: CreateUserDto) {
    this.authService.verifyEmailDomain(createUserDto.email);
    await this.authService.userExists(createUserDto.email, createUserDto.googleId);

    const studenCodeData = await this.usersService.scrapeAlumno(
      createUserDto.studentCode,
    );

    if (!studenCodeData) {
      throw new NotFoundException('Invalid student code');
    }

    createUserDto.faculty = studenCodeData.faculty;
    createUserDto.major = studenCodeData.major;

    const result = await this.authService.register(createUserDto);
    return { message: 'User registered successfully', result };
  }
}
