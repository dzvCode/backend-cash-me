import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from '../models/transaction.model';
import { Model } from 'mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}
  
  async createTransaction(data: any): Promise<Transaction> {
    const newTransaction = new this.transactionModel(data);
    return newTransaction.save();
  }
}
