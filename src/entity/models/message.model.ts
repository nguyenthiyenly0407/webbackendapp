import { ApiProperty } from "@nestjs/swagger";
import { UserMessage } from "../../dto";

export class MessageModel {

    @ApiProperty()
    conversationId: string;

    @ApiProperty()
    createdAt: Number;

    @ApiProperty()
    content: [string];

    @ApiProperty()
    type: string;

    @ApiProperty()
    fromUserId: string;

    // @ApiProperty()
    // user?: UserMessage;
}