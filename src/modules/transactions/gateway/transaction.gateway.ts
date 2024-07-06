import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAccessTokenGuard } from 'src/common/guards/ws-access-token.guard';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionsService } from '../services/transactions.service';

@WebSocketGateway({
  namespace: '/cash-exchange',
})
@UseGuards(WsAccessTokenGuard)
export class TransactionGateway {
  constructor(private readonly transactionService: TransactionsService) {}

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('register')
  async register(@MessageBody() createTransactionDto: CreateTransactionDto) {    
    const transaction = await this.transactionService.createTransaction(createTransactionDto);
    this.server.emit('new-register', transaction);
  }
}
