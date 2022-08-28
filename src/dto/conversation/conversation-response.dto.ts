import { ApiProperty } from "@nestjs/swagger";
import { MessageModel } from "../../entity/models/message.model";
import { AccountMessage } from "../message";

export class UserConversationResponse {

    @ApiProperty()
    _id?: string;

    @ApiProperty()
    account?: AccountMessage;

    @ApiProperty()
    avatarUrl?: string;
}
export class ConversationResponseDto {
   
    @ApiProperty()
    _id: string;

    @ApiProperty()
    conversationName: string;

    @ApiProperty({
        type: UserConversationResponse,
        isArray: true
    })
    users: UserConversationResponse[];
    

    @ApiProperty()
    lastMessage: MessageModel;
    
    @ApiProperty()
    readStatus: Object[];

    @ApiProperty()
    createdAt: number;

    @ApiProperty()
    updatedAt: number;
}