import { HttpException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResourceNotFoundException{
    @ApiProperty({
        default: 404
    })
    statusCode: number;

    @ApiProperty({
        default: "Not found"
    })
    error: string;

    @ApiProperty()
    message: string;
    
    constructor(message: string) {
        const partial: Partial<ResourceNotFoundException> = {
            statusCode: 404,
            error: "Not found!",
            message: message
        }
        Object.assign(this, partial);
    }
}