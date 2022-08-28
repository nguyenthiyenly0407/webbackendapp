import { ApiProperty } from "@nestjs/swagger";

export class ConversationCreateDto {
   
    @ApiProperty()
    conversationName: string;

    @ApiProperty()
    arrayUserId: string[];
}