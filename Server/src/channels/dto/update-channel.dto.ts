import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}
