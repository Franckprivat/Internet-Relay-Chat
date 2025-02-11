import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { PrismaService } from 'src/prisma.service';
import { ChannelsController } from './channel.controller';

@Module({
  controllers: [ChannelsController],
  providers: [ ChannelsService, PrismaService],
  exports: [ChannelsService],
})
export class ChannelsModule { }
