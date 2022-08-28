import { ApiProperty } from "@nestjs/swagger";

export class FriendRequestCreateDto {
    @ApiProperty()
    toUserId: string;
}