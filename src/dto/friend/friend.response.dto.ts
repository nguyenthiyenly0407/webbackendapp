import { ApiProperty } from "@nestjs/swagger";

export class AccountFriend{
    @ApiProperty()
    username: string;
}
export class UserFriend {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    avatarUrl: string;
    @ApiProperty()
    account: AccountFriend;
    @ApiProperty()
    fullname: string;
}

export class FriendResponseDto {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    friend: UserFriend;
    @ApiProperty()
    updateAt: number;
    @ApiProperty()
    createAt: number;
    // @ApiProperty()
    // status: string;
}