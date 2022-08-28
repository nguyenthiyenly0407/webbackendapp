import { ApiProperty } from "@nestjs/swagger";

export class MessageCreateResponseDto {
    @ApiProperty()
    messageId: string;

    constructor(partial: Partial<MessageCreateResponseDto>) {
        Object.assign(this, partial);
    }
}