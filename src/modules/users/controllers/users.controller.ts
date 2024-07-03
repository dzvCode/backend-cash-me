import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(UserRole.ADMIN)
  @Get()
  async findAll() {
    try {
      const result = await this.usersService.findAll();
      return {
        message: 'Users fetched successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch users',
        error: error.message,
      };
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async findAuthenticatedUser(@Req() req: Request) {
    try {
      const userId = req.user['sub'];
      const result = await this.usersService.findById(userId);
      return {
        message: 'User fetched successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch user',
        error: error.message,
      };
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const result = (await this.usersService.findById(id));
      return {
        message: 'User fetched successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch user',
        error: error.message,
      };
    }
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id/role')
  async changeRole(@Param('id') id: string, @Body('role') role: UserRole) {
    try {
      const result = await this.usersService.changeRole(id, role);
      return {
        message: 'Role updated successfully',
        result: result.role,
      };
    } catch (error) {
      return {
        message: error.message,
        error: error.message,
      };
    }
  }

  @Auth(UserRole.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User) {
    try {
      const result = await this.usersService.update(id, user);
      return {
        message: 'User updated successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: 'Failed to update user',
        error: error.message,
      };
    }
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() user: Partial<User>) {
    try {
      const result = await this.usersService.partialUpdate(id, user);
      return {
        message: 'User updated successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: 'Failed to update user',
        error: error.message,
      };
    }
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const result = await this.usersService.delete(id);
      return {
        message: 'User deleted successfully',
        result: result,
      };
    } catch (error) {
      return {
        message: 'Failed to delete user',
        error: error.message,
      };
    }
  }
}
