import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { TransactionStatus, TransactionType } from "src/common/enums/transaction.enum";

export class TransactionFiltersDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 20200097, description: 'Student code of the transaction initiator' })
  initiatorCode?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Exclude the initiator from the list if true' })
  excludeSelf?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Student code of the transaction approver'})
  approverCode?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: TransactionStatus.PENDING, description: 'The status of the transaction' })
  status?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ example: TransactionType.DIGITAL_TO_CASH, description: 'The type of operation' })
  operationType?: number;
}