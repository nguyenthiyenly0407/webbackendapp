import { ApiProperty } from "@nestjs/swagger";
import { AccountResponseDto } from "./account-reponse.dto";

export class UserResponseDto {

    @ApiProperty()
    _id: string;

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    avatarUrl: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    account: AccountResponseDto

    @ApiProperty()
    updatedAt: number;

    @ApiProperty()
    createdAt: number;

    @ApiProperty()
    friendRequestStatus?: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}