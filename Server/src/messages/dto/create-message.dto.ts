import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsInt()
    @IsNotEmpty()
    senderId?: number; 

    nickname?: string;   

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsInt()
    channelId?: number; 

    @IsOptional()
    @IsInt()
    recipientId?: number; 
}
