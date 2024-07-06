import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { TransactionStatus, TransactionType } from "src/common/enums/transaction.enum";

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, versionKey: false })
export class Transaction {

  @Prop({ required: true, maxlength: 8 })  
  @ApiProperty({ example: 20200097, description: 'Student code of the transaction initiator', maxLength: 8}) 
  initiatorCode: number;

  @Prop({ maxlength: 8 })
  @ApiPropertyOptional({ example: 20200098, description: 'Student code of the transaction approver', maxLength: 8})
  approverCode?: number;

  @Prop({ required: true, min: 0.1, max: 200})    
  @ApiProperty({ example: 15, description: 'The amount of the transaction', minimum: 0.1, maximum: 200})  
  amount: number;

  @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })  
  @ApiProperty({ example: TransactionStatus.PENDING, description: 'The status of the transaction', enum: TransactionStatus})
  status: TransactionStatus;

  @Prop({ required: true, enum: TransactionType, default: TransactionType.DIGITAL_TO_CASH })  
  @ApiProperty({ example: TransactionType.DIGITAL_TO_CASH, description: 'The type of operation', enum: TransactionType})
  operationType: TransactionType;

  @Prop({ type: { type: String }, coordinates: [Number] })
  @ApiProperty({
    example: { type: 'Point', coordinates: [-12.053713, -77.085229] },
    description: 'The coordinates of the transaction location',
  })
  location: {
    type: string,
    coordinates: number[],
  };
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Index for geospatial queries
TransactionSchema.index({ location: '2dsphere' });
