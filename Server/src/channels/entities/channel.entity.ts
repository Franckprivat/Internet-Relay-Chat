import { Message } from "src/messages/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ nullable: true })
    topic: string; 
  
    @Column({ default: false })
    isPrivate: boolean;
  
    @ManyToOne(() => User, (user) => user.ownedChannels)
    owner: User;
  
    @ManyToMany(() => User, { cascade: true })
    @JoinTable() 
    users: User[];
  
    @OneToMany(() => Message, (message) => message.channel, { cascade: true })
    messages: Message[];
}
