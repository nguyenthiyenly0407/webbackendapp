import { ApiProperty } from "@nestjs/swagger";

export class FriendApproveDto {

    @ApiProperty()
    fromUserId: string;
}