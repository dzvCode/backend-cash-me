import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { MessageDto } from './dtos/message.dto';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('chat_update')//Channel name
  handleChatUpdate(@MessageBody() body:MessageDto) {
    this.server.emit('chat_update', body);
  }
}
