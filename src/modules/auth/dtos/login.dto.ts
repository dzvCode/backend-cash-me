import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({example: 'example@unmsm.edu.pe', description: 'The email of the user with the UNMSM domain'})    
    email: string;

    @ApiProperty({example: 'password', description: 'The password of the user'})    
    password: string;
}