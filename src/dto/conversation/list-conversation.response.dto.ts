import { ApiProperty } from "@nestjs/swagger";
import { ListResponse } from "../core";
import { ConversationResponseDto } from "./conversation-response.dto";

export class ListConversationResponseDto extends ListResponse {

    @ApiProperty({
        type: ConversationResponseDto,
        isArray: true
    })
    data: ConversationResponseDto[];

    constructor(partial: Partial<ListConversationResponseDto>) {
        super();
        Object.assign(this, partial);
    }
}