import { Body, Controller, Delete, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(UserRole.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Auth(UserRole.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }  

  @Auth(UserRole.ADMIN)
  @Patch(':id/role')
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.usersService.changeRole(id, role);
  }

  @Auth(UserRole.ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<User> {
    return this.usersService.update(id, user);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() user: Partial<User>,
  ): Promise<User> {
    return this.usersService.partialUpdate(id, user);
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.usersService.delete(id);
  }

}
