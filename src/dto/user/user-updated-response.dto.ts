import { ApiProperty } from "@nestjs/swagger";
import { AccountResponseDto } from "./account-reponse.dto";

export class UserUpdateDtoResponse {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    fullname: string;

    @ApiProperty()
    avatarUrl: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    about: string;

    @ApiProperty()
    yearOrBirth: number;

    @ApiProperty()
    account: AccountResponseDto;

    @ApiProperty()
    updatedAt: number;

    @ApiProperty()
    createdAt: number;

    constructor(partial: Partial<UserUpdateDtoResponse>) {
        Object.assign(this, partial);
    }
}
