import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAccessTokenGuard } from 'src/common/guards/ws-access-token.guard';
import { wsAuthMiddleware } from 'src/common/middleware/ws-auth.middleware';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  namespace: '/chats',
})

@UseGuards(WsAccessTokenGuard)
export class ChatGateway {

  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('create')
  async create(
    @ConnectedSocket() client,
    @MessageBody() createChatDto: CreateChatDto
  ) {
    const senderId = client.handshake.user.sub.toString();
    const chat = await this.chatService.create(senderId, createChatDto);
    this.server.emit('new-chat', chat);
  }

  afterInit(client: Socket) {    
    client.use((socket, next) => wsAuthMiddleware(socket, next));
  }
}
