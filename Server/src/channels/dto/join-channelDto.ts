import { IsString, IsNotEmpty } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}