import { ApiProperty } from "@nestjs/swagger";

export class AccountMessage {
    @ApiProperty()
    username: string;
    @ApiProperty()
    role?: string;
}
export class UserMessage {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    avatarUrl: string;
    @ApiProperty()
    account: AccountMessage;
}

export class MessageResponseDto {
   
    @ApiProperty()
    _id: string;

    @ApiProperty()
    conversationId: string;
    
    @ApiProperty()
    fromUserId: string;

    @ApiProperty()
    content: [string];

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Number;

    @ApiProperty()
    type: string;

    @ApiProperty()
    user?: UserMessage;

    @ApiProperty()
    status?: string;
}