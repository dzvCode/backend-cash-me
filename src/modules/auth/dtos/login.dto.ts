import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginDto {
    @ApiProperty({example: 'example@unmsm.edu.pe', description: 'The email of the user with the UNMSM domain'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'password', description: 'The password of the user'})
    @IsStrongPassword()
    password: string;
}