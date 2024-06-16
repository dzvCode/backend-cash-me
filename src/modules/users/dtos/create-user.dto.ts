import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
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

    @ApiProperty({example: 'example@unmsm.edu.pe', description: 'The email of the user with the UNMSM domain'})
    @IsEmail()
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