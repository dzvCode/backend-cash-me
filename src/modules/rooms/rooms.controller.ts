import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { GetChatDto } from '../chat/dto/get-chat.dto';
import { ChatService } from '../chat/chat.service';

@ApiBearerAuth()
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService,
    private readonly chatsService: ChatService,
  ) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() createRoomDto: CreateRoomDto) {    
    return this.roomsService.create(req.user['sub'].toString(), createRoomDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  getByRequest(@Request() req) {
    return this.roomsService.getByRequest(req.user['sub'].toString());
  }

  @Get(':id/chats')
  @UseGuards(AccessTokenGuard)
  @ApiParam({ name: 'id', required: true })
  getChats(@Param('id') id, @Query() dto: GetChatDto) {
    return this.chatsService.findAll(id, new GetChatDto(dto));
  }
}
