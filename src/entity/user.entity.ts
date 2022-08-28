import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Account } from "./models/account.model";
import { Document} from 'mongoose';

const AVATAR_DEFAULT = 'https://firebasestorage.googleapis.com/v0/b/app-chat-coding-club.appspot.com/o/avatar-mac-dinh.png?alt=media&token=fc408c47-1743-4e01-8d37-1f5460a718d8';
@Schema()
export class User extends Document {
    
    @Prop({})
    fullname: string;

    @Prop()
    address: string;

    @Prop({required: true})
    email: string;

    @Prop({default: AVATAR_DEFAULT})
    avatarUrl: string;

    @Prop()
    phone: string;

    @Prop({type: Account})
    account: Account;

    @Prop()
    about: string;

    @Prop()
    yearOrBirth: number;

    @Prop()
    updatedAt: number;

    @Prop()
    createdAt: number;

    @Prop({default: false})
    isLoginFirst: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);