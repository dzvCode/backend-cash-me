import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class TransactionFiltersDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty()
  excludeSelf?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  status?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  operationType?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  initiatorCode?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  receiverCode?: number;
}