import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class FriendRequest extends Document {

    @Prop({
        type: MongooseSchema.Types.ObjectId,
    })
    fromUserId: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
    })
    toUserId: string;

    @Prop()
    createdAt: number;

    @Prop()
    updatedAt: number;

    @Prop()
    status: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);