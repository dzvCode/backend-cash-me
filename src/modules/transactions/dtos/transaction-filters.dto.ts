import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class TransactionFiltersDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  excludeSelf?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  status?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  operationType?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  initiatorCode?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  receiverCode?: number;
}