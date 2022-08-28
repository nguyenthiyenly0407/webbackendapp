import { ApiProperty } from "@nestjs/swagger";

export class FilterParamDto {

    @ApiProperty({
        type: String,
        required: false
    })
    sort?: string;

    @ApiProperty({
        type: String,
        required: false
    })
    direction?: string;

    @ApiProperty({
        type: String,
        required: false
    })
    search?: string;

    @ApiProperty({
        type: Number,
        required: false
    })
    page?: number;

    @ApiProperty({
        type: Number,
        required: false
    })
    perPage?: number;
}