import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from '../../users/services/users.service';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmailAndPassword(data);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user._id, user.email, user.role);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const { accessToken, refreshToken } = tokens;
    const userResponse: LoginResponseDto = {
      accessToken,
      refreshToken,      
      user,
    };

    return {
      message: 'Login successful',
      result: userResponse,
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(req.user._id, req.user.email, req.user.role);
    await this.updateRefreshToken(req.user._id, tokens.refreshToken);
    const { accessToken, refreshToken } = tokens;

    const user: LoginResponseDto = {
      accessToken,
      refreshToken,      
      user: req.user,
    };

    return {
      message: 'User information from google',
      result: user,
    };
  }

  async register(createUserDto: CreateUserDto) {
    this.verifyEmailDomain(createUserDto.email);
    await this.userExists(createUserDto.email, createUserDto.googleId);

    const studenCodeData = await this.usersService.scrapeAlumno(
      createUserDto.studentCode,
    );

    if (!studenCodeData) {
      throw new NotFoundException('Invalid student code');
    }

    createUserDto.faculty = studenCodeData.faculty;
    createUserDto.major = studenCodeData.major;

    // Hash the password before creating the user
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    }

    const newUser = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    return {
      message: 'User registered successfully',
      result: newUser,
    };
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
    return { message: 'Logout successful' };
  }

  verifyEmailDomain(email: string): void {
    const unmsmEmailDomain = '@unmsm.edu.pe';
    if (!email.endsWith(unmsmEmailDomain)) {
      throw new UnauthorizedException(
        'Unauthorized access. Only users with @unmsm.edu.pe email addresses are allowed.',
      );
    }
  }

  async userExists(email: string, googleId: string): Promise<void> {
    const user = await this.usersService.findByGoogleIdOrEmail(
      googleId ?? '',
      email ?? '',
    );
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user?.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }    

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'Token refreshed successfully',
      result: tokens,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string, role: UserRole) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }
}
