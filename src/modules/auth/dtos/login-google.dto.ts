import { ApiProperty } from "@nestjs/swagger";

export class LoginGoogleDto {
    @ApiProperty({ example: 'googleId', description: 'Google Id' })
    googleId: string;

    @ApiProperty({ example: 'email', description: 'Email' })
    email: string;

    @ApiProperty({ example: 'Juan Perez', description: 'User full name' })
    fullName: string;        

    @ApiProperty({ example: 'userPhoto', description: 'User Photo' })
    userPhoto: string;    
}