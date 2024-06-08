import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";

export class CreateStudentEmailDto {
    @ApiProperty({example: 'example@unmsm.edu.pe', description: 'The email of the user with the UNMSM domain'})
    @IsEmail()
    @Matches(/^[\w.%+-]+@unmsm\.edu\.pe$/, { message: 'Email must be from the "unmsm.edu.pe" domain' })
    email: string;
}