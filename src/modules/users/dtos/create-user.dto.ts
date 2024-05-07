import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    studentCode?: string;

    @IsOptional()
    @IsString()
    userPhoto?: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password?: string;    

    @IsOptional()
    @IsString()
    googleId?: string;
}