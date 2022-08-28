import { ApiProperty } from "@nestjs/swagger";

export class ConversationAddUserDto {

    @ApiProperty({
        type: String,
        isArray: true
    })
    arrayUserId: string[]
}