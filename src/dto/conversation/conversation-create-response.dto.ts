import { ApiProperty } from "@nestjs/swagger";

export class ConversationCreateResponseDto {
    @ApiProperty()
    conversationId: string;

    constructor(partial: Partial<ConversationCreateResponseDto>) {
        Object.assign(this, partial);
    }
}