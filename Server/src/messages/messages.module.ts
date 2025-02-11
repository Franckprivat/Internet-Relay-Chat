import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MessagesController],
  providers: [MessageService, PrismaService],
  exports: [MessageService],
})
export class MessagesModule {}
