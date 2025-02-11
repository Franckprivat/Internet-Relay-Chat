import { Channel } from "src/channels/entities/channel.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    content: string;
  
    @CreateDateColumn()
    timestamp: Date; // Date/heure d'envoi du message
  
    @ManyToOne(() => User, (user) => user.messages)
    user: User;
  
    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel: Channel;
}
