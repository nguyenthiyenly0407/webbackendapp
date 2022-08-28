import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationRepository, MessageRepository } from '../../repositories';
import { Conversation, ConversationSchema, Message, MessageSchema, User, UserSchema } from '../../entity';
import { FirebaseUploadUtil } from '../../utils/firebase-upload.util';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { EventSocketGateway } from '../../socket/socket.io';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }, {name: Conversation.name, schema: ConversationSchema}, { name: User.name, schema: UserSchema }]),
    ],
    controllers: [MessageController],
    providers: [MessageService, FirebaseUploadUtil, MessageRepository, EventSocketGateway, ConversationRepository],
    exports: [MessageService]
})
export class MessageModule {}
