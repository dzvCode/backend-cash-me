import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { Auth } from 'src/common/decorators/auth.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id/role')
  @Auth(UserRole.ADMIN)
  async changeRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.usersService.changeRole(id, role);
  }


}
