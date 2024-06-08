import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, Length } from "class-validator";

export class CreateStudentCodeDto {
    @ApiProperty()
    @IsNumberString()
    @Length(8, 8, { message: 'The student code must be 8 characters long' })
    code: string;
}