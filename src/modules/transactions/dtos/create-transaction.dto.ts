import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { TransactionStatus, TransactionType } from "src/common/enums/transaction.enum";

export class CreateTransactionDto {
  
  @IsNotEmpty()
  @ApiProperty({ example: 20200097, description: 'Student code of the transaction initiator' })
  initiatorCode: number;

  @IsNotEmpty()
  @ApiProperty({ example: 15, description: 'The amount of the transaction' })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({ example: TransactionStatus.PENDING, description: 'The status of the transaction' })
  status: TransactionStatus;

  @IsNotEmpty()
  @ApiProperty({ example: TransactionType.DIGITAL_TO_CASH, description: 'The type of operation'})
  operationType: TransactionType;

  @IsNotEmpty()
  @ApiProperty({ example: -12.053713, description: 'Longitude of the transaction location' })
  longitude: number;

  @IsNotEmpty()
  @ApiProperty({ example: -77.085229, description: 'Latitude of the transaction location'})
  latitude: number;
}