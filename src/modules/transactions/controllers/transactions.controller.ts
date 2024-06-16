import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../models/transaction.model';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
@UseInterceptors(TransformInterceptor)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto, description: 'Transaction details' })
  @ApiCreatedResponse({ description: 'The transaction has been successfully created.', type: Transaction })
  @ApiBadRequestResponse({ description: 'Invalid data provided for creating transaction.' })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.createTransaction(createTransactionDto);      
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({ name: 'studentCodeToExclude', required: false, type: Number, description: 'Student code to exclude from results' })
  @ApiQuery({ name: 'status', required: false, type: Number, description: 'Status of the transactions to filter by' })
  @ApiOkResponse({ description: 'Successfully retrieved list of transactions.', type: [Transaction] })
  @ApiNotFoundResponse({ description: 'No transactions found.' })
  async getAllTransactions(@Query('studentCodeToExclude') studentCodeToExclude: number, @Query('status') status?: number) {
    return await this.transactionsService.getAllTransactions(studentCodeToExclude, status);
  }

  @Put(":id")
  async updateTransaction(@Req() req) {
    return await this.transactionsService.updateTransactionStatus(req.params.id, req.body.approverCode, req.body.status);
  }

}
