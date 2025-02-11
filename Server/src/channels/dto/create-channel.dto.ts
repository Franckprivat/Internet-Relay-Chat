import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsNotEmpty()
  @IsString()
  nickname: string;
}
