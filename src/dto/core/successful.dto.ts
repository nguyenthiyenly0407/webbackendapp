import { ApiProperty } from "@nestjs/swagger"

export class Successful {

    @ApiProperty(
        {
            default: 200
        }
    )
    statusCode: number;

    @ApiProperty()
    message: string

    constructor(message: string) {
        const partial: Partial<Successful> = {
            statusCode: 200,
            message: message
        }
        Object.assign(this, partial);
    }
}