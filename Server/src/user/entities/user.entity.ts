
import { Channel } from "src/channels/entities/channel.entity";
import { Message } from "src/messages/entities/message.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    nickname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    
    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @OneToMany(() => Channel, (channel) => channel.owner)
    ownedChannels: Channel[];
}
