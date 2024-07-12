import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Contains, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    studentCode?: string;

    @Exclude()
    @IsOptional()
    @IsString()
    faculty?: string;

    @Exclude()
    @IsOptional()
    @IsString()
    major?: string;
    
    @IsOptional()
    @IsString()
    userPhoto?: string;

    @IsNotEmpty()
    @Contains('unmsm.edu.pe', { message: 'The email must be from UNMSM' })
    @IsEmail()
    @ApiProperty({
      example: 'example@unmsm.edu.pe',
      description: 'The email of the user with the UNMSM domain',
    })
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    password?: string;
    
    @Exclude()
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
 
    @IsOptional()
    @IsString()
    googleId?: string;
    
    @IsOptional()
    @IsString()
    refreshToken?: string;
}