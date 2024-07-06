import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './models/transaction.model';
import { TransactionGateway } from './gateway/transaction.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  controllers: [TransactionsController],
  providers: [TransactionGateway, TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
