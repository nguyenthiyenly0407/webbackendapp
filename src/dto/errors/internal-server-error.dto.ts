import { ApiProperty } from "@nestjs/swagger";

export class InternalServerErrorDTO {
    
    @ApiProperty({
        default: 500
    })
    statusCode: number;

    @ApiProperty({
        default: "Internal Server Error!"
    })
    error: string;

    constructor() {
        const partial: Partial<InternalServerErrorDTO> = {
            statusCode: 500,
            error: "Internal Server Error!"
        }
        Object.assign(this, partial);
    }
}