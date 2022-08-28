import { ApiProperty } from "@nestjs/swagger";

export class UnFriendRequest {
    @ApiProperty()
    friendId: string;
}