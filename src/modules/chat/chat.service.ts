import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Chat, ChatDocument } from './models/chat.model';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(senderId: string, createChatDto: CreateChatDto) {
    const createdChat = new this.chatModel({
      ...createChatDto,
      sender_id: senderId,
    });
    return createdChat.save();
  }

  async findAll(roomId: string, getChatDto: GetChatDto) {
    const query = {
      roomId: roomId,
    };

    if (getChatDto.lastId) {
      query['_id'] = { $lt: getChatDto.lastId };
    }

    const messages = await this.chatModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(getChatDto.limit)
      .populate('sender_id', 'firstName');

    //Transformar userIds a objetos con _id y firstName
    const userIdsTransformed = messages
      .map((message) => ({
        _id: message.sender_id['_id'],
        firstName: message.sender_id.firstName,
      }))
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t._id.toString() === value._id.toString()),
      );

    const messagesTransformed = messages.map((message) => ({
      _id: message._id,
      content: message.content,
      sender_id: message.sender_id['_id'],
      roomId: message.roomId,
      createdAt: message['createdAt'],
      updatedAt: message['updatedAt'],
    }));

    return {
      users: userIdsTransformed,
      messages: messagesTransformed,
    };
  }
}
