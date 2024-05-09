import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { User } from 'src/modules/users/interfaces/user.interface';
import { LoginResponseDto } from '../dtos/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginWithEmail(data: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmailAndPassword(data);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user._id, user.email);    
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const { accessToken, refreshToken } = tokens;
    const userResponse: LoginResponseDto = {
      accessToken,
      refreshToken,      
      user,
    };

    return userResponse;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
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
    
    const newUser = await this.usersService.create(createUserDto);
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);

    return newUser;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
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

    const refreshTokenMatches = await bcrypt.compare(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken });
  }

  async getTokens(userId: string, username: string) {   
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }
}
