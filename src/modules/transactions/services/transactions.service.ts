import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionStatus, TransactionType } from 'src/common/enums/transaction.enum';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionFiltersDto } from '../dtos/transaction-filters.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { QueryDto } from '../dtos/query.dto';
import { Transaction, TransactionDocument } from '../models/transaction.model';

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

    const newTransaction = new this.transactionModel(createTransactionDto);

    newTransaction.location = {
      type: 'Point',
      coordinates: [createTransactionDto.longitude, createTransactionDto.latitude],
    };
    
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

  async checkPendingTransactionByStudentCode(studentCode: number) {
    const errors: string[] = [];

    if (studentCode.toString().length !== 8) {
      errors.push('Invalid student code provided for fetching transactions. Student code must be 8 digits');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const pendingTransaction = await this.transactionModel.findOne({
      initiatorCode: studentCode,
      status: TransactionStatus.PENDING,
    }).exec();

    return {
      message: pendingTransaction ? 'Pending transaction found' : 'No pending transaction found',
      result: pendingTransaction
    }
  }

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

    if (updateTransactionDto.approverCode.toString().length !== 8) {
      errors.push('Invalid approverCode provided for updating transaction. Approver code must be 8 digits');
    }

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
  
    const previousStatus = currentTransaction.status;
  
    const updatedTransaction = await this.transactionModel.findOneAndUpdate(
      { _id: transactionId },
      { $set: { status: updateTransactionDto.status, approverCode: updateTransactionDto.approverCode } },
      { new: true }
    ).exec();
  
    return {
      message: `Transaction status updated successfully from ${TransactionStatus[previousStatus]} to ${TransactionStatus[updateTransactionDto.status]}`,
      result: updatedTransaction,
    };
  }

  async getResultByQuery(userQuery: QueryDto, fromContext: string) {
    const body = { query: userQuery.query };
    let url: string = fromContext === 'false' ? 'http://127.0.0.1:8000/query' : 'http://127.0.0.1:8000/query?from_context=true';
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      throw new HttpException(
        `Error: ${response.statusText}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  
    const result = await response.json();
  
    let userQueryResult: string;
    if (fromContext === 'false') {
      switch (result.answer) {
        case 'moneyReceived':
          const transactionsReceived = await this.transactionModel.find({ initiatorCode: userQuery.userCode, status: TransactionStatus.APPROVED });
          const totalReceivedAmount = transactionsReceived.reduce((total, transaction) => total + transaction.amount, 0);
          userQueryResult = `Has sido casheado un total de S/${totalReceivedAmount} por otros estudiantes`;
          break;
        case 'moneyGiven':
          const transactionsGiven = await this.transactionModel.find({ approverCode: userQuery.userCode, status: TransactionStatus.APPROVED });
          const totalGivenAmount = transactionsGiven.reduce((total, transaction) => total + transaction.amount, 0);
          userQueryResult = `Has casheado un total de S/${totalGivenAmount} a otros estudiantes`;
          break;
        case 'moneyBalance':
          const transactionsReceivedBalance = await this.transactionModel.find({ initiatorCode: userQuery.userCode, status: TransactionStatus.APPROVED });
          const totalReceivedBalance = transactionsReceivedBalance.reduce((total, transaction) => total + transaction.amount, 0);
  
          const transactionsGivenBalance = await this.transactionModel.find({ approverCode: userQuery.userCode, status: TransactionStatus.APPROVED });
          const totalGivenBalance = transactionsGivenBalance.reduce((total, transaction) => total + transaction.amount, 0);
  
          const totalBalance = totalReceivedBalance - totalGivenBalance;
          userQueryResult = `Tu balance total de casheo es S/${totalBalance}`;
          break;
        case 'invalidQuery':
          userQueryResult = 'Lo siento, tu consulta no está permitida.';
          break;
      }
  
      return {
        message: "Query for user data executed successfully",
        result: userQueryResult,
      };
    }
  
    return {
      message: 'Query from Cash Me app context executed successfully',
      result: result,
    };
  }  

}
