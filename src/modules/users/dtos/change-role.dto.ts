import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'The role to assign to the user',
  })
  role: UserRole;
}