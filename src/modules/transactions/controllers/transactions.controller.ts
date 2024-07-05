import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { Transaction } from '../models/transaction.model';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, OmitType } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionFiltersDto } from '../dtos/transaction-filters.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';

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
  @ApiCreatedResponse({ status: HttpStatus.OK, description: 'The transaction has been successfully created.', type: OmitType(Transaction, ['approverCode']) })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided for creating transaction.' })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.createTransaction(createTransactionDto);      
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Transactions retrieved successfully' , type: [Transaction]})
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided for getting transactions.' })
  async getAllTransactions(@Query() filtersDto?: TransactionFiltersDto){
    return await this.transactionsService.getAllTransactions(filtersDto);
  }

  @Put("/:id")
  @ApiOperation({ summary: 'Update transaction' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Transaction updated successfully', type: Transaction })
  @ApiBody({ type: UpdateTransactionDto, description: 'Transaction details' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided for updating transaction.' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  async updateTransactionV2(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {    
    return await this.transactionsService.updateTransactionStatus(id, updateTransactionDto);
  }

}
