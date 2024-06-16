import { ApiProperty } from "@nestjs/swagger";
import { TransactionStatus, TransactionType } from "src/common/enums/transaction.enum";

export class CreateTransactionDto {
  @ApiProperty()
  initiatorCode: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: TransactionStatus;

  @ApiProperty()
  typeOperation: TransactionType;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;
}