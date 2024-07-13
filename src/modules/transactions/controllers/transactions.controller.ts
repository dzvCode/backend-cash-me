import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, OmitType } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionFiltersDto } from '../dtos/transaction-filters.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { QueryDto } from '../dtos/query.dto';
import { Transaction } from '../models/transaction.model';
import { TransactionsService } from '../services/transactions.service';

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
  @ApiOperation({ summary: 'Get all transactions with optional filters' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Transactions retrieved successfully' , type: [Transaction]})
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided for getting transactions.' })
  async getAllTransactions(@Query() filtersDto?: TransactionFiltersDto){
    return await this.transactionsService.getAllTransactions(filtersDto);
  }

  @Get("/:studentCode")
  @ApiOperation({ summary: 'Get all transactions by student code' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Transactions retrieved successfully' , type: [Transaction]})
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided for getting transactions.' })
  @ApiParam({ name: 'studentCode', description: 'Student code' })
  async getTransactionsByStudentCode(@Param('studentCode', ParseIntPipe) studentCode: number){
    return await this.transactionsService.getTransactionsByStudentCode(studentCode);
  }

  // controller to check if student has pending transaction
  @Get("/:studentCode/pending")
  @ApiOperation({ summary: 'Check if student has pending transaction' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Student has or not pending transaction', type: Transaction }) 
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided for getting transactions.' })
  @ApiParam({ name: 'studentCode', description: 'Student code' })
  async checkStudentPendingTransaction(@Param('studentCode', ParseIntPipe) studentCode: number){
    return await this.transactionsService.checkPendingTransactionByStudentCode(studentCode);
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

  // create an enpoint that sends a "query" and returns a response
  @Post('/query')
  @ApiOperation({ summary: 'Get transactions by query' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'The result of the query has been successfully retrieved' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query provided' })
  @ApiBody({ type: QueryDto, description: 'User query' })
  @ApiQuery({ name: 'from_context', description: 'Queries from Cash Me app context if true' })
  async getResultByQuery(@Body() userQuery: QueryDto, @Query('from_context') fromContext?: string) {   
    return await this.transactionsService.getResultByQuery(userQuery, fromContext);
  }
}
