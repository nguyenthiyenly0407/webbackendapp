import { ApiProperty } from "@nestjs/swagger";

export class ValidateOTPRequestDto {
    @ApiProperty()
    otp: string;
    @ApiProperty()
    email: string;
}