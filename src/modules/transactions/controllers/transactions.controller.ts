import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Post()
    async createTransaction(@Body() body: any) {
        const { longitude, latitude, amount, operationStatus, typeOperation, studentCode } = body;
        const dateTime = new Date();

        const transactionData = {
        studentCode,
        amount,
        operationStatus,
        typeOperation,
        dateTime,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude],
        },
        };

        const transaction = await this.transactionsService.createTransaction(transactionData);

        return {
        amount: transaction.amount,
        operation_status: transaction.operationStatus,
        type_operation: transaction.typeOperation,
        student_code: transaction.studentCode,
        datetime: transaction.dateTime,
        location: transaction.location,
        };
    }
}
