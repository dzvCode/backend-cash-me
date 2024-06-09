import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  studentCode: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  operationStatus: string;

  @Prop({ required: true })
  typeOperation: string;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ type: { type: String }, coordinates: [Number] })
  location: {
    type: string,
    coordinates: number[],
  };
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ location: '2dsphere' });