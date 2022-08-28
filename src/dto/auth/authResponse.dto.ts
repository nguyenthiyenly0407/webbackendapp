import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty()
    token: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    isLoginFirst: boolean;

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial);
    }
}