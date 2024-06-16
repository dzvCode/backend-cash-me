import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from '../models/transaction.model';
import { Model } from 'mongoose';
import { TransactionStatus, TransactionType } from 'src/common/enums/transaction.enum';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}
  
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const newTransaction = new this.transactionModel(createTransactionDto);
    let message: string;
    let transaction: any;
    const errors: string[] = [];
    newTransaction.location = {
      type: 'Point',
      coordinates: [createTransactionDto.longitude, createTransactionDto.latitude],
    };

    if (newTransaction.amount <= 0) {
      errors.push('Invalid amount provided for creating transaction.');
    }

    if (!Object.values(TransactionStatus).includes(newTransaction.status)) {
      errors.push('Invalid status provided for creating transaction.');
    }

    if (!Object.values(TransactionType).includes(newTransaction.typeOperation)) {
      errors.push('Invalid typeOperation provided for creating transaction.');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    
    transaction = await newTransaction.save();
    message = 'Transaction created successfully';
    return {
        message,
        result: transaction,
      }
  }

  async getAllTransactions(studentCodeToExclude: number, status?: number) {
    const query: any = { studentCode: { $ne: studentCodeToExclude } };
    let message: string;

    // Add the status condition if status is provided
    if (status !== undefined) {
      query.status = status;
    }
  
    const transactions = await this.transactionModel.find(query).exec();
    const totalCount = transactions.length;

    message = (!transactions || totalCount === 0) ? 'No transactions found for the provided filters' : 'Transactions fetched successfully';
    
    return { 
      message,
      result: {
        count: totalCount, 
        transactions 
      } 
    }
         
  }

  // update transaction status and add the student code of the student who approved the transaction
  async updateTransactionStatus(transactionId: string, approverCode: number, status: TransactionStatus) {
    const transaction = await this.transactionModel.findById(transactionId).exec();
    let message: string;
    let result: any;

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    if (status !== TransactionStatus.APPROVED && status !== TransactionStatus.REJECTED) {
      throw new BadRequestException('Invalid status provided for updating transaction');
    }

    transaction.status = status;
    transaction.approverCode = approverCode;
    await transaction.save();

    message = 'Transaction status updated successfully to ' + TransactionStatus[status];
    result = transaction;
    return {
      message,
      result,
    };
  }

}
