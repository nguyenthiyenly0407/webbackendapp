import { ApiProperty } from "@nestjs/swagger";

export class ValidateEmailRequest {
    @ApiProperty()
    email: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    username: string;
}