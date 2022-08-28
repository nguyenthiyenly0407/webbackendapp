import { ApiProperty } from "@nestjs/swagger";

export class UserUpdateDto{
    @ApiProperty()
    fullname?: string;

    @ApiProperty()
    avatarUrl?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    about?: string;

    @ApiProperty()
    yearOrBirth?: number;

    constructor(partial: Partial<UserUpdateDto>) {
        Object.assign(this, partial);
    }
}