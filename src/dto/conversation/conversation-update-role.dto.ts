import { ApiProperty } from "@nestjs/swagger";

export class ConversationUpdateRoleUser {
    @ApiProperty()
    role: string;
    @ApiProperty()
    userId: string;
}