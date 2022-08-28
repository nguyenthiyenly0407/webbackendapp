import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessageModel } from "./models/message.model";
import { UserModel } from "./models/user.model";


@Schema()
export class Conversation extends Document {

    @Prop()
    conversationName: string;

    @Prop({default: []})
    users: UserModel[];
    
    @Prop({type: MessageModel,default: null})
    lastMessage: MessageModel;
    
    @Prop({default: []})
    readStatus: Object[];

    @Prop()
    createdAt: number;

    @Prop()
    updatedAt: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
