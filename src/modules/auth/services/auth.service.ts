import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { User } from 'src/modules/users/interfaces/user.interface';
import { LoginResponseDto } from '../dtos/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmailAndPassword(loginDto);
    if (user) {
      return user;
    }
    return null;
  }

  async loginWithEmail(user: User): Promise<LoginResponseDto> {
    const payload = { username: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    const expiresIn = 3600;

    const userResponse: LoginResponseDto = {
      accessToken,
      refreshToken,
      expiresIn,
      user,
    };

    return userResponse;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
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
}
