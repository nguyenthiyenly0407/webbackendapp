import { ApiProperty } from "@nestjs/swagger";

export class ListResponse {

    @ApiProperty()
    total: number;
}