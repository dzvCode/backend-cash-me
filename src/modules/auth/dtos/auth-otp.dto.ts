import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail, IsNotEmpty } from 'class-validator';

export class AuthOtpDto {
  @IsNotEmpty()
  @Contains('unmsm.edu.pe', { message: 'The email must be from UNMSM' })
  @IsEmail()
  @ApiProperty({
    example: 'sample@unmsm.edu.pe',
    description: 'The email of the user with the UNMSM domain',
  })
  email: string;
}
