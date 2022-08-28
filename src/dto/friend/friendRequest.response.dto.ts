import { ApiProperty } from "@nestjs/swagger";

export class AccountFriendRequest{
    @ApiProperty()
    username: string;
}
export class UserFriendRequest {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    avatarUrl: string;
    @ApiProperty()
    fullname: string;
    @ApiProperty()
    account: AccountFriendRequest;
}

export class FriendRequestResponseDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    fromUser: UserFriendRequest;
    @ApiProperty()
    updateAt: number;
    @ApiProperty()
    createAt: number;
    // @ApiProperty()
    // status: string;
}