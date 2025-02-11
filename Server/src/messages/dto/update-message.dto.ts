import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
