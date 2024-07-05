import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, Req, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../models/transaction.model';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, OmitType } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionFiltersDto } from '../dtos/transaction-filters.dto';

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
  @ApiCreatedResponse({ description: 'The transaction has been successfully created.', type: OmitType(Transaction, ['approverCode']) })
  @ApiBadRequestResponse({ description: 'Invalid data provided for creating transaction.' })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.createTransaction(createTransactionDto);      
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse({ description: 'Successfully retrieved list of transactions based on filters.', type: [Transaction] })
  @ApiNotFoundResponse({ description: 'No transactions found.' })
  async getAllTransactions(@Query() filtersDto?: TransactionFiltersDto){
    return await this.transactionsService.getAllTransactions(filtersDto);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update transaction' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Transaction updated successfully' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  async updateTransaction(@Req() req) {
    return await this.transactionsService.updateTransactionStatus(req.params.id, req.body.approverCode, req.body.status);
  }

  @Put("/v2/:id")
  @ApiOperation({ summary: 'Update transaction' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Transaction updated successfully' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  async updateTransactionV2(@Req() req) {
    return await this.transactionsService.updateTransactionStatus(req.params.id, req.body.approverCode, req.body.status);
  }

}
