import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationValidation } from '../../validations';
import { Conversation, ConversationSchema, Message, MessageSchema, User, UserSchema } from '../../entity';
import { ConversationRepository, MessageRepository, UserRepository } from '../../repositories';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MessageService } from '../message/message.service';
import { EventSocketGateway } from '../../socket/socket.io';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: Conversation.name, schema: ConversationSchema}, { name: Message.name, schema: MessageSchema },]),
    ],
    controllers: [ConversationController],
    providers: [ConversationRepository, ConversationService, ConversationValidation, MessageService, MessageRepository, UserRepository, EventSocketGateway],
    exports: []
})
export class ConversationModule {}
