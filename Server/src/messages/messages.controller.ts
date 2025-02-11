import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { MessageService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.createMessage(createMessageDto);
  }

  @Get('channel/:channelId')
  async getMessagesByChannel(@Param('channelId') channelId: string) {
    return await this.messageService.getMessagesByChannel(parseInt(channelId));
  }

  @Get('private/:sender/:recipient')
  async getPrivateMessages(
    @Param('sender') sender: string,
    @Param('recipient') recipient: string,
  ) {
    return await this.messageService.getPrivateMessages(
      parseInt(sender),
      parseInt(recipient),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.messageService.findOne(parseInt(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messageService.update(parseInt(id), updateMessageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.messageService.remove(parseInt(id));
  }
}
