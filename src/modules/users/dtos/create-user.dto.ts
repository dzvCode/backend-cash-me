import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsEmail, IsOptional, IsString } from "class-validator";

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
 
    @IsOptional()
    @IsString()
    googleId?: string;
    
    @IsOptional()
    @IsString()
    refreshToken?: string;
}