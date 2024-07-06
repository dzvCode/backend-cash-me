import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from '../models/transaction.model';
import { Model } from 'mongoose';
import { TransactionStatus, TransactionType } from 'src/common/enums/transaction.enum';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionFiltersDto } from '../dtos/transaction-filters.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { append } from 'cheerio/lib/api/manipulation';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}
  
  async createTransaction(createTransactionDto: CreateTransactionDto) {
   
    let message: string;
    let transaction: any;
    const errors: string[] = [];

    // Check for existing pending transaction for the initiatorCode
    const existingPendingTransaction = await this.transactionModel.findOne({
      initiatorCode: createTransactionDto.initiatorCode,
      status: TransactionStatus.PENDING,
    });

    if (existingPendingTransaction) {
      errors.push('Cannot create new transaction. There is already a pending transaction for this initiator.');
    }

    if (!createTransactionDto.latitude) {
      errors.push('Latitude is required for creating transaction.');
    }

    if (!createTransactionDto.longitude) {
      errors.push('Longitude is required for creating transaction.');
    }

    let invalidLatitude = createTransactionDto.latitude < -90 || createTransactionDto.latitude > 90;
    let invalidLongitude = createTransactionDto.longitude < -180 || createTransactionDto.longitude > 180;

    if (invalidLatitude) {
      errors.push('Invalid latitude provided for creating transaction. Latitude must be between -90 and 90');
    }

    if (invalidLongitude) {
      errors.push('Invalid longitude provided for creating transaction. Longitude must be between -180 and 180');
    }

    const newTransaction = new this.transactionModel(createTransactionDto);

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

    if (!Object.values(TransactionType).includes(newTransaction.operationType)) {
      errors.push('Invalid operationType provided for creating transaction.');
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

  async getAllTransactions(filtersDto?: TransactionFiltersDto) {
    const query: any = {};
    const errors: string[] = [];
        
    // Add other filters if provided
    for (const key in filtersDto) {
      if (key !== 'excludeSelf' && filtersDto[key] !== undefined) {
        query[key] = filtersDto[key];
      }
    }

    // Exclude the initiator from the list if excludeSelf is true
    if (filtersDto.excludeSelf !== undefined && filtersDto.excludeSelf.toLowerCase() === 'true') {
      query.initiatorCode = { $ne: query.initiatorCode };
    }

    if (filtersDto.initiatorCode !== undefined && filtersDto.initiatorCode.toString().length !== 8) {
      errors.push('Invalid initiatorCode provided for fetching transactions. Initiator code must be 8 digits');
    }

    if (query.approverCode !== undefined && query.approverCode.toString().length !== 8) {
      errors.push('Invalid approverCode provided for fetching transactions. Approver code must be 8 digits');
    }

    if (query.status !== undefined && !Object.values(TransactionStatus).includes(query.status)) {
      errors.push('Invalid status provided for fetching transactions');
    }

    if (query.operationType !== undefined && !Object.values(TransactionType).includes(query.operationType)) {
      errors.push('Invalid operationType provided for fetching transactions');
    }

    if (filtersDto.excludeSelf !== undefined && filtersDto.excludeSelf.toLowerCase() !== 'true' && filtersDto.excludeSelf.toLowerCase() !== 'false') {
      errors.push('Invalid excludeSelf provided for fetching transactions. It must be a boolean');
    }
    
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const transactions = await this.transactionModel.find(query).exec();
    const totalCount = transactions.length;

    const message = (!transactions || totalCount === 0) ? 'No transactions found for the provided filters' : 'Transactions fetched successfully';

    return {
      message,
      result: {
        count: totalCount,
        transactions,
      }
    }
  }

  async getTransactionsByStudentCode(studentCode: number) {
    const errors: string[] = [];

    if (studentCode.toString().length !== 8) {
      errors.push('Invalid student code provided for fetching transactions. Student code must be 8 digits');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const transactions = await this.transactionModel.find({
      $or: [{ initiatorCode: studentCode }, { approverCode: studentCode }],
    }).exec();

    const totalCount = transactions.length;

    const message = (!transactions || totalCount === 0) ? 'No transactions found for the provided student code' : 'Transactions fetched successfully';

    return {
      message,
      result: {
        count: totalCount,
        transactions,
      }
    }
  }

  // Update transaction status and add the student code of the student who approved the transaction
  async updateTransactionStatus(transactionId: string, updateTransactionDto: UpdateTransactionDto) {
    // Find the transaction first to get the current status
    const currentTransaction = await this.transactionModel.findById(transactionId).exec();

    if (!currentTransaction) {
      throw new NotFoundException('Transaction not found');
    }

    const errors: string[] = [];

    if (currentTransaction.approverCode !== undefined) {
      errors.push('Transaction has already been approved. Status cannot be updated');
    }

    // Check if initiator code is valid
    if (updateTransactionDto.approverCode.toString().length !== 8) {
      errors.push('Invalid approverCode provided for updating transaction. Approver code must be 8 digits');
    }

    // Check if the new status is valid
    if (!Object.values(TransactionStatus).includes(updateTransactionDto.status)) {
      errors.push('Invalid status provided for updating transaction');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if the status and approver code are unchanged
    if (currentTransaction.status === updateTransactionDto.status) {
      return {
        message: `The transaction status is already ${TransactionStatus[updateTransactionDto.status]}. No changes made.`,
        result: currentTransaction,
      };
    }
  
    // Save the previous status
    const previousStatus = currentTransaction.status;
  
    // Proceed with the update
    const updatedTransaction = await this.transactionModel.findOneAndUpdate(
      { _id: transactionId },
      { $set: { status: updateTransactionDto.status, approverCode: updateTransactionDto.approverCode } },
      { new: true }
    ).exec();
  
    // Return the result along with the previous status
    return {
      message: `Transaction status updated successfully from ${TransactionStatus[previousStatus]} to ${TransactionStatus[updateTransactionDto.status]}`,
      result: updatedTransaction,
    };
  }

}
