import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Friend extends Document {

    @Prop({
        type: MongooseSchema.Types.ObjectId,
    })
    userId: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
    })
    friendId: string;

    @Prop()
    createdAt: number;

    @Prop()
    updatedAt: number;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
