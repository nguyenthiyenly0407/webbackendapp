import { ApiProperty } from "@nestjs/swagger";

export class BadRequestErrorDto {
    
    @ApiProperty({
        default: 400
    })
    statusCode: number;

    @ApiProperty({
        default: "Bad request"
    })
    error: string;

    @ApiProperty()
    message: string[];

    constructor(message: string[]) {
        const partial: Partial<BadRequestErrorDto> = {
            statusCode: 400,
            error: "Bad request!",
            message: message
        }
        Object.assign(this, partial);
    }
}