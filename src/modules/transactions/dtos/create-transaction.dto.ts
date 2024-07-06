import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, Max, MaxLength, Min } from 'class-validator';
import {
  TransactionStatus,
  TransactionType,
} from 'src/common/enums/transaction.enum';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 20200097,
    description: 'Student code of the transaction initiator',
  })
  @MaxLength(8)
  initiatorCode: number;

  @IsNotEmpty()
  @Min(0.1)
  @Max(200)
  @ApiProperty({ example: 15, description: 'The amount of the transaction' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  @ApiProperty({
    example: TransactionStatus.PENDING,
    description: 'The status of the transaction',
  })
  status: TransactionStatus;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  @ApiProperty({
    example: TransactionType.DIGITAL_TO_CASH,
    description: 'The type of operation',
  })
  operationType: TransactionType;

  @IsNotEmpty()
  @IsLongitude({
    message:
      'Invalid longitude provided for creating transaction. Longitude must be between -180 and 180',
  })
  @ApiProperty({
    example: -12.053713,
    description: 'Longitude of the transaction location',
  })
  longitude: number;

  @IsNotEmpty()
  @IsLatitude({
    message:
      'Invalid latitude provided for creating transaction. Latitude must be between -90 and 90',
  })
  @ApiProperty({
    example: -77.085229,
    description: 'Latitude of the transaction location',
  })
  latitude: number;
}
