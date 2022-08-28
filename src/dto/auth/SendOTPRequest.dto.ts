import { ApiProperty } from "@nestjs/swagger";

export class SendOTPRequestDto {
    @ApiProperty()
    fullname: string;
    @ApiProperty()
    email: string;
}