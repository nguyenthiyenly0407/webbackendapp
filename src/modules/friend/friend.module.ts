import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSocketGateway } from '../../socket/socket.io';
import { Conversation, ConversationSchema, Friend, FriendRequest, FriendRequestSchema, FriendSchema, Message, MessageSchema, User, UserSchema } from '../../entity';
import { ConversationRepository, FriendRepository, FriendRequestRepository, MessageRepository, UserRepository } from '../../repositories';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { MessageService } from '../message/message.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Message.name, schema: MessageSchema }, 
                {name: Conversation.name, schema: ConversationSchema}, 
                { name: User.name, schema: UserSchema },
                {name: Friend.name, schema: FriendSchema},
                {name: FriendRequest.name, schema: FriendRequestSchema}]),
    ],
    controllers: [FriendController],
    providers: [FriendService, FriendRepository, FriendRequestRepository, ConversationRepository, MessageRepository, EventSocketGateway, MessageService, MessageRepository, UserRepository],
    exports: []
})

export class FriendModule {}