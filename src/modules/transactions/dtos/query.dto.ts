import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class QueryDto {
  
  @IsNotEmpty()
  @ApiProperty({ example: "¿Qué es Cash Me?", description: 'User query using natural language' })
  query: string;

  @IsNotEmpty()
  @ApiProperty({ example: 20200097, description: 'User student code' })
  userCode: number;
}