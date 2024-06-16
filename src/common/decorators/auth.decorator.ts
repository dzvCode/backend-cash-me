import { UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';
import { Roles } from './roles.decorator';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(role: UserRole) {
  return applyDecorators(Roles(role), UseGuards(AccessTokenGuard, RolesGuard));
}
