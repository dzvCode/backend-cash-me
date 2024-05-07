import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { User } from 'src/modules/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmailAndPassword(loginDto);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginWithEmail(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmailAndPassword(loginDto);
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { username: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {  
    return await this.usersService.create(createUserDto);
  }
}
