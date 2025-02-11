import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JoinChannelDto } from './dto/join-channelDto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post('create')
  async createChannel(@Body() createChannelDto: CreateChannelDto) {
    return await this.channelsService.create(createChannelDto);
  }

  @Post('join')
  async join(@Body() joinChannelDto: JoinChannelDto) {
    return await this.channelsService.joinChannel(
      joinChannelDto.channelName,
      joinChannelDto.nickname,
    );
  }

  @Post('leave')
  async leave(@Body() joinChannelDto: JoinChannelDto) {
    return await this.channelsService.leaveChannel(
      joinChannelDto.channelName,
      joinChannelDto.nickname,
    );
  }

  @Get()
  async findAllChannels() {
    return await this.channelsService.findAll();
  }

  @Get('name/:name')
  async findChannelByName(@Param('name') name: string) {
    return await this.channelsService.findByName(name);
  }

  @Get(':name')
  async getChannelById(@Param('name') name: string) {
    return await this.channelsService.getChannelByName(name);
  }

  @Patch(':name')
  async updateChannel(
    @Param('name') name: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return await this.channelsService.update(name, updateChannelDto);
  }

  @Delete(':name')
  async deleteChannel(@Param('name') name: string) {
    return await this.channelsService.remove(name);
  }

  @Post(':channelName/users/:nickname')
  async addUserToChannel(
    @Param('channelName') channelName: string,
    @Param('nickname') nickname: string,
  ) {
    if (!nickname) {
      throw new BadRequestException("notre nombre d'utilisateur est requis.");
    }
    return await this.channelsService.addUserToChannel(channelName, nickname);
  }

  @Delete(':channelName/users/:nickname')
  async removeUserFromChannel(
    @Param('channelName') channelName: string,
    @Param('nickname') nickname: string,
  ) {
    if (!nickname) {
      throw new BadRequestException("notre nombre d'utilisateur est requis.");
    }
    return await this.channelsService.removeUserFromChannel(
      channelName,
      nickname,
    );
  }

  @Get(':channelName/users')
  async getUsersInChannel(@Param('channelName') channelName: string) {
    return await this.channelsService.getUsersInChannel(channelName);
  }
}
