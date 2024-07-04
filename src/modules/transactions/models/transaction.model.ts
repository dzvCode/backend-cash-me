import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from "src/common/enums/transaction.enum";

export type TransactionDocument = Transaction & Document;

@Schema({ versionKey: false })
export class Transaction {
  @Prop({ required: true })
  @ApiProperty({ example: 20200097, description: 'Student code of the transaction initiator' }) 
  initiatorCode: number;

  @Prop()
  @ApiProperty({ example: 20200098, description: 'Student code of the transaction approver' })
  approverCode?: number;

  @Prop({ required: true })
  @ApiProperty({ example: 500, description: 'The amount of the transaction' })
  amount: number;

  @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING})
  @ApiProperty({ example: TransactionStatus.PENDING, description: 'The status of the transaction' })
  status: TransactionStatus;

  @Prop({ required: true, enum: TransactionType, default: TransactionType.DIGITAL_TO_CASH})
  @ApiProperty({ example: TransactionType.DIGITAL_TO_CASH, description: 'The type of operation' })
  operationType: TransactionType;

  @Prop({ type: { type: String }, coordinates: [Number] })
  @ApiProperty({
    example: { type: 'Point', coordinates: [100.0, 50.0] },
    description: 'The location of the transaction',
  })
  location: {
    type: string,
    coordinates: number[],
  };

  @Prop({ default: Date.now })
  @ApiProperty({ example: '2024-06-13T10:00:00Z', description: 'The date and time the transaction was created' })
  created_at: Date;

  @Prop({ default: Date.now })
  @ApiProperty({ example: '2024-06-13T10:00:00Z', description: 'The date and time the transaction was last updated' })
  updated_at: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Index for geospatial queries
TransactionSchema.index({ location: '2dsphere' });
