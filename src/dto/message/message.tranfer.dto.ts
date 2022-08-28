import { ApiProperty } from "@nestjs/swagger";

export class MessageTranferDto {

    @ApiProperty()
    messageId: string;
}